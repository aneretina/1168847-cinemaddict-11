
const FILM_CARDS = 5;
const EXTRA_FILM_CARDS = 2;

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);

import {createProfileTemplate} from "./components/profile.js";
import {createMenuTemplate} from "./components/menu.js";
import {createSortingTemplate} from "./components/menu.js";
import {createFilmTemplate} from "./components/film.js";
import {createFilmListTemplate} from "./components/film.js";
import {createFilmCardTemplate} from "./components/filmCard.js/index.js";
import {createTopRatedTemplate} from "./components/topRated.js/index.js";
import {createMostCommentedTemplate} from "./components/mostCommented.js/index.js";
import {createShowButtonTemplate} from "./components/film.js";
import {createStatisticsTemplate} from "./components/statistics.js";
import {createPopupTemplate} from "./components/popup.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Отрисовка верхней части: header + main
render(header, createProfileTemplate(), `beforeend`);
render(main, createMenuTemplate(), `beforeend`);
render(main, createSortingTemplate(), `beforeend`);
render(main, createFilmTemplate(), `beforeend`);

// Отрисовка главных блоков
const films = document.querySelector(`.films`);

render(films, createFilmListTemplate(), `beforeend`);
render(films, createTopRatedTemplate(), `beforeend`);
render(films, createMostCommentedTemplate(), `beforeend`);


// Отрисовка карточек фильмов
const filmsList = films.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARDS; i++) {
  render(filmsListContainer, createFilmCardTemplate(), `beforeend`);
}

// Отрисовка кнопки "Показать еще"
render(filmsList, createShowButtonTemplate(), `beforeend`);


// Отрисовка доп карточек (topRated и mostCommented)
const filmListExtraContainer = main.querySelectorAll(`.films-list--extra`);

filmListExtraContainer.forEach((item) => {
  let container = item.querySelector(`.films-list__container`);
  for (let i = 0; i < EXTRA_FILM_CARDS; i++) {
    render(container, createFilmCardTemplate(), `beforeEnd`);
  }
});

// Отрисовка статистики в футере
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

render(footerStatistics, createStatisticsTemplate(), `beforeend`);

// Отрисовка попап с детальной информацией (временно закоментировано)
render(body, createPopupTemplate(), `beforeend`);
