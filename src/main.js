
import ProfileComponent from "./components/profile.js";
import MenuComponent from "./components/menu.js";
import FilmComponent from "./components/film.js";
import FilmCardComponent from "./components/filmCard.js";
import TopRatedComponent from "./components/topRated.js";
import MostCommentedComponent from "./components/mostCommented.js";
import StatisticsComponent from "./components/statistics.js";
import PopupComponent from "./components/popup.js";
import {EXTRA_FILM_CARDS, FILM_CARDS_PER_ROW, FILM_CARDS_BY_BUTTON, ESC_KEY} from "./const.js";
import {generatedFilms} from "./mock/generateFilmCards";
import {generateMenu} from "./mock/generateMenu";
import {render, RenderPosition, replace, remove} from "./renderUtils";

let showingFilmsCount = FILM_CARDS_PER_ROW;

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

const renderFilm = (container, film, position) => {
  const popupComponent = new PopupComponent(film);
  const popupElement = popupComponent.getElement();
  const popupShowElements = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];
  const popupCloseBtn = popupElement.querySelector(`.film-details__close-btn`);

  const renderPopup = () => {
    body.appendChild(popupElement);
    popupCloseBtn.addEventListener(`click`, () => {
      closePopup();
    });
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closePopup = () => {
    body.removeChild(popupElement);
    popupCloseBtn.removeEventListener(`click`, () => {
      closePopup();
    });
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === ESC_KEY) {
      closePopup();
    }
  };

  const filmCardComponent = new FilmCardComponent(film);
  render(container, filmCardComponent, position);

  popupShowElements.forEach((element) => {
    filmCardComponent.getElement()
    .querySelector(element)
    .addEventListener(`click`, renderPopup);
  });
};

const renderNoFilmList = (container) => {
  render(main, container, RenderPosition.BEFOREEND);
};

const renderFilmCollections = (container, films) => {
  const topRatedComponent = new TopRatedComponent();
  const mostCommentedComponent = new MostCommentedComponent();
  const filmsListContainer = container.getElement().querySelector(`.films-list__container`);
  const showMoreBtn = filmComponent.getElement().querySelector(`.films-list__show-more`);
  const topRatedFilmsContainer = topRatedComponent.getElement().querySelector(`.films-list__container`);
  const mostCommentedFilmsContainer = mostCommentedComponent.getElement().querySelector(`.films-list__container`);

  render(main, filmComponent, RenderPosition.BEFOREEND);

  films.slice(0, showingFilmsCount)
  .forEach((film) => renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND));

  const mostCommentedFilms = generatedFilms.slice().sort((a, b) => a.comments.length >= b.comments.length ? -1 : 1);
  const topRatedFilms = generatedFilms.slice().sort((a, b) => a.rating > b.rating ? -1 : 1);
  render(filmComponent.getElement(), topRatedComponent, RenderPosition.BEFOREEND);
  render(filmComponent.getElement(), mostCommentedComponent, RenderPosition.BEFOREEND);

  topRatedFilms.slice(0, EXTRA_FILM_CARDS)
   .forEach((film) => renderFilm(topRatedFilmsContainer, film, RenderPosition.BEFOREEND));

  mostCommentedFilms.slice(0, EXTRA_FILM_CARDS)
  .forEach((film) => renderFilm(mostCommentedFilmsContainer, film, RenderPosition.BEFOREEND));

  showMoreBtn.addEventListener(`click`, () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + FILM_CARDS_BY_BUTTON;

    films.slice(prevFilmsCount, showingFilmsCount).forEach((film) => renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND));

    if (showingFilmsCount >= generatedFilms.length) {
      showMoreBtn.remove();
    }
  });
};

let filmComponent;

const menu = generateMenu(generatedFilms);

render(header, new ProfileComponent(), RenderPosition.BEFOREEND);
render(main, new MenuComponent(menu), RenderPosition.BEFOREEND);
render(footerStatistics, new StatisticsComponent(), RenderPosition.BEFOREEND);

if (generatedFilms.length === 0) {
  filmComponent = new FilmComponent(`There are no movies in our database`, true);
  renderNoFilmList(filmComponent);
} else {
  filmComponent = new FilmComponent(`All movies. Upcoming`, false);
  renderFilmCollections(filmComponent, generatedFilms);
}

