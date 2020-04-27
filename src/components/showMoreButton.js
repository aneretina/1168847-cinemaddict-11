import AbstractComponent from "./abstractComponent.js";

const createShowMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickShowMoreBtnHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  removeShowMoreBtn() {
    this.getElement().remove();
  }

}
