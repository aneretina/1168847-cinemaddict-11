import AbstractComponent from "./abstract-component.js";
import moment from "moment";
import {formatDuration} from "../utils/common.js";
import {MAX_SYMBOLS_DESCRIPTION} from "../const.js";

const createControlsTemplate = (control) => {
  const {addedToWatchList, markedAsWatched, isFavorite} = control;
  const selectedWatchList = addedToWatchList ? `film-card__controls-item--active` : ``;
  const selectedWatched = markedAsWatched ? `film-card__controls-item--active` : ``;
  const selectedFavorite = isFavorite ? `film-card__controls-item--active` : ``;
  return (
    `<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${selectedWatchList}">Add to watchlist</button>
     <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${selectedWatched}">Mark as watched</button>
     <button class="film-card__controls-item button film-card__controls-item--favorite ${selectedFavorite}">Mark as favorite</button>`
  );
};

const createFilmCardTemplate = (film) => {
  const {id, title, poster, description, comments, rating, year, duration, genre} = film;
  const controls = createControlsTemplate(film);
  const filmYear = moment(year).format(`YYYY`);
  const filmDuration = formatDuration(duration);
  const slicedDescription = description.length >= MAX_SYMBOLS_DESCRIPTION ? `${description.substring(0, MAX_SYMBOLS_DESCRIPTION)}...` : description;

  return (
    `<article class="film-card" id = "${id}">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${filmYear}</span>
          <span class="film-card__duration">${filmDuration}</span>
          <span class="film-card__genre">${genre.slice(0, 1)}</span>
        </p>
        <img src=${poster} alt="${title}" class="film-card__poster">
        <p class="film-card__description">${slicedDescription}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          ${controls}
        </form>
      </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  setClickPopupShowElementsHandler(handler) {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    const title = this.getElement().querySelector(`.film-card__title`);
    const comments = this.getElement().querySelector(`.film-card__comments`);
    const popupShowElements = [poster, title, comments];

    popupShowElements.forEach((element) => {
      element.addEventListener(`click`, () => {
        handler(this._film);
      });
    });
  }

  setAddToWatchListButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
    .addEventListener(`click`, handler);
  }

  setMarkAsWatchButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
    .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
    .addEventListener(`click`, handler);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }
}
