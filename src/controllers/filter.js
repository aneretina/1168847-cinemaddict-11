import MenuComponent from "../components/menu.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getFilmsByFilter, getWatchedFilms} from "../utils/filter.js";
import StatsComponent from "../components/stats.js";

export default class FilterController {
  constructor(container, filmsModel, pageController) {
    this._container = container;

    this._filmsModel = filmsModel;
    this._pageController = pageController;
    this._statsComponent = null;

    this._activeFilterType = FilterType.ALL;
    this._menuComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new MenuComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }

    const watchedFilms = getWatchedFilms(this._filmsModel.getFilms());

    this._statsComponent = new StatsComponent(watchedFilms);

    render(this._container, this._statsComponent, RenderPosition.BEFOREEND);
    this._statsComponent.hide();
  }


  _onFilterChange(filterType) {
    if (filterType === `stats`) {
      this._pageController.hide();
      this._statsComponent.show();
    } else {
      this._pageController.show();
      this._statsComponent.hide();
      this._filterComponent.removeActiveStats();
      this._filmsModel.setFilter(filterType);
      this._activeFilterType = filterType;
    }
  }

  _onDataChange() {
    this.render();
  }
}

