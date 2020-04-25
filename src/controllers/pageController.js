import FilmCardComponent from "../components/filmCard.js";
import TopRatedComponent from "../components/topRated.js";
import MostCommentedComponent from "../components/mostCommented.js";
import PopupComponent from "../components/popup.js";
import {EXTRA_FILM_CARDS, FILM_CARDS_PER_ROW, FILM_CARDS_BY_BUTTON, ESC_KEY} from "../const.js";
import {render, RenderPosition} from "../utils/render";
import {body, filmComponent, main} from "../main";
import {generatedFilms} from "../mock/generateFilmCards";

const renderFilm = (container, film, position) => {
  const popupComponent = new PopupComponent(film);
  const popupElement = popupComponent.getElement();

  const renderPopup = () => {
    body.appendChild(popupElement);
    popupComponent.setClickPopupCloseBtnHandler(() => {
      closePopup();
    });
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closePopup = () => {
    body.removeChild(popupElement);
    popupComponent.removeClickPopupCloseBtnHandler(() => {
      closePopup();
    });
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === ESC_KEY) {
      closePopup();
    }
  };

  const filmCardComponent = new FilmCardComponent(film);
  render(container, filmCardComponent, position);

  filmCardComponent.setClickPopupShowElementsHandler(() => {
    renderPopup();
  });
};

const renderFilmCollections = (container, films) => {
  const topRatedComponent = new TopRatedComponent();
  const mostCommentedComponent = new MostCommentedComponent();
  const filmsListContainer = filmComponent.getElement().querySelector(`.films-list__container`);
  const topRatedFilmsContainer = topRatedComponent.getElement().querySelector(`.films-list__container`);
  const mostCommentedFilmsContainer = mostCommentedComponent.getElement().querySelector(`.films-list__container`);
  let showingFilmsCount = FILM_CARDS_PER_ROW;

  render(main, filmComponent, RenderPosition.BEFOREEND);

  films.slice(0, showingFilmsCount)
  .forEach((film) => renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND));

  const mostCommentedFilms = generatedFilms.slice().sort((a, b) => a.comments.length >= b.comments.length ? -1 : 1);
  const topRatedFilms = generatedFilms.slice().sort((a, b) => a.rating > b.rating ? -1 : 1);
  render(filmComponent.getElement(), topRatedComponent, RenderPosition.BEFOREEND);
  render(filmComponent.getElement(), mostCommentedComponent, RenderPosition.BEFOREEND);

  topRatedFilms.slice(0, EXTRA_FILM_CARDS)
   .forEach((film) => renderFilm(topRatedFilmsContainer, film, RenderPosition.BEFOREEND));

  mostCommentedFilms.slice(0, EXTRA_FILM_CARDS)
  .forEach((film) => renderFilm(mostCommentedFilmsContainer, film, RenderPosition.BEFOREEND));

  filmComponent.setClickShowMoreBtnHandler(() => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + FILM_CARDS_BY_BUTTON;

    films.slice(prevFilmsCount, showingFilmsCount).forEach((film) => renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND));

    if (showingFilmsCount >= generatedFilms.length) {
      filmComponent.removeShowMoreButton();
    }
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;
  }

  render(films) {
    renderFilmCollections(this._container, films);
  }
}
