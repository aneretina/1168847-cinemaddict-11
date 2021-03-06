import AbstractComponent from "./abstract-component.js";

const createLoadingTemplate = () => `<h2 class="films-list__title">Loading...</h2>`;

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
