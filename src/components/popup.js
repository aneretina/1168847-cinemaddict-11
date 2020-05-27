import AbstractSmartComponent from "./abstractSmartComponent.js";
import moment from "moment";
import {formaDuration} from "../utils/common.js";

const createGenreMarkup = (genres) => {
  return genres
    .map((genre) => {
      return (
        `<span class="film-details__genre">${genre}</span>`
      );
    }).join(`\n`);
};

const createControlsTemplate = (control) => {
  const {addedToWatchList, markedAsWatched, isFavorite} = control;
  const selectedWatchList = addedToWatchList ? `checked` : ``;
  const selectedWatched = markedAsWatched ? `checked` : ``;
  const selectedFavorite = isFavorite ? `checked` : ``;

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${selectedWatchList}>
    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${selectedWatched}>
    <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${selectedFavorite}>
    <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`
  );
};


const createPopupTemplate = (film) => {
  const {poster, title, description, rating, duration, genre, originalTitle, director, writers, actors, year, country} = film;
  const controls = createControlsTemplate(film);
  const genreMarkup = createGenreMarkup(genre);
  const filmYear = moment(year).format(`DD MMMM YYYY`);
  const filmDuration = formaDuration(duration);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>

    
            <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src=${poster} alt="${title}">
    
              <p class="film-details__age">18+</p>
            </div>
    
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>
    
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
    
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${filmYear}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${filmDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
                  <td class="film-details__cell">
                  ${genreMarkup}
                </tr>
              </table>
           
              <p class="film-details__film-description">${description}</p>
            </div>
          </div>
          </div>
          <section class="film-details__controls">
            ${controls}
          </section>
         <div class="form-details__bottom-container>
        </div>
        </div>
      </form>
    </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;

    this._controlButtonsChangeHandler = null;
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this.setControlButtonsChangeHandler(this._controlButtonsChangeHandler);
    this.setPopupCloseButtonClickHandler(this.popupCloseButtonClickHandler);
    this.removePopupCloseButtonClickHandler(this._removeButtonHandler);
  }

  setControlButtonsChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`click`, (evt) => {
      handler(evt.target.name);
    });
    this._controlButtonsChangeHandler = handler;
  }

  setPopupCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);

    this.popupCloseButtonClickHandler = handler;
  }

  removePopupCloseButton(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);

    this.removeButtonHandler = handler;
  }
}
