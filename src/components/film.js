import AbstractComponent from "./abstractComponent.js";

const createFilmTemplate = (title, isTitleVisible) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title ${isTitleVisible ? `` : `visually-hidden`}">${title}</h2>
        <div class="films-list__container"></div>
        <button class="films-list__show-more ${isTitleVisible ? `visually-hidden` : ``}">Show more</button>
      </section>
    </section>`
  );
};

export default class Film extends AbstractComponent {
  constructor(title, isTitleVisible) {
    super();
    this._title = title;
    this._isTitleVisible = isTitleVisible;
    this._showMoreButton = this.getElement().querySelector(`.films-list__show-more`);
  }

  setClickShowMoreBtnHandler(handler) {
    this._showMoreButton.addEventListener(`click`, handler);
  }

  removeShowMoreBtn() {
    this._showMoreButton.remove();
  }

  getTemplate() {
    return createFilmTemplate(this._title, this._isTitleVisible);
  }
}
