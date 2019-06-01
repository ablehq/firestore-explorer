"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.loadLocalMovies = movieMapperGenerator(exports.localMoviesJSON, exports.localMovies);
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
const batchifyArray = (items, batchSize) => {
    const pages = items.length / batchSize + 1;
    const batches = [];
    for (let index = 0; index < pages; index++) {
        const pageStart = index * batchSize;
        let pageEnd = pageStart + batchSize;
        if (pageEnd > items.length) {
            pageEnd = items.length;
        }
        batches.push(items.slice(pageStart, pageEnd));
    }
    return batches;
};
exports.seedToFirebase = (firebaseApp) => __awaiter(this, void 0, void 0, function* () {
    console.log("🏋️  Loading from local data/movies");
    exports.loadLocalMovies();
    exports.loadLocalLinks();
    exports.loadLocalTags();
    exports.loadLocalRatings();
    const batchSize = 500;
    const batchedMovies = batchifyArray(exports.localMoviesJSON, batchSize);
    console.log("⚡ Seeding movies to firebase");
    const moviesRef = firebaseApp.collection("movies");
    let snapshot = yield moviesRef.get();
    for (const [index, movieBatch] of batchedMovies.entries()) {
        const batchWriter = firebaseApp.batch();
        snapshot = yield moviesRef.get();
        console.log(`Current movies snapshot -- size now ${snapshot.size}`);
        for (const movie of movieBatch) {
            const movieId = `${movie.movieId}`;
            const movieRef = moviesRef.doc(movieId);
            let movieWithLink = Object.assign({}, movie);
            const link = exports.localLinks.get(movie.movieId);
            if (link) {
                movieWithLink = Object.assign({}, movieWithLink, { link: Object.assign({}, link) });
            }
            batchWriter.set(movieRef, movie);
        }
        yield batchWriter.commit();
        console.log(`Completed wiriting batch of size ${movieBatch.length} at index ${index}`);
    }
    snapshot = yield moviesRef.get();
    console.log(`Completed seeding all movies -- size now ${snapshot.size}`);
    console.log("⚡ Seeding tags to movies as sub collection");
    for (const [index, movie] of exports.localMoviesJSON.entries()) {
        const tagsRef = firebaseApp.collection("movies").doc(`${movie.movieId}`).collection("tags");
        let snapshot = yield tagsRef.get();
        console.log(`Current tags snapshot -- size now ${snapshot.size} for movie with id ${movie.movieId}`);
        const tags = exports.localTags.get(movie.movieId);
        if (tags && tags.length > 0) {
            console.log(`Found tags of size ${tags.length} for movie with id ${movie.movieId}`);
            for (const tag of tags) {
                yield tagsRef.add(tag);
            }
            console.log(`Completed wiriting tags of size ${tags.length} for movie ${movie.movieId}`);
            snapshot = yield tagsRef.get();
            console.log(`Current tags snapshot -- size now ${snapshot.size} for movie with id ${movie.movieId}`);
        }
        else {
            console.log(`No tags for movie with id ${movie.movieId}`);
        }
    }
});
//# sourceMappingURL=movies.js.map