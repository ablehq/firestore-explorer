import * as firebase from "@firebase/testing";
import ora from "ora";
import { concat, from, merge, of } from "rxjs";
import { map, mergeMap, reduce, scan, takeWhile } from "rxjs/operators";
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
  dataMap: Map<number, MovieID>
) => {
  return () => {
    dataJSON.forEach(item => {
      dataMap.set(item.movieId, item);
    });
  };
};

export const loadLocalMovies = movieMapperGenerator(
  localMoviesJSON,
  localMovies
);
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

export const loadLocalTags = movieArrayMapperGenerator(
  localTagsJSON,
  localTags
);
export const loadLocalRatings = movieArrayMapperGenerator(
  localRatingsJSON,
  localRatings
);

const tagRatingWriterObs = (
  firebaseApp: firebase.firestore.Firestore,
  movie: Movie,
  collectionName: string,
  collectionData: Map<number, Array<Tag | Rating>>
) => {
  const collectionRef = firebaseApp
    .collection("movies")
    .doc(`${movie.movieId}`)
    .collection(collectionName);
  const collection = collectionData.get(movie.movieId);
  const mergeables = [];
  if (collection && collection.length > 0) {
    for (const tag of collection) {
      const obs = from(collectionRef.add(tag));
      mergeables.push(obs);
    }
  }
  if (mergeables.length > 0) {
    return merge(mergeables).pipe(
      reduce(() => {
        return movie;
      }, movie)
    );
  }
  return of(movie);
};

const tagWriterObs = (
  firebaseApp: firebase.firestore.Firestore,
  movie: Movie
) => tagRatingWriterObs(firebaseApp, movie, "tags", localTags);

const ratingWriterObs = (
  firebaseApp: firebase.firestore.Firestore,
  movie: Movie
) => tagRatingWriterObs(firebaseApp, movie, "ratings", localRatings);

const movieWriteObs = (
  firebaseApp: firebase.firestore.Firestore,
  movie: Movie
) => {
  const moviesRef = firebaseApp.collection("movies");
  const movieId = `${movie.movieId}`;
  return from(moviesRef.doc(movieId).set(movie)).pipe(map(_ => movie));
};

export const seedToFirebase = (firebaseApp: firebase.firestore.Firestore) => {
  const movieSpinner = ora(`Start loding movies`).start();

  const obs1 = from(localMoviesJSON).pipe(
    mergeMap(movie =>
      concat(
        movieWriteObs(firebaseApp, movie),
        merge(
          tagWriterObs(firebaseApp, movie),
          ratingWriterObs(firebaseApp, movie)
        )
      ).pipe(reduce((_, movie) => movie, movie))
    ),
    scan(
      (acc, movie: Movie) => {
        acc.items.push(movie);
        return acc;
      },
      {
        items: new Array<Movie>(),
        total: localLinksJSON.length
      }
    ),
    takeWhile(acc => acc.items.length < localMoviesJSON.length)
  );
  obs1.subscribe(
    val => {
      movieSpinner.text = `Loading movies ${val.items.length} / ${val.total}`;
    },
    error => {
      movieSpinner.fail("Failed loading movies");
      console.log(error);
    },
    () => {
      movieSpinner.succeed("Completed loading movies");
      kickVerification(firebaseApp);
    }
  );
};

const kickVerification = (firebaseApp: firebase.firestore.Firestore) => {
  const movieSpinner = ora(`Checking data consistency`).start();
  const moviesRef = firebaseApp.collection("movies");
  const obs1 = from(moviesRef.get()).pipe(
    map(snapshot => {
      return snapshot.size === localMoviesJSON.length;
    })
  );
  const obs2 = from(
    localMoviesJSON.filter(movie => localTags.has(movie.movieId))
  ).pipe(
    mergeMap(movie => {
      return from(
        firebaseApp
          .collection("movies")
          .doc(`${movie.movieId}`)
          .collection("tags")
          .get()
      ).pipe(
        map(snapshot => {
          const tags = localTags.get(movie.movieId);
          if (tags) {
            if (tags.length === snapshot.size) {
              return true;
            }
            return false;
          }
          return true;
        })
      );
    })
  );
  const obs3 = from(
    localMoviesJSON.filter(movie => localRatings.has(movie.movieId))
  ).pipe(
    mergeMap(movie => {
      return from(
        firebaseApp
          .collection("movies")
          .doc(`${movie.movieId}`)
          .collection("ratings")
          .get()
      ).pipe(
        map(snapshot => {
          const tags = localRatings.get(movie.movieId);
          if (tags) {
            if (tags.length === snapshot.size) {
              return true;
            }
            return false;
          }
          return true;
        })
      );
    })
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
