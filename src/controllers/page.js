import TopRatedComponent from "../components/top-rated.js";
import MostCommentedComponent from "../components/most-commented.js";
import SortingComponent from '../components/sorting.js';
import ShowMoreButtonComponent from "../components/show-more-button.js";
import {EXTRA_FILM_CARDS, FILM_CARDS_PER_ROW, FILM_CARDS_BY_BUTTON, SortType} from "../const.js";
import {render, RenderPosition, remove} from "../utils/render";
import FilmController from "./film";
import LoadingComponent from "../components/load.js";
import moment from "moment";
import StatisticsComponent from "../components/films-amount.js";


const renderFilms = (filmsContainer, films, onDataChange, onViewChange, api, filmsModel, onCommentChange) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainer, onDataChange, onViewChange, api, filmsModel, onCommentChange);

    filmController.render(film);

    return filmController;
  });
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => moment(b.year) - moment(a.year));
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
  constructor(container, filmsModel, api) {
    this._filmsModel = filmsModel;
    this._api = api;

    this._showedFilmsControllers = [];
    this._showedMostCommenteFilmsControllers = [];

    this._topRatedFilmsControllers = [];
    this._mostCommentedFilmsControllers = [];

    this._container = container;
    this._filmsList = this._container.getElement().querySelector(`.films-list`);
    this._filmsListContainer = this._filmsList.querySelector(`.films-list__container`);
    this._showMoreButtonExists = null;

    this._topRatedComponent = new TopRatedComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._mostCommentedFilmsContainer = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortingComponent = new SortingComponent();
    this._loadingComponent = new LoadingComponent();

    this._showingFilmsCount = FILM_CARDS_PER_ROW;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  onLoading() {
    render(this._container.getElement(), this._loadingComponent, RenderPosition.BEFOREEND);
  }

  render() {
    remove(this._loadingComponent);
    const container = this._container.getElement();
    const films = this._filmsModel.getFilms();

    if (films.length === 0) {
      return;
    }

    const footer = document.querySelector(`.footer`);
    const footerStatistics = footer.querySelector(`.footer__statistics`);

    render(footerStatistics, new StatisticsComponent(films.length), RenderPosition.BEFOREEND);
    render(container, this._sortingComponent, RenderPosition.BEFOREBEGIN);

    this._renderFilms(films.slice(0, this._showingFilmsCount));

    this._renderShowMoreButton();

    const topRatedFilmsContainer = this._topRatedComponent.getElement().querySelector(`.films-list__container`);


    const topRatedFilms = films.slice().sort((a, b) => a.rating > b.rating ? -1 : 1);
    render(container, this._topRatedComponent, RenderPosition.BEFOREEND);
    render(container, this._mostCommentedComponent, RenderPosition.BEFOREEND);
    this._renderMostCommentedFilms(films);

    this._topRatedFilmsControllers = renderFilms(topRatedFilmsContainer, topRatedFilms.slice(0, EXTRA_FILM_CARDS), this._onDataChange, this._onViewChange, this._api, this._filmsModel, this._onCommentChange);
  }

  _renderFilms(films) {
    const newFilmsControllers = renderFilms(this._filmsListContainer, films.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange, this._api, this._filmsModel, this._onCommentChange);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilmsControllers);
  }

  _renderMostCommentedFilms(films) {
    const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
    this._mostCommentedFilmsControllers = renderFilms(this._mostCommentedFilmsContainer, mostCommentedFilms.slice(0, EXTRA_FILM_CARDS), this._onDataChange, this._onViewChange, this._api, this._filmsModel, this._onCommentChange);
  }

  _updateMostCommentedFilms() {
    const mostCommentedFilms = this._renderMostCommentedFilms(this._filmsModel.getFilmsAll());

    this._showedMostCommentedFilmsControllers.forEach((filmController) => filmController.destroy());
    this._showedMostCommenteFilmsControllers = [];

    if (mostCommentedFilms) {
      const newMostCommentedFilms = renderFilms(this._mostCommentedFilmsContainer, mostCommentedFilms.slice(0, EXTRA_FILM_CARDS), this._onDataChange, this._onViewChange, this._api, this._filmsModel, this._onCommentChange);
      this._showedMostCommentedFilmsControllers = this._showedMostCommentedFilmsControllers.concat(newMostCommentedFilms);
    }
  }

  _renderShowMoreButton() {
    const films = this._filmsModel.getFilms();

    if (this._showingFilmsCount >= films.length) {
      return;
    }

    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonExists = true;

    this._showMoreButtonComponent.setClickShowMoreBtnHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;

      this._showingFilmsCount = this._showingFilmsCount + FILM_CARDS_BY_BUTTON;

      const sortedFilms = getSortedFilms(films, this._sortingComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const newFilmsControllers = renderFilms(this._filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange, this._api, this._filmsModel, this._onCommentChange);
      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilmsControllers);

      if (this._showingFilmsCount >= films.length) {
        this._showMoreButtonComponent.removeShowMoreBtn();
        this._showMoreButtonExists = false;
      }
    });
  }

  _removeFilms() {
    this._showedFilmsControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmsControllers = [];
  }

  _refreshShowMoreButton() {
    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _onDataChange(filmController, oldData, newData) {
    this._isChangedCommentsCount = oldData.comments.length !== newData.comments.length;
    this._api.updateFilm(oldData.id, newData)
    .then((filmModel) => {
      const isSuccess = this._filmsModel.updateFilms(oldData.id, filmModel);

      if (isSuccess) {
        let allMovies = [].concat(this._topRatedFilmsControllers, this._mostCommentedFilmsControllers, this._showedFilmsControllers)
      .filter((movieController) => {
        return filmController.getId() === movieController.getId();
      });
        allMovies.forEach((controller) => {
          controller.render(newData);
        });
      }
    });
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {

    this._showingFilmsCount = FILM_CARDS_BY_BUTTON;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, FILM_CARDS_BY_BUTTON);

    this._filmsListContainer.innerHTML = ``;

    const newFilmsControllers = renderFilms(this._filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange, this._api, this._filmsModel, this._onCommentChange);

    this._showedFilmsControllers = newFilmsControllers;

    if (this._showMoreButtonExists === false) {
      this._refreshShowMoreButton();
      this._showMoreButtonExists = true;
    }
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._showingFilmsCount = FILM_CARDS_BY_BUTTON;
    this._updateFilms(this._showingFilmsCount);

    if (this._showMoreButtonExists === false) {
      this._refreshShowMoreButton();
      this._showMoreButtonExists = true;
    }

    this._sortingComponent.setDefaultSortType();
  }

  _onCommentChange() {
    if (this._isChangedCommentsCount) {
      this._updateMostCommentedFilms();
      this._isChangedCommentsCount = false;
    }
  }

  hide() {
    this._container.hide();
    this._sortingComponent.hide();
  }

  show() {
    this._container.show();
    this._sortingComponent.show();
    this._onSortTypeChange(SortType.DEFAULT);
  }
}
