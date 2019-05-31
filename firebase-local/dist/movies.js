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
exports.loadLocalMovies = () => {
    exports.localMoviesJSON.forEach(item => {
        exports.localMovies.set(item.movieId, item);
    });
};
const movieMapperGenerator = (dataJSON, dataMap) => {
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
exports.loadLocalLinks = movieMapperGenerator(exports.localLinksJSON, exports.localLinks);
exports.loadLocalTags = movieMapperGenerator(exports.localTagsJSON, exports.localTags);
exports.loadLocalRatings = movieMapperGenerator(exports.localRatingsJSON, exports.localRatings);
exports.seedToFirebase = (firebaseApp) => __awaiter(this, void 0, void 0, function* () {
    console.log("🏋️  Loading from local data/movies");
    exports.loadLocalMovies();
    exports.loadLocalLinks();
    exports.loadLocalTags();
    exports.loadLocalRatings();
    console.log("⚡ Seeding movies to firebase");
    //load movies
    const moviesRef = firebaseApp.collection("movies");
    let snapshot = yield moviesRef.get();
    console.log(`Current movies snapshot -- size now ${snapshot.size}`);
    const movies = exports.localMovies.values();
    const promises = [];
    for (const movie of movies) {
        const movieId = `${movie.movieId}`;
        promises.push(moviesRef
            .doc(movieId)
            .set(movie)
            .then(dat => {
            console.log(`Processed movie id ${movieId}`);
        }));
    }
    yield Promise.all(promises);
    snapshot = yield moviesRef.get();
    console.log(`Completed seeding all movies -- size now ${snapshot.size}`);
    console.log(`Completed seeding all movies`);
});
//# sourceMappingURL=movies.js.map