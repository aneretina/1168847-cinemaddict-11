import {MENU_OPTIONS} from "../const.js";

export const generateMenu = (generatedFilms) => {
  let filteredFilms = [0, 0, 0, 0];

  generatedFilms.forEach((film) => {
    if (film.addedToWatchList) {
      filteredFilms[1]++;
    }
    if (film.markedAsWatched) {
      filteredFilms[2]++;
    }
    if (film.isFavorite) {
      filteredFilms[3]++;
    }
  });

  return MENU_OPTIONS.map((it, index) => {
    return {
      name: it,
      count: filteredFilms[index]
    };
  });
};

