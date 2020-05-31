import AbstractComponent from "./abstractComponent.js";

const createStatisticTemplate = (filmsCount) => {
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};

export default class Statistic extends AbstractComponent {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatisticTemplate(this._filmsCount);
  }
}
