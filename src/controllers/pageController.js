import FilmComponent from "../components/film.js";
import FilmCardComponent from "../components/filmCard.js";
import TopRatedComponent from "../components/topRated.js";
import MostCommentedComponent from "../components/mostCommented.js";
import PopupComponent from "../components/popup.js";
import {EXTRA_FILM_CARDS, FILM_CARDS_PER_ROW, FILM_CARDS_BY_BUTTON, ESC_KEY} from "../const.js";
import {render, RenderPosition} from "../utils/render";
import {generatedFilms} from "../mock/generateFilmCards";

const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);


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

const renderNoFilmList = (container) => {
  render(main, container, RenderPosition.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._filmComponent = new FilmComponent();
  }

  render(films) {
    const container = this._container;

    render(container, this._filmComponent, RenderPosition.BEFOREEND);

    let showingFilmsCount = FILM_CARDS_PER_ROW;

    films.slice(0, showingFilmsCount)
      .forEach((film) => renderFilm(container, film, RenderPosition.BEFOREEND));

    const topRatedFilmsContainer = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    const mostCommentedFilmsContainer = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);

    const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length >= b.comments.length ? -1 : 1);
    const topRatedFilms = films.slice().sort((a, b) => a.rating > b.rating ? -1 : 1);
    render(container, this._topRatedComponent, RenderPosition.BEFOREEND);
    render(container, this._mostCommentedComponent, RenderPosition.BEFOREEND);

    topRatedFilms.slice(0, EXTRA_FILM_CARDS)
       .forEach((film) => renderFilm(topRatedFilmsContainer, film, RenderPosition.BEFOREEND));

    mostCommentedFilms.slice(0, EXTRA_FILM_CARDS)
      .forEach((film) => renderFilm(mostCommentedFilmsContainer, film, RenderPosition.BEFOREEND));

    this._filmComponent.setClickShowMoreBtnHandler(() => {
      const prevFilmsCount = showingFilmsCount;
      console.log(showingFilmsCount)
      showingFilmsCount = showingFilmsCount + FILM_CARDS_BY_BUTTON;

      films.slice(prevFilmsCount, showingFilmsCount).forEach((film) => renderFilm(container, film, RenderPosition.BEFOREEND));

      if (showingFilmsCount >= generatedFilms.length) {
        this._filmComponent.removeShowMoreBtn();
      }
    });

    let filmComponent;
    if (films.length === 0) {
      filmComponent = new FilmComponent(`There are no movies in our database`, true);
      renderNoFilmList(filmComponent);
    } else {
      filmComponent = new FilmComponent(`All movies. Upcoming`, false);
    }
  }
}
