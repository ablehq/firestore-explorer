import {
  loadLocalMovies,
  localMovies,
  localLinks,
  loadLocalLinks,
  localTags,
  loadLocalTags,
  localRatings,
  loadLocalRatings
} from "../src/movies";

const moviesSize = 9742;
const tagsSize = 1572;
const ratingsSize = 9724;
test("Should load local movies into map", () => {
  expect(localMovies.size).toBe(0);
  loadLocalMovies();
  expect(localMovies.size).toBe(moviesSize);
});

test("Should load local links into map", () => {
  loadLocalMovies();
  expect(localLinks.size).toBe(0);
  loadLocalLinks();
  expect(localLinks.size).toBe(moviesSize);
});

test("Should load local tags into map", () => {
  loadLocalMovies();
  expect(localTags.size).toBe(0);
  loadLocalTags();
  expect(localTags.size).toBe(tagsSize);
});

test("Should load local ratings into map", () => {
  loadLocalMovies();
  expect(localRatings.size).toBe(0);
  loadLocalRatings();
  expect(localRatings.size).toBe(ratingsSize);
});
