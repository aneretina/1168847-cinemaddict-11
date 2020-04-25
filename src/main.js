
import ProfileComponent from "./components/profile.js";
import MenuComponent from "./components/menu.js";
import FilmComponent from "./components/film.js";
import StatisticsComponent from "./components/statistics.js";
import {generatedFilms} from "./mock/generateFilmCards";
import {generateMenu} from "./mock/generateMenu";
import {render, RenderPosition} from "./utils/render";
import PageControllerComponent from "./controllers/pageController";

const header = document.querySelector(`.header`);
export const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);
export const body = document.querySelector(`body`);

export let filmComponent;

const renderNoFilmList = (container) => {
  render(main, container, RenderPosition.BEFOREEND);
};

const menu = generateMenu(generatedFilms);

render(header, new ProfileComponent(), RenderPosition.BEFOREEND);
render(main, new MenuComponent(menu), RenderPosition.BEFOREEND);
render(footerStatistics, new StatisticsComponent(), RenderPosition.BEFOREEND);


if (generatedFilms.length === 0) {
  filmComponent = new FilmComponent(`There are no movies in our database`, true);
  renderNoFilmList(filmComponent);
} else {
  filmComponent = new FilmComponent(`All movies. Upcoming`, false);

  const filmElement = filmComponent.getElement();
  const pageController = new PageControllerComponent(filmElement);
  pageController.render(generatedFilms);
}

