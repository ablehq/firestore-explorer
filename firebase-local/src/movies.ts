import { Movie, Link, Rating, Tag } from "./models";
import * as firebase from "@firebase/testing";

export const localMovies = new Map<number, Movie>();
export const localLinks = new Map<number, Array<Link>>();
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

export const loadLocalMovies = () => {
  localMoviesJSON.forEach(item => {
    localMovies.set(item.movieId, item);
  });
};

type MovieID = Link | Rating | Tag;

const movieMapperGenerator = (
  dataJSON: Array<MovieID>,
  dataMap: Map<number, Array<MovieID>>
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

export const loadLocalLinks = movieMapperGenerator(localLinksJSON, localLinks);
export const loadLocalTags = movieMapperGenerator(localTagsJSON, localTags);
export const loadLocalRatings = movieMapperGenerator(
  localRatingsJSON,
  localRatings
);

export const seedToFirebase = async (
  firebaseApp: firebase.firestore.Firestore
) => {
  console.log("🏋️  Loading from local data/movies");
  loadLocalMovies();
  loadLocalLinks();
  loadLocalTags();
  loadLocalRatings();
  console.log("⚡ Seeding movies to firebase");
  //load movies
  const moviesRef = firebaseApp.collection("movies");
  let snapshot = await moviesRef.get();
  console.log(`Current movies snapshot -- size now ${snapshot.size}`);
  const movies = localMovies.values();
  const promises = [];
  for (const movie of movies) {
    const movieId = `${movie.movieId}`;
    promises.push(
      moviesRef
        .doc(movieId)
        .set(movie)
        .then(dat => {
          console.log(`Processed movie id ${movieId}`);
        })
    );
  }
  await Promise.all(promises);
  snapshot = await moviesRef.get();
  console.log(`Completed seeding all movies -- size now ${snapshot.size}`);
  console.log(`Completed seeding all movies`);
};
