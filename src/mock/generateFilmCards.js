import {FILM_TITLES, POSTERS, DESCRIPTIONS, GENRES, FILM_CARDS, EXTRA_FILM_CARDS} from "../const.js";
import {getRandomItem, getRandomNumber, getRandomDuration} from "../utils.js";

export const generateFilm = () => {
  return {
    title: getRandomItem(FILM_TITLES),
    poster: getRandomItem(POSTERS),
    description: getRandomItem(DESCRIPTIONS),
    year: getRandomNumber(1920, 2020),
    genre: getRandomItem(GENRES),
    rating: getRandomNumber(1, 10),
    duration: getRandomDuration(115)
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
