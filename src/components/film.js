import AbstractComponent from "./abstractComponent.js";

const createFilmTemplate = (noFilmsExist) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title ${noFilmsExist ? `` : `visually-hidden`}">${noFilmsExist ? `There are no movies in our database` : `All movies. Upcoming`}</h2>
        <div class="films-list__container" ${noFilmsExist ? `visually-hidden` : ``}></div>
      </section>
    </section>`
  );
};

export default class Film extends AbstractComponent {
  constructor(noFilmsExist) {
    super();
    this.noFilmsExist = noFilmsExist;
    this._showMoreButton = this.getElement().querySelector(`.films-list__show-more`);
  }

  setClickShowMoreBtnHandler(handler) {
    this._showMoreButton.addEventListener(`click`, handler);
  }

  removeShowMoreBtn() {
    this._showMoreButton.remove();
  }

  getTemplate() {
    return createFilmTemplate(this.noFilmsExist);
  }
}
