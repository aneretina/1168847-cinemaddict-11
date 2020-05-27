import FilmCardComponent from "../components/filmCard.js";
import PopupComponent from "../components/popup.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESC_KEY, ControlButton, Mode, ENTER_KEY} from "../const.js";
import {formatCommentDate, getRandomDate} from "../utils/common.js";
import {encode} from "he";
import FilmModel from "../models/film";

const body = document.querySelector(`body`);


export default class FilmController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._api = api;
    this._popupComponent = null;
    this._filmCardComponent = null;

    this._id = null;
    this._mode = Mode.DEFAULT;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const container = this._container;
    this._id = film.id;
    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardComponent(film);

    this._api.getComments(film.id).then(comments)
    this._popupComponent = new PopupComponent(film);
    const popupElement = this._popupComponent.getElement();

    const renderPopup = () => {
      this._popupComponent.reset();
      body.appendChild(popupElement);
      this._mode = Mode.POPUP;
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    this._popupComponent.setCommentsDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      const deleteCommentButton = evt.target;
      const commentElement = deleteCommentButton.closest(`.film-details__comment`);
      const deleteCommentId = commentElement.id;
      const comments = film.comments.filter((comment) => comment.id !== deleteCommentId);
      this._onDataChange(this, film, Object.assign(film, {comments}));
    });

    this._popupComponent.setSendCommentHandler((evt) => {
      if (evt.key === ENTER_KEY && (evt.ctrlKey || evt.metaKey)) {
        const comment = {
          id: String(new Date().getTime() + Math.random()),
          emoji: this._popupComponent.getCurrentEmoji(),
          text: encode(evt.target.value),
          date: formatCommentDate(getRandomDate(new Date(2015, 0, 1), new Date())),

        };

        if (!comment) {
          return;
        }

        const newComments = film.comments.concat(comment);
        this._onDataChange(this, film, Object.assign(film, {comments: newComments}));
      }
    });

    this._filmCardComponent.setAddToWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.addedToWatchList = !newFilm.addedToWatchList;
      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setMarkAsWatchButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.markedAsWatched = !newFilm.markedAsWatched;
      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.isFavorite = !newFilm.isFavorite;
      this._onDataChange(this, film, newFilm);
    });

    this._popupComponent.setPopupCloseButtonClickHandler(() => {
      this._closePopup();
    });

    this._popupComponent.setControlButtonsChangeHandler((buttonName) => {
      if (buttonName === ControlButton.WATCHLIST) {
        this._onDataChange(this, film, Object.assign({}, film, {
          addedToWatchList: !film.addedToWatchList,
        }));
      }

      if (buttonName === ControlButton.WATCHED) {
        this._onDataChange(this, film, Object.assign({}, film, {
          markedAsWatched: !film.markedAsWatched,
        }));
      }

      if (buttonName === ControlButton.FAVORITE) {
        this._onDataChange(this, film, Object.assign({}, film, {
          isFavorite: !film.isFavorite,
        }));
      }
    });

    this._filmCardComponent.setClickPopupShowElementsHandler(() => {
      this._onViewChange();
      renderPopup();
    });

    if (oldFilmCardComponent && oldPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupComponent, oldPopupComponent);
      return;
    }
    render(container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    this._popupComponent.getElement().remove();
    this._popupComponent.clearPopupEmojiContainer();
    this._popupComponent.removePopupCloseButton(() => {
      this._closePopup();
    });
  }

  _onEscKeyDown(evt) {
    if (evt.key === ESC_KEY) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
      this._mode = Mode.DEFAULT;
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  getId() {
    return this._id;
  }
}
