import ora from "ora";
import { Firestore, QueryDocumentSnapshot } from "@google-cloud/firestore";
import { concat, from, merge, of, iif, interval, Observable } from "rxjs";
import {
  map,
  mergeMap,
  reduce,
  scan,
  takeWhile,
  concatMap,
  mapTo,
  tap,
  catchError,
} from "rxjs/operators";
import { Link, Movie, Rating, Tag } from "./models";

export const localMovies = new Map<number, Movie>();
export const localLinks = new Map<number, Link>();
export const localTags = new Map<number, Array<Tag>>();
export const localRatings = new Map<number, Array<Rating>>();

export const localMoviesJSON: Array<
  Movie
> = require("../data/movies/movies.json");
export const localLinksJSON: Array<Link> = require("../data/movies/links.json");
export const localTagsJSON: Array<Tag> = require("../data/movies/tags.json");
export const localRatingsJSON: Array<
  Rating
> = require("../data/movies/ratings.json");

type MovieID = Movie | Link | Rating | Tag;

const movieMapperGenerator = (
  dataJSON: Array<MovieID>,
  dataMap: Map<number, MovieID>,
) => {
  return () => {
    dataJSON.forEach(item => {
      dataMap.set(item.movieId, item);
    });
  };
};

export const loadLocalMovies = (size: number) => {
  console.log(`Need to shorten array ${size}`);
  localMoviesJSON.splice(0, localMoviesJSON.length - size);
  movieMapperGenerator(localMoviesJSON, localMovies)();
};
export const loadLocalLinks = movieMapperGenerator(localLinksJSON, localLinks);

const movieArrayMapperGenerator = (
  dataJSON: Array<MovieID>,
  dataMap: Map<number, Array<MovieID>>,
) => {
  return () => {
    if (localMovies.size == 0) {
      throw new Error("Movies should be loaded first");
    }
    dataJSON.forEach(item => {
      const data: Array<MovieID> = dataMap.get(item.movieId) || [];
      dataMap.set(item.movieId, [...data, item]);
    });
  };
};

export const loadLocalTags = movieArrayMapperGenerator(
  localTagsJSON,
  localTags,
);
export const loadLocalRatings = movieArrayMapperGenerator(
  localRatingsJSON,
  localRatings,
);

const tagRatingWriterObs = (
  firebaseApp: firebase.firestore.Firestore | Firestore,
  movie: Movie,
  collectionName: string,
  collectionData: Map<number, Array<Tag | Rating>>,
) => {
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
      const obs = from(collectionRef.doc(tagId).set(tag));
      mergeables.push(obs);
    }
  }
  if (mergeables.length > 0) {
    return merge(mergeables).pipe(
      reduce(() => {
        return movie;
      }, movie),
    );
  }
  return of(movie);
};

const tagWriterObs = (
  firebaseApp: firebase.firestore.Firestore | Firestore,
  movie: Movie,
) => tagRatingWriterObs(firebaseApp, movie, "tags", localTags);

const ratingWriterObs = (
  firebaseApp: firebase.firestore.Firestore | Firestore,
  movie: Movie,
) => tagRatingWriterObs(firebaseApp, movie, "ratings", localRatings);

const movieWriteObs = (
  firebaseApp: firebase.firestore.Firestore | Firestore,
  movie: Movie,
) => {
  const moviesRef = firebaseApp.collection("movies");
  const movieId = `${movie.movieId}`;
  return from(moviesRef.doc(movieId).set(movie)).pipe(map(_ => movie));
};

export const seedToFirebase = (
  firebaseApp: firebase.firestore.Firestore | Firestore,
  size: number,
) => {
  loadLocalMovies(size);
  loadLocalTags();
  loadLocalRatings();
  const movieSpinner = ora(`Start loding movies`).start();
  const moviesRef = firebaseApp.collection("movies");
  const snapShotObs = from(moviesRef.get()).pipe(
    map(snapshot => {
      return {
        items: new Array<Movie>(),
        total: snapshot.size,
      };
    }),
  );

  const dataObs = from(localMoviesJSON).pipe(
    mergeMap(movie =>
      concat(
        movieWriteObs(firebaseApp, movie),
        merge(
          tagWriterObs(firebaseApp, movie),
          ratingWriterObs(firebaseApp, movie),
        ),
      ).pipe(reduce((_, movie) => movie, movie)),
    ),
    scan(
      (acc, movie: Movie) => {
        acc.items.push(movie);
        return acc;
      },
      {
        items: new Array<Movie>(),
        total: localMoviesJSON.length,
      },
    ),
    takeWhile(acc => acc.items.length < localMoviesJSON.length),
  );

  snapShotObs
    .pipe(
      mergeMap(snapshot =>
        iif(
          () => snapshot.total > 0,
          of({
            items: new Array<Movie>(),
            total: localMoviesJSON.length,
          }),
          dataObs,
        ),
      ),
    )
    .subscribe(
      val => {
        movieSpinner.text = `Loading movies ${val.items.length} / ${val.total}`;
      },
      error => {
        movieSpinner.fail(
          "Failed loading movies, restart firebase emulator and run yarn seed_movies",
        );
        console.log(error);
      },
      () => {
        movieSpinner.succeed("Completed loading movies");
        kickVerification(firebaseApp);
      },
    );
};

const kickVerification = (
  firebaseApp: firebase.firestore.Firestore | Firestore,
) => {
  const movieSpinner = ora(`Checking data consistency`).start();
  const moviesRef = firebaseApp.collection("movies");
  const obs1 = from(moviesRef.get()).pipe(
    map(snapshot => {
      return snapshot.size === localMoviesJSON.length;
    }),
  );
  const obs2 = from(
    localMoviesJSON.filter(movie => localTags.has(movie.movieId)),
  ).pipe(
    mergeMap(movie => {
      return from(
        firebaseApp
          .collection("movies")
          .doc(`${movie.movieId}`)
          .collection("tags")
          .get(),
      ).pipe(
        map(snapshot => {
          const tags = localTags.get(movie.movieId);
          if (tags && tags.length > 0) {
            if (tags.length === snapshot.size) {
              return true;
            }
            return false;
          }
          return true;
        }),
      );
    }),
  );
  const obs3 = from(
    localMoviesJSON.filter(movie => localRatings.has(movie.movieId)),
  ).pipe(
    mergeMap(movie => {
      return from(
        firebaseApp
          .collection("movies")
          .doc(`${movie.movieId}`)
          .collection("ratings")
          .get(),
      ).pipe(
        map(snapshot => {
          const tags = localRatings.get(movie.movieId);
          if (tags && tags.length > 0) {
            if (tags.length === snapshot.size) {
              return true;
            }
            return false;
          }
          return true;
        }),
      );
    }),
  );
  merge(obs1, obs2, obs3)
    .pipe(reduce((acc, curr) => acc && curr, true))
    .subscribe(verified => {
      if (verified) {
        movieSpinner.succeed("Completed data verification");
      } else {
        movieSpinner.fail("Failed data verification");
      }
    });
};

export const deleteFromFirebase = (
  firebaseApp: firebase.firestore.Firestore | Firestore,
) => {
  const movieSpinner = ora(`Start loding movies`).start();
  const batchSize = 100;
  const batchProcessTimeInMillis = 1000;

  const delDoc = (docRef: string) => {
    return from(firebaseApp.doc(docRef).delete()).pipe(mapTo(docRef));
  };

  const delMovieObs = (movieId: string) => {
    return from(
      firebaseApp
        .collection("movies")
        .doc(`${movieId}`)
        .collection("tags")
        .get(),
    ).pipe(
      tap(val => console.log(val)),
      concatMap(snapshot => {
        let mergeables: Array<Observable<string>> = [];
        const docsArray = snapshot.docs;
        docsArray.forEach((datum: any) => {
          mergeables.push(delDoc(datum.ref.path));
        });
        console.log(`Tags mergeable length is ${mergeables.length}`);
        if (mergeables.length === 0) {
          return of("empty");
        }
        return concat(mergeables).pipe(
          reduce(() => {
            return movieId;
          }, movieId),
        );
      }),
      catchError(val => of(`I caught: ${val}`)),
    );
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
  interval(batchProcessTimeInMillis)
    .pipe(
      concatMap(val => {
        return from(
          firebaseApp
            .collection("movies")
            .limit(batchSize)
            .get(),
        ).pipe(
          map(snapshot => ({
            val,
            snapshot,
          })),
          concatMap(({ val, snapshot }) => {
            let mergeables: Array<Observable<string>> = [];
            const docsArray = snapshot.docs;
            docsArray.forEach((datum: any) => {
              mergeables.push(delMovieObs(datum.id));
            });
            if (mergeables.length === 0) {
              return of({ val: val, size: snapshot.size });
            }
            return concat(mergeables).pipe(
              reduce(
                () => {
                  return { val: val, size: snapshot.size };
                },
                { val: val, size: snapshot.size },
              ),
            );
          }),
        );
      }),
      takeWhile(data => {
        return data.size > 0;
      }),
    )
    .subscribe(
      data => {
        movieSpinner.text = `Evaluating batch number ${data.val}`;
      },
      error => {
        console.log(error);
        movieSpinner.fail("Failed deleting movies content");
      },
      () => {
        movieSpinner.succeed("Delete completed");
      },
    );
};
