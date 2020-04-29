import AbstractComponent from "./abstractComponent.js";

const createMenuItemMarkup = (menuOption, isActive) => {
  const {name, count} = menuOption;

  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name} ${isActive ? `movies` : ``} ${!isActive ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
  );
};

const createMenuTemplate = (menuOptions) => {
  const menuMarkupItem = menuOptions.map((it, i) => createMenuItemMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${menuMarkupItem}
      </div>
     <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};


export default class Menu extends AbstractComponent {
  constructor(menuOptions) {
    super();
    this._menuOptions = menuOptions;
  }

  getTemplate() {
    return createMenuTemplate(this._menuOptions);
  }

}
