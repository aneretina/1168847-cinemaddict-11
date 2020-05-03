import FilmCardComponent from "../components/filmCard";
import PopupComponent from "../components/popup.js";
import {render, RenderPosition} from "../utils/render.js";

import {ESC_KEY} from "../const.js";

export default class FilmController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._popupComponent = null;
    this._filmCardComponent = null;
  }

  render(film) {
    const container = this._container;
    const body = document.querySelector(`body`);

    this._popupComponent = new PopupComponent(film);
    const popupElement = this._popupComponent.getElement();
    this._filmCardComponent = new FilmCardComponent(film);

    const renderPopup = () => {
      body.appendChild(popupElement);
      this._popupComponent.setPopupCloseButtonClickHandler(() => {
        closePopup();
      });
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const closePopup = () => {
      body.removeChild(popupElement);
      this._popupComponent.removePopupCloseButtonClickHandler(() => {
        closePopup();
      });
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._filmCardComponent.setAddToWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        addedtoWatchList: !film.addedtoWatchList,
      }));
    });

    this._filmCardComponent.setMarkAsWatchButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        markedAsWatched: !film.markedAsWatched,
      }));
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === ESC_KEY) {
        closePopup();
      }
    };

    this._filmCardComponent = new FilmCardComponent(film);
    render(container, this._filmCardComponent, RenderPosition.BEFOREEND);

    this._filmCardComponent.setClickPopupShowElementsHandler(() => {
      renderPopup();
    });
  }
}
