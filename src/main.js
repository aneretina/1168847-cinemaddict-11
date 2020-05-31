import API from "./api.js";
import ProfileComponent from "./components/profile.js";
import {render, RenderPosition} from "./utils/render";
import PageControllerComponent from "./controllers/pageController";
import FilmsModel from "./models/films";
import FilmComponent from "./components/film.js";
import FilterController from "./controllers/filterController";
import {getWatchedFilms} from "./utils/filter.js";

const AUTHORIZATION = `Basic hiehvodjvdojvjdvjwi`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const filmComponent = new FilmComponent();
render(main, filmComponent, RenderPosition.BEFOREEND);

const pageController = new PageControllerComponent(filmComponent, filmsModel, api);
pageController.onLoading();

const filterController = new FilterController(main, filmsModel, pageController);
filterController.render();

api.getFilms()
   .then((films) => {
     if (films.length === 0) {
       filmComponent.renderNoFilm();
     }

     filmsModel.setFilms(films);
     pageController.render();

     const watchedFilms = getWatchedFilms(filmsModel.getFilmsAll());
     render(header, new ProfileComponent(watchedFilms), RenderPosition.BEFOREEND);
   });
