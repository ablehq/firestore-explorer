"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = require("ora");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
exports.localMovies = new Map();
exports.localLinks = new Map();
exports.localTags = new Map();
exports.localRatings = new Map();
exports.localMoviesJSON = require("../data/movies/movies.json");
exports.localLinksJSON = require("../data/movies/links.json");
exports.localTagsJSON = require("../data/movies/tags.json");
exports.localRatingsJSON = require("../data/movies/ratings.json");
const movieMapperGenerator = (dataJSON, dataMap) => {
    return () => {
        dataJSON.forEach(item => {
            dataMap.set(item.movieId, item);
        });
    };
};
exports.loadLocalMovies = (size) => {
    console.log(`Need to shorten array ${size}`);
    exports.localMoviesJSON.splice(0, exports.localMoviesJSON.length - size);
    movieMapperGenerator(exports.localMoviesJSON, exports.localMovies)();
};
exports.loadLocalLinks = movieMapperGenerator(exports.localLinksJSON, exports.localLinks);
const movieArrayMapperGenerator = (dataJSON, dataMap) => {
    return () => {
        if (exports.localMovies.size == 0) {
            throw new Error("Movies should be loaded first");
        }
        dataJSON.forEach(item => {
            const data = dataMap.get(item.movieId) || [];
            dataMap.set(item.movieId, [...data, item]);
        });
    };
};
exports.loadLocalTags = movieArrayMapperGenerator(exports.localTagsJSON, exports.localTags);
exports.loadLocalRatings = movieArrayMapperGenerator(exports.localRatingsJSON, exports.localRatings);
const tagRatingWriterObs = (firebaseApp, movie, collectionName, collectionData) => {
    const collectionRef = firebaseApp
        .collection("movies")
        .doc(`${movie.movieId}`)
        .collection(collectionName);
    const collection = collectionData.get(movie.movieId);
    const mergeables = [];
    if (collection && collection.length > 0) {
        for (const tag of collection) {
            let tagId = `${tag.movieId}-${tag.userId}-${tag.timestamp}`;
            tagId = tagId.toLowerCase();
            const obs = rxjs_1.from(collectionRef.doc(tagId).set(tag));
            mergeables.push(obs);
        }
    }
    if (mergeables.length > 0) {
        return rxjs_1.merge(mergeables).pipe(operators_1.reduce(() => {
            return movie;
        }, movie));
    }
    return rxjs_1.of(movie);
};
const tagWriterObs = (firebaseApp, movie) => tagRatingWriterObs(firebaseApp, movie, "tags", exports.localTags);
const ratingWriterObs = (firebaseApp, movie) => tagRatingWriterObs(firebaseApp, movie, "ratings", exports.localRatings);
const movieWriteObs = (firebaseApp, movie) => {
    const moviesRef = firebaseApp.collection("movies");
    const movieId = `${movie.movieId}`;
    return rxjs_1.from(moviesRef.doc(movieId).set(movie)).pipe(operators_1.map(_ => movie));
};
exports.seedToFirebase = (firebaseApp, size) => {
    exports.loadLocalMovies(size);
    exports.loadLocalTags();
    exports.loadLocalRatings();
    const movieSpinner = ora_1.default(`Start loding movies`).start();
    const moviesRef = firebaseApp.collection("movies");
    const snapShotObs = rxjs_1.from(moviesRef.get()).pipe(operators_1.map(snapshot => {
        return {
            items: new Array(),
            total: snapshot.size,
        };
    }));
    const dataObs = rxjs_1.from(exports.localMoviesJSON).pipe(operators_1.mergeMap(movie => rxjs_1.concat(movieWriteObs(firebaseApp, movie), rxjs_1.merge(tagWriterObs(firebaseApp, movie), ratingWriterObs(firebaseApp, movie))).pipe(operators_1.reduce((_, movie) => movie, movie))), operators_1.scan((acc, movie) => {
        acc.items.push(movie);
        return acc;
    }, {
        items: new Array(),
        total: exports.localMoviesJSON.length,
    }), operators_1.takeWhile(acc => acc.items.length < exports.localMoviesJSON.length));
    snapShotObs
        .pipe(operators_1.mergeMap(snapshot => rxjs_1.iif(() => snapshot.total > 0, rxjs_1.of({
        items: new Array(),
        total: exports.localMoviesJSON.length,
    }), dataObs)))
        .subscribe(val => {
        movieSpinner.text = `Loading movies ${val.items.length} / ${val.total}`;
    }, error => {
        movieSpinner.fail("Failed loading movies, restart firebase emulator and run yarn seed_movies");
        console.log(error);
    }, () => {
        movieSpinner.succeed("Completed loading movies");
        kickVerification(firebaseApp);
    });
};
const kickVerification = (firebaseApp) => {
    const movieSpinner = ora_1.default(`Checking data consistency`).start();
    const moviesRef = firebaseApp.collection("movies");
    const obs1 = rxjs_1.from(moviesRef.get()).pipe(operators_1.map(snapshot => {
        return snapshot.size === exports.localMoviesJSON.length;
    }));
    const obs2 = rxjs_1.from(exports.localMoviesJSON.filter(movie => exports.localTags.has(movie.movieId))).pipe(operators_1.mergeMap(movie => {
        return rxjs_1.from(firebaseApp
            .collection("movies")
            .doc(`${movie.movieId}`)
            .collection("tags")
            .get()).pipe(operators_1.map(snapshot => {
            const tags = exports.localTags.get(movie.movieId);
            if (tags && tags.length > 0) {
                if (tags.length === snapshot.size) {
                    return true;
                }
                return false;
            }
            return true;
        }));
    }));
    const obs3 = rxjs_1.from(exports.localMoviesJSON.filter(movie => exports.localRatings.has(movie.movieId))).pipe(operators_1.mergeMap(movie => {
        return rxjs_1.from(firebaseApp
            .collection("movies")
            .doc(`${movie.movieId}`)
            .collection("ratings")
            .get()).pipe(operators_1.map(snapshot => {
            const tags = exports.localRatings.get(movie.movieId);
            if (tags && tags.length > 0) {
                if (tags.length === snapshot.size) {
                    return true;
                }
                return false;
            }
            return true;
        }));
    }));
    rxjs_1.merge(obs1, obs2, obs3)
        .pipe(operators_1.reduce((acc, curr) => acc && curr, true))
        .subscribe(verified => {
        if (verified) {
            movieSpinner.succeed("Completed data verification");
        }
        else {
            movieSpinner.fail("Failed data verification");
        }
    });
};
exports.deleteFromFirebase = (firebaseApp) => {
    const movieSpinner = ora_1.default(`Start loding movies`).start();
    const batchSize = 100;
    const batchProcessTimeInMillis = 1000;
    const delDoc = (docRef) => {
        return rxjs_1.from(firebaseApp.doc(docRef).delete()).pipe(operators_1.mapTo(docRef));
    };
    const delMovieObs = (movieId) => {
        return rxjs_1.from(firebaseApp
            .collection("movies")
            .doc(`${movieId}`)
            .collection("tags")
            .get()).pipe(operators_1.tap(val => console.log(val)), operators_1.concatMap(snapshot => {
            let mergeables = [];
            const docsArray = snapshot.docs;
            docsArray.forEach((datum) => {
                mergeables.push(delDoc(datum.ref.path));
            });
            console.log(`Tags mergeable length is ${mergeables.length}`);
            if (mergeables.length === 0) {
                return rxjs_1.of("empty");
            }
            return rxjs_1.concat(mergeables).pipe(operators_1.reduce(() => {
                return movieId;
            }, movieId));
        }), operators_1.catchError(val => rxjs_1.of(`I caught: ${val}`)));
        // const ratingsRemovers = from(
        //   firebaseApp
        //     .collection("movies")
        //     .doc(`${movieId}`)
        //     .collection("ratings")
        //     .get(),
        // ).pipe(
        //   concatMap(snapshot => {
        //     let mergeables: Array<Observable<string>> = [];
        //     const docsArray = snapshot.docs;
        //     docsArray.forEach((datum: any) => {
        //       mergeables.push(delDoc(datum.ref.path));
        //     });
        //     console.log(`Ratings mergeable length is ${mergeables.length}`);
        //     if (mergeables.length === 0) {
        //       return of("empty");
        //     }
        //     return concat(mergeables).pipe(
        //       reduce(() => {
        //         return movieId;
        //       }, movieId),
        //     );
        //   }),
        // );
        // return concat(tagRemovers, ratingsRemovers).pipe(
        //   reduce(() => {
        //     return movieId;
        //   }, movieId),
        // );
    };
    // process deletion of 100 movies every 500ms
    rxjs_1.interval(batchProcessTimeInMillis)
        .pipe(operators_1.concatMap(val => {
        return rxjs_1.from(firebaseApp
            .collection("movies")
            .limit(batchSize)
            .get()).pipe(operators_1.map(snapshot => ({
            val,
            snapshot,
        })), operators_1.concatMap(({ val, snapshot }) => {
            let mergeables = [];
            const docsArray = snapshot.docs;
            docsArray.forEach((datum) => {
                mergeables.push(delMovieObs(datum.id));
            });
            if (mergeables.length === 0) {
                return rxjs_1.of({ val: val, size: snapshot.size });
            }
            return rxjs_1.concat(mergeables).pipe(operators_1.reduce(() => {
                return { val: val, size: snapshot.size };
            }, { val: val, size: snapshot.size }));
        }));
    }), operators_1.takeWhile(data => {
        return data.size > 0;
    }))
        .subscribe(data => {
        movieSpinner.text = `Evaluating batch number ${data.val}`;
    }, error => {
        console.log(error);
        movieSpinner.fail("Failed deleting movies content");
    }, () => {
        movieSpinner.succeed("Delete completed");
    });
};
//# sourceMappingURL=movies.js.map