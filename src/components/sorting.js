import AbstractComponent from "./abstractComponent.js";
import {SortType} from "../const.js";

const createSortingTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor() {
    super();
    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate(this._currenSortType);
  }
  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);

      const sortType = evt.target.dataset.sortType;

      evt.target.classList.add(`sort__button--active`);

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
