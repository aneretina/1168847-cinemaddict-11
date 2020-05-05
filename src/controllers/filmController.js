import FilmCardComponent from "../components/filmCard";
import PopupComponent from "../components/popup.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESC_KEY, ControlButton, Mode} from "../const.js";

const body = document.querySelector(`body`);


export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._popupComponent = null;
    this._filmCardComponent = null;

    this._mode = Mode.DEFAULT;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const container = this._container;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._popupComponent = new PopupComponent(film);
    const popupElement = this._popupComponent.getElement();


    const renderPopup = () => {
      body.appendChild(popupElement);
      this._mode = Mode.POPUP;
      this._popupComponent.setPopupCloseButtonClickHandler(() => {
        this._closePopup();
      });
      document.addEventListener(`keydown`, this._onEscKeyDown);
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

    this._popupComponent.setControlButtonsChangeHandler((button) => {
      if (button === ControlButton.WATCHLIST) {
        this._createButtonClickHandler(film, {
          addedtoWatchList: !film.addedtoWatchList,
        });
      }

      if (button === ControlButton.WATCHED) {
        this._createButtonClickHandler(film, {
          markedAsWatched: !film.markedAsWatched,
        });
      }

      if (button === ControlButton.FAVORITE) {

        this._createButtonClickHandler(film, {
          isFavorite: !film.isFavorite,
        });
      }
    });

    this._filmCardComponent.setClickPopupShowElementsHandler(() => {
      this._onViewChange();
      renderPopup();
    });

    if (oldFilmCardComponent && oldPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }
  }

  _onEscKeyDown(evt) {
    if (evt.key === ESC_KEY) {
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
    this._popupComponent.clearPopupCommentsContainer();
    this._popupComponent.removePopupCloseButtonClickHandler(() => {
      this._closePopup();
    });
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
      this._mode = Mode.DEFAULT;
    }
  }

  _createButtonClickHandler(film, changedCard) {
    return (evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, changedCard));
    };
  }
}
