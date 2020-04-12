
import {createProfileTemplate} from "./components/profile.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilmTemplate} from "./components/film.js";
import {createFilmCardTemplate} from "./components/filmCard.js";
import {createTopRatedTemplate} from "./components/topRated.js";
import {createMostCommentedTemplate} from "./components/mostCommented.js";
import {createStatisticsTemplate} from "./components/statistics.js";
import {createPopupTemplate} from "./components/popUp.js";
import {EXTRA_FILM_CARDS, NUMBER_OF_CARDS} from "./const.js";
import {generatedFilms} from "./mock/generateFilmCards";
import {generateComments} from "./mock/generateComments";
import {generateMenu} from "./mock/generateMenu";

let showingFilmsCount = NUMBER_OF_CARDS;
const FILM_CARDS_BY_BUTTON = 5;

const firstCard = generatedFilms[0];
const menu = generateMenu();

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Отрисовка верхней части: header + main
render(header, createProfileTemplate(), `beforeend`);
render(main, createMenuTemplate(menu), `beforeend`);
render(main, createFilmTemplate(), `beforeend`);

// Отрисовка карточек фильмов
const films = main.querySelector(`.films`);
const filmsList = main.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

generatedFilms.slice(0, NUMBER_OF_CARDS)
  .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film), `beforeend`));


// Отрисовка  кнопки showMore
const showMoreBtn = main.querySelector(`.films-list__show-more`);

showMoreBtn.addEventListener(`click`, () => {
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount = prevFilmsCount + FILM_CARDS_BY_BUTTON;

  generatedFilms.slice(prevFilmsCount, showingFilmsCount).forEach((card) => render(filmsList, createFilmCardTemplate(card), `beforeend`));

  if (showingFilmsCount >= generatedFilms.length) {
    showMoreBtn.remove();
  }
});

// Отрисовка доп карточек (topRated и mostCommented)

const mostCommentedFilms = generatedFilms.slice().sort((a, b) => a.comments > b.comments.length ? -1 : 1);
const topRatedFilms = generatedFilms.slice().sort((a, b) => a.rating > b.rating ? -1 : 1);

render(films, createTopRatedTemplate(), `beforeend`);
render(films, createMostCommentedTemplate(), `beforeend`);

const topRatedFilmsList = films.querySelector(`.films-list--extra`);
const topRatedFilmsContainer = topRatedFilmsList.querySelector(`.films-list__container`);

topRatedFilms.slice(0, EXTRA_FILM_CARDS)
.forEach((film) => render(topRatedFilmsContainer, createFilmCardTemplate(film), `beforeend`));

const mostCommentedFilmsList = films.querySelector(`.films-list--extra:last-child`);
const mostCommentedFilmsContainer = mostCommentedFilmsList.querySelector(`.films-list__container`);

mostCommentedFilms.slice(0, EXTRA_FILM_CARDS)
.forEach((film) => render(mostCommentedFilmsContainer, createFilmCardTemplate(film), `beforeend`));

// Отрисовка статистики в футере
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

render(footerStatistics, createStatisticsTemplate(), `beforeend`);

// Отрисовка попап с детальной информацией (временно закоментировано)
render(body, createPopupTemplate(firstCard), `beforeend`);

const popUp = document.querySelector(`.film-details`);
const commentsListContainer = popUp.querySelector(`.film-details__comments-list`);
const popUpCloseButton = popUp.querySelector(`.film-details__close-btn`);

popUpCloseButton.addEventListener(`click`, () => {
  popUp.remove();
});

render(commentsListContainer, generateComments(4), `beforeend`);
