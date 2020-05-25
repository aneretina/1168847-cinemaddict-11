import API from "./api.js";
import ProfileComponent from "./components/profile.js";
import StatisticsComponent from "./components/statistics.js";
import {render, RenderPosition} from "./utils/render";
import PageControllerComponent from "./controllers/pageController";
import FilmsModel from "./models/films";
import FilmComponent from "./components/film.js";
import FilterController from "./controllers/filterController";

const AUTHORIZATION = `Basic hiehf999u2uuwknkfhwi`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

const api = new API(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();

const filmsCount = api.getFilms().length;

render(header, new ProfileComponent(), RenderPosition.BEFOREEND);

render(footerStatistics, new StatisticsComponent(), RenderPosition.BEFOREEND);

const filmComponent = new FilmComponent(filmsCount === 0);
render(main, filmComponent, RenderPosition.BEFOREEND);

const pageController = new PageControllerComponent(filmComponent, filmsModel, api);
pageController.onLoading();

const filterController = new FilterController(main, filmsModel, pageController);
filterController.render();

api.getFilms()
   .then((films) => {
     filmsModel.setFilms(films);
     pageController.render();
   });
