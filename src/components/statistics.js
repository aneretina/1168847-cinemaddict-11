import AbstractComponent from "./abstractComponent.js";

const createStatisticTemplate = (films) => {
  const counter = films.getFilms().length;

  return (
    `<p>${counter} movies inside</p>`
  );
};

export default class Statistic extends AbstractComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
  }

  getTemplate() {
    return createStatisticTemplate(this._filmsModel);
  }
}
