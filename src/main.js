import ProfileComponent from "./components/profile.js";
import StatisticsComponent from "./components/statistics.js";
import StatsComponent from "./components/stats.js";
import {generateFilms} from "./mock/generateFilmCards";
import {render, RenderPosition} from "./utils/render";
import PageControllerComponent from "./controllers/pageController";
import FilmsModel from "./models/films";
import FilmComponent from "./components/film.js";
import FilterController from "./controllers/filterController";
import {TOTAL_NUMBER_OF_CARDS} from "./const.js";

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

const generatedFilms = generateFilms(TOTAL_NUMBER_OF_CARDS);

const filmsModel = new FilmsModel();
filmsModel.setFilms(generatedFilms);

render(header, new ProfileComponent(), RenderPosition.BEFOREEND);

const statsComponent = new StatsComponent();
render(main, statsComponent, RenderPosition.BEFOREBEEND);
statsComponent.show();


render(footerStatistics, new StatisticsComponent(), RenderPosition.BEFOREEND);

const filterController = new FilterController(main, filmsModel);
filterController.render();

const filmComponent = new FilmComponent(generatedFilms.length === 0);
render(main, filmComponent, RenderPosition.BEFOREEND);

const pageController = new PageControllerComponent(filmComponent, filmsModel);

pageController.render(generatedFilms);


