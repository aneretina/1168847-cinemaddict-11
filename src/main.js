import ProfileComponent from "./components/profile.js";
import MenuComponent from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import SortingComponent from './components/sorting.js';
import {generatedFilms} from "./mock/generateFilmCards";
import {generateMenu} from "./mock/generateMenu";
import {render, RenderPosition} from "./utils/render";
import PageControllerComponent from "./controllers/pageController";
import FilmComponent from "./components/film.js";


const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

const menu = generateMenu(generatedFilms);
render(header, new ProfileComponent(), RenderPosition.BEFOREEND);
render(main, new MenuComponent(menu), RenderPosition.BEFOREEND);
render(main, new SortingComponent(), RenderPosition.BEFOREEND);
render(footerStatistics, new StatisticsComponent(), RenderPosition.BEFOREEND);

const filmComponent = new FilmComponent(`All movies. Upcoming`, false);
render(main, filmComponent, RenderPosition.BEFOREEND);

const pageController = new PageControllerComponent(filmComponent);

pageController.render(generatedFilms);


