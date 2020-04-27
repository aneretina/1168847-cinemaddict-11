import AbstractComponent from "./abstractComponent.js";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

export const SORT_BY = [`default`, `date`, `rating`];


const createSortingOptionMarkup = (name) => {
  return (
    `<li><a href="#" class="sort__button sort__button">Sort by ${name}</a></li>`
  );
};

const createSortingTemplate = () => {
  const names = SORT_BY;
  const sortingOptionMarkup = names.map((it, i) => createSortingOptionMarkup(it, i === 0)).join(`\n`);
  return (
    `<ul class="sort">
    ${sortingOptionMarkup}
    </ul>`
  );
};

export default class Sorting extends AbstractComponent {
  getTemplate() {
    return createSortingTemplate(this._name);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

       const sortType = evt.target.dataset.sortType;

       if (this._currenSortType === sortType) {
        return;
      }

       this._currenSortType = sortType;


       handler(this._currenSortType);
    });
  }		   
}
