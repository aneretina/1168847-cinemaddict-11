import {FILM_TITLES, POSTERS, DESCRIPTIONS, GENRES, ORIGINAL_TITLE, DIRECTOR, WRITERS, ACTORS, RELEASE_DATE, COUNTRY} from "../const.js";
import {getRandomItem, getRandomNumber, getRandomDuration, getRandomDate} from "../utils/common.js";
import {generateComments} from "./generateComments.js";
import moment from "moment";

const generateGenre = () => {
  const genreList = [];
  const countGenre = getRandomNumber(1, GENRES.length);
  for (let i = 0; i < countGenre; i++) {
    genreList.push(getRandomItem(GENRES));
  }
  return genreList;
};

export const generateFilm = () => {
  return {
    id: String(new Date().getTime() + Math.random()),
    poster: getRandomItem(POSTERS),
    title: getRandomItem(FILM_TITLES),
    originalTitle: ORIGINAL_TITLE,
    director: DIRECTOR,
    writers: WRITERS,
    actors: ACTORS,
    releaseDate: RELEASE_DATE,
    country: COUNTRY,
    description: getRandomItem(DESCRIPTIONS),
    year: moment(getRandomDate(new Date(`01.01.2010`), new Date())),
    genre: generateGenre(),
    rating: Math.floor(Math.random() * 10),
    duration: moment(getRandomDuration(getRandomNumber(30, 300)), `h mm`),
    comments: generateComments(),
    addedToWatchList: (Math.floor(Math.random() * 2) === 0),
    markedAsWatched: (Math.floor(Math.random() * 2) === 0),
    isFavorite: (Math.floor(Math.random() * 2) === 0),
    watchedDate: moment(getRandomDate(new Date(`05.10.2020`), new Date()))
  };
};

export const generateFilms = (count) => {
  return new Array(count)
      .fill(``)
      .map(generateFilm);
};

