import {FILM_TITLES, POSTERS, DESCRIPTIONS, GENRES, NUMBER_OF_CARDS, ORIGINAL_TITLE, DIRECTOR, WRITERS, ACTORS, RELEASE_DATE, COUNTRY} from "../const.js";
import {getRandomItem, getRandomNumber, getRandomDuration} from "../utils.js";
import {generateComments} from "./generateComments.js";

export const generateFilm = () => {
  return {
    poster: getRandomItem(POSTERS),
    title: getRandomItem(FILM_TITLES),
    originalTitle: ORIGINAL_TITLE,
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
    comments: generateComments(),
    addToWatchList: (Math.floor(Math.random() * 2) === 0),
    markAsWatched: (Math.floor(Math.random() * 2) === 0),
    favourite: (Math.floor(Math.random() * 2) === 0)
  };
};

const generateFilms = (count) => {
  return new Array(count)
      .fill(``)
      .map(generateFilm);
};

export const generatedFilms = generateFilms(NUMBER_OF_CARDS);

