import AbstractSmartComponent from "./abstract-smart-component.js";

const createFilmTemplate = (noFilmsExist) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title ${noFilmsExist ? `` : `visually-hidden`}">
        ${noFilmsExist ? `There are no movies in our database` : `All movies. Upcoming`}</h2>
        <div class="films-list__container" ${noFilmsExist ? `visually-hidden` : ``}></div>
      </section>
    </section>`
  );
};

export default class Film extends AbstractSmartComponent {
  constructor() {
    super();
    this.noFilmsExist = null;
    this._showMoreButton = this.getElement().querySelector(`.films-list__show-more`);
  }

  getTemplate() {
    return createFilmTemplate(this.noFilmsExist);
  }

  recoveryListeners() {
  }

  setClickShowMoreBtnHandler(handler) {
    this._showMoreButton.addEventListener(`click`, handler);
  }

  removeShowMoreBtn() {
    this._showMoreButton.remove();
  }

  renderNoFilm() {
    this._noFilmsExist = true;
    this.rerender();
  }

}
