import {createElement} from "../utils.js";

const createFilmTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container"></div>
        <button class="films-list__show-more">Show more</button>
      </section>
    </section>`
  );
};

export default class Film {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmTemplate();
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
