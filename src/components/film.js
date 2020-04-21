import {createElement} from "../utils.js";

const createFilmTemplate = (title, isTitleVisible) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title ${isTitleVisible ? `` : `visually-hidden`}">${title}</h2>
        <div class="films-list__container"></div>
        <button class="films-list__show-more">Show more</button>
      </section>
    </section>`
  );
};

export default class Film {
  constructor(title, isTitleVisible) {
    this._title = title;
    this._isTitleVisible = isTitleVisible;
    this._element = null;
  }

  getTemplate() {
    return createFilmTemplate(this._title, this._isTitleVisible);
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
