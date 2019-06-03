import { Movie, Link, Rating, Tag } from "./models";
import * as firebase from "@firebase/testing";

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
  dataMap: Map<number, MovieID>
) => {
  return () => {
    dataJSON.forEach(item => {
      dataMap.set(item.movieId, item);
    });
  };
};

export const loadLocalMovies = movieMapperGenerator(localMoviesJSON, localMovies)
export const loadLocalLinks = movieMapperGenerator(localLinksJSON, localLinks);


const movieArrayMapperGenerator = (
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

export const loadLocalTags = movieArrayMapperGenerator(localTagsJSON, localTags);
export const loadLocalRatings = movieArrayMapperGenerator(
  localRatingsJSON,
  localRatings
);

const batchifyArray = <T>(items: Array<T>, batchSize: number): Array<Array<T>> => {
  const pages = items.length / batchSize + 1
  const batches: Array<Array<T>> = []
  for (let index = 0; index < pages; index++) {
    const pageStart = index * batchSize
    let pageEnd = pageStart + batchSize
    if (pageEnd > items.length) {
      pageEnd = items.length
    }
    batches.push(items.slice(pageStart, pageEnd))
  }
  return batches
}

export const seedToFirebase = async (
  firebaseApp: firebase.firestore.Firestore
) => {
  console.log("🏋️  Loading from local data/movies");
  loadLocalMovies()
  loadLocalLinks()
  loadLocalTags()
  loadLocalRatings()
  const batchSize = 500
  const batchedMovies = batchifyArray(localMoviesJSON, batchSize)
  console.log("⚡ Seeding movies to firebase");
  const moviesRef = firebaseApp.collection("movies");
  let snapshot = await moviesRef.get();
  for (const [index, movieBatch] of batchedMovies.entries()) {
    const batchWriter = firebaseApp.batch()
    snapshot = await moviesRef.get();
    console.log(`Current movies snapshot -- size now ${snapshot.size}`);
    for (const movie of movieBatch) {
      const movieId = `${movie.movieId}`;
      const movieRef = moviesRef.doc(movieId)
      let movieWithLink: Movie & ({
        link: Link
      } | {}) = {
        ...movie,
      }
      const link = localLinks.get(movie.movieId)
      if (link) {
        movieWithLink = {
          ...movieWithLink,
          link: {
            ...link
          }
        }
      }
      batchWriter.set(movieRef, movie)
    }
    await batchWriter.commit()
    console.log(`Completed wiriting batch of size ${movieBatch.length} at index ${index}`);
  }
  snapshot = await moviesRef.get();
  console.log(`Completed seeding all movies -- size now ${snapshot.size}`);
  console.log("⚡ Seeding tags to movies as sub collection");
  for (const [index, movie] of localMoviesJSON.entries()) {
    addTagsOrRatingsRef(firebaseApp, movie, "tags", localTags)
    addTagsOrRatingsRef(firebaseApp, movie, "ratings", localRatings)
  }
};

const addTagsOrRatingsRef = async <T>(firebaseApp: firebase.firestore.Firestore, movie: Movie, collectionName: string, collectionData: Map<number, Array<T>>) => {
  const collectionRef = firebaseApp.collection("movies").doc(`${movie.movieId}`).collection(collectionName);
  let snapshot = await collectionRef.get();
  console.log(`Current ${collectionName} snapshot -- size now ${snapshot.size} for movie with id ${movie.movieId}`);
  const collection = collectionData.get(movie.movieId)
  if (collection && collection.length > 0) {
    console.log(`Found ${collectionName} of size ${collection.length} for movie with id ${movie.movieId}`);
    for (const tag of collection) {
      await collectionRef.add(tag)
    }
    console.log(`Completed wiriting ${collectionName} of size ${collection.length} for movie ${movie.movieId}`);
    snapshot = await collectionRef.get();
    console.log(`Current ${collectionName} snapshot -- size now ${snapshot.size} for movie with id ${movie.movieId}`);
  } else {
    console.log(`No collection for movie with id ${movie.movieId}`);
  }
}
