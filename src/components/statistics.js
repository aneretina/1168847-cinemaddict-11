import AbstractComponent from "./abstractComponent.js";

const createStatisticsTemplate = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};

export default class Statistics extends AbstractComponent {
  getTemplate() {
    return createStatisticsTemplate();
  }
}
