import FilmCardComponent from "../components/filmCard.js";
import PopupComponent from "../components/popup.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESC_KEY, ControlButton, Mode, ENTER_KEY} from "../const.js";
import {formatCommentDate, getRandomDate} from "../utils/common.js";
import {encode} from "he";
import FilmModel from "../models/film";
import CommentComponent from "../components/comment.js";

const body = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._api = api;
    this._popupComponent = null;
    this._filmCardComponent = null;
    this._commentComponent = null;

    this._id = null;
    this._mode = Mode.DEFAULT;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._film = film;
    const container = this._container;
    this._id = film.id;
    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._popupComponent = new PopupComponent(film);

    if (oldFilmCardComponent && oldPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupComponent, oldPopupComponent);
      return;
    }
    render(container, this._filmCardComponent, RenderPosition.BEFOREEND);

    const renderPopup = () => {
      // this._popupComponent.reset();
      body.appendChild(this._popupComponent.getElement());
      this._mode = Mode.POPUP;
      document.addEventListener(`keydown`, this._onEscKeyDown);

      this._api.getComments(this._film.id)
      .then((data) => {
        console.log(this._api)
        this._commentComponent = new CommentComponent(data);
        const commentsContainer = this._popupComponent.getElement().querySelector(`.form-details__bottom-container`);
        commentsContainer.appendChild(this._commentComponent.getElement());
      });
    };

    this._popupComponent.setPopupCloseButtonClickHandler(() => {
      this._closePopup();
    });

    this._popupComponent.setControlButtonsChangeHandler((buttonName) => {
      if (buttonName === ControlButton.WATCHLIST) {
        const newFilm = FilmModel.clone(film);
        newFilm.addedToWatchList = !newFilm.addedToWatchList;
        this._onDataChange(this, film, newFilm);
      }

      if (buttonName === ControlButton.WATCHED) {
        const newFilm = FilmModel.clone(film);
        newFilm.markedAsWatched = !newFilm.markedAsWatched;
        this._onDataChange(this, film, newFilm);
      }

      if (buttonName === ControlButton.FAVORITE) {
        const newFilm = FilmModel.clone(film);
        newFilm.isFavorite = !newFilm.isFavorite;
        this._onDataChange(this, film, newFilm);
      }
    });

    this._filmCardComponent.setClickPopupShowElementsHandler(() => {
      this._onViewChange();
      renderPopup();
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
