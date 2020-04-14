
const createMenuMarkup = (menu, isActive) => {
  const {menuOption, count} = menu;

  return (
    `<a href="#${menuOption}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${menuOption} ${isActive ? `movies` : ``} ${!isActive ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
  );
};

export const createMenuTemplate = (menuItems) => {
  const menuMarkup = menuItems.map((it, i) => createMenuMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${menuMarkup}
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
