
import ProfileComponent from "./components/profile.js";
import MenuComponent from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import {generatedFilms} from "./mock/generateFilmCards";
import {generateMenu} from "./mock/generateMenu";
import {render, RenderPosition} from "./utils/render";
import PageControllerComponent from "./controllers/pageController";
import FilmComponent from "./components/film.js";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

const filmComponent = new FilmComponent();
const pageController = new PageControllerComponent(filmComponent.getElement());

const menu = generateMenu(generatedFilms);

render(header, new ProfileComponent(), RenderPosition.BEFOREEND);
render(main, new MenuComponent(menu), RenderPosition.BEFOREEND);
render(footerStatistics, new StatisticsComponent(), RenderPosition.BEFOREEND);

pageController.render(generatedFilms);


