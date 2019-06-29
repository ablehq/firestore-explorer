export interface Movie {
  movieId: number;
  title: string;
  genres: string;
}
export interface Link {
  movieId: number;
  imdbId: string;
  tmdbId: number;
}
export interface Rating {
  userId: number;
  movieId: number;
  rating: number;
  timestamp: number;
}
export interface Tag {
  userId: number;
  movieId: number;
  tag: string;
  timestamp: number;
}
export interface FirebaseAuth {
  uid: string;
  name: string;
}
