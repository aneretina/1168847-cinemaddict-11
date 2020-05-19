import AbstractSmartComponent from "./abstractSmartComponent.js";
import CommentComponent from "./comment.js";

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
  const {poster, title, description, rating, duration, genre, comments, originalTitle, director, writers, actors, year, country} = film;
  const controls = createControlsTemplate(film);
  const commentComponent = new CommentComponent(comments).getTemplate();
  const genreMarkup = createGenreMarkup(genre);

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
                  <td class="film-details__cell">${year.format(`DD MMMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
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
        </div>
        ${commentComponent}
      </form>
    </section>`
  );
};

export default class Popup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._currentEmoji = null;
    this._controlButtonsChangeHandler = null;
    this._setCommentsEmoji();

    this._commentInputs = this.getElement().querySelector(`.film-details__comment-input`);
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
    this.setCommentsDeleteButtonClickHandler(this._deleteCommentsButtonClickHandler);
    this.setSendCommentHandler(this._sendCommentHandler);
    this._setCommentsEmoji();
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

  clearPopupEmojiContainer() {
    this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
  }

  _setCommentsEmoji() {
    const emojiList = this.getElement().querySelector(`.film-details__emoji-list`);
    const emojiPlace = this.getElement().querySelector(`.film-details__add-emoji-label`);

    emojiList.addEventListener(`click`, (evt) => {
      const emojiLabel = evt.target.closest(`.film-details__emoji-label img`);
      if (emojiLabel) {
        this._currentEmoji = emojiLabel.dataset.emoji;
        const selectedEmoji = emojiLabel.cloneNode(true);
        selectedEmoji.style.width = `55px`;
        selectedEmoji.style.height = `55px`;


        if (emojiPlace.children.length === 0) {
          emojiPlace.append(selectedEmoji);
        }

        if (emojiPlace.children.length === 1) {
          emojiPlace.replaceChild(selectedEmoji, emojiPlace.querySelector(`img`));
        }
      }
    });
  }

  setCommentsDeleteButtonClickHandler(handler) {
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtons.forEach((button) => button.addEventListener(`click`, handler));
    this._deleteCommentsButtonClickHandler = handler;
  }

  setSendCommentHandler(handler) {
    this._commentInputs.addEventListener(`keydown`, handler);
    this._sendCommentHandler = handler;
  }

  getCurrentEmoji() {
    return this._currentEmoji;
  }

  reset() {
    this._commentInputs.value = ``;
  }
}
