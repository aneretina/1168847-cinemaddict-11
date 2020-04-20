import {createElement} from "../utils.js";

const createMenuMarkup = (menuOption, isActive) => {
  const {name, count} = menuOption;

  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name} ${isActive ? `movies` : ``} ${!isActive ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
  );
};

const createMenuTemplate = (menuOptions) => {
  const menuMarkupItem = menuOptions.map((it, i) => createMenuMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${menuMarkupItem}
      </div>
     <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};


export default class Menu {
  constructor(menuOptions) {
    this._menuOptions = menuOptions;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._menuOptions);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}