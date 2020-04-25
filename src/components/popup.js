import AbstractComponent from "./abstractComponent.js";

import {EMOJIS} from "../const.js";

const createCommentsTemplate = (comments) => {
  return comments
    .map((comment) => {
      return (
        `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
      <img src=${comment.emoji} width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${comment.date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
      );
    }).join(`\n`);
};

const createEmojiMarkup = (emojis) => {
  return emojis
    .map((emoji) => {
      return (
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
         <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
         </label>`
      );
    }).join(`\n`);
};

const createEmojis = createEmojiMarkup(EMOJIS);

const createControlsTemplate = (control) => {
  const {addedToWatchList, markedAsWatched, isFavorite} = control;
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist ${addedToWatchList ? `active` : ``}">Add to watchlist</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
    <label for="watched" class="film-details__control-label film-details__control-label--watched ${markedAsWatched ? `active` : ``}">Already watched</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
    <label for="favorite" class="film-details__control-label film-details__control-label--favorite ${isFavorite ? `active` : ``}">Add to favorites</label>`
  );
};


const createPopupTemplate = (film) => {
  const {poster, title, description, rating, duration, genre, comments, originalTitle, director, writers, actors, releaseDate, country} = film;
  const createComments = createCommentsTemplate(comments);
  const controls = createControlsTemplate(film);
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
                  <td class="film-details__cell">${releaseDate}</td>
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
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">${genre}</span>
                    <span class="film-details__genre">${genre}</span>
                    <span class="film-details__genre">${genre}</span></td>
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
    
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

             <ul class="film-details__comments-list">
             ${createComments}
              </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>
    
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
    
              <div class="film-details__emoji-list">
                ${createEmojis}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class Popup extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  setClickPopupCloseBtnHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  removeClickPopupCloseBtnHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }
}
