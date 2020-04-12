import {FILM_TITLES, POSTERS, DESCRIPTIONS, GENRES, FILM_CARDS, EXTRA_FILM_CARDS, ORIGINAL_TITLE, DIRECTOR, WRITERS, ACTORS, RELEASE_DATE, COUNTRY} from "../const.js";
import {getRandomItem, getRandomNumber, getRandomDuration} from "../utils.js";

export const generateFilm = () => {
  return {
    poster: getRandomItem(POSTERS),
    title: getRandomItem(FILM_TITLES),
    orinalTitle: ORIGINAL_TITLE,
    director: DIRECTOR,
    writers: WRITERS,
    actors: ACTORS,
    releaseDate: RELEASE_DATE,
    country: COUNTRY,
    description: getRandomItem(DESCRIPTIONS),
    year: getRandomNumber(1920, 2020),
    genre: getRandomItem(GENRES),
    rating: Math.floor(Math.random() * 10),
    duration: getRandomDuration(115),
    comments: getRandomNumber(0, 5),
  };
};

const generateFilms = (count) => {
  return new Array(count)
      .fill(``)
      .map(generateFilm);
};

const generateMostRatedFilms = (count) => {
  return new Array(count)
      .fill(``)
      .map(generateFilm);
};

const generateMostCommentedFilms = (count) => {
  return new Array(count)
      .fill(``)
      .map(generateFilm);
};

export const generatedFilms = generateFilms(FILM_CARDS);
export const generatedMostRatedFilms = generateMostRatedFilms(EXTRA_FILM_CARDS);
export const generatedMostCommentedFilms = generateMostCommentedFilms(EXTRA_FILM_CARDS);
