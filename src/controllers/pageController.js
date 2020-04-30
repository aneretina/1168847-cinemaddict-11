import FilmCardComponent from "../components/filmCard.js";
import TopRatedComponent from "../components/topRated.js";
import MostCommentedComponent from "../components/mostCommented.js";
import PopupComponent from "../components/popup.js";
import SortingComponent from '../components/sorting.js';
import ShowMoreButtonComponent from "../components/showMoreButton.js";
import {EXTRA_FILM_CARDS, FILM_CARDS_PER_ROW, FILM_CARDS_BY_BUTTON, ESC_KEY, SortType} from "../const.js";
import {render, RenderPosition} from "../utils/render";

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

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.year - a.year);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortingComponent = new SortingComponent();
  }

  render(films) {
    const container = this._container.getElement();
    const filmsList = container.querySelector(`.films-list`);
    const filmsListContainer = filmsList.querySelector(`.films-list__container`);
    let showingFilmsCount = FILM_CARDS_PER_ROW;

    const renderShowMoreButton = () => {
      if (showingFilmsCount >= films.length) {
        return;
      }
      render(filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

      this._showMoreButtonComponent.setClickShowMoreBtnHandler(() => {
        const prevFilmsCount = showingFilmsCount;

        showingFilmsCount = showingFilmsCount + FILM_CARDS_BY_BUTTON;

        const sortedFilms = getSortedFilms(films, this._sortingComponent.getSortType(), prevFilmsCount, showingFilmsCount);

        sortedFilms.slice(0, showingFilmsCount)
        .forEach((film) => {
          renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND);
        });

        if (showingFilmsCount >= films.length) {
          this._showMoreButtonComponent.removeShowMoreBtn();
        }
      });
    };

    if (films.length === 0) {
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREBEGIN);

    films.slice(0, showingFilmsCount)
    .forEach((film) => renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND));

    renderShowMoreButton();

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {

      const sortedFilms = getSortedFilms(films, sortType, 0, showingFilmsCount);

      filmsListContainer.innerHTML = ``;

      sortedFilms.slice(0, showingFilmsCount)
        .forEach((film) => {
          renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND);
        });

      renderShowMoreButton();
    });

    const topRatedFilmsContainer = this._topRatedComponent.getElement().querySelector(`.films-list__container`);
    const mostCommentedFilmsContainer = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);

    const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
    const topRatedFilms = films.slice().sort((a, b) => a.rating > b.rating ? -1 : 1);
    render(container, this._topRatedComponent, RenderPosition.BEFOREEND);
    render(container, this._mostCommentedComponent, RenderPosition.BEFOREEND);

    topRatedFilms.slice(0, EXTRA_FILM_CARDS)
       .forEach((film) => renderFilm(topRatedFilmsContainer, film, RenderPosition.BEFOREEND));

    mostCommentedFilms.slice(0, EXTRA_FILM_CARDS)
      .forEach((film) => renderFilm(mostCommentedFilmsContainer, film, RenderPosition.BEFOREEND));

  }
}

