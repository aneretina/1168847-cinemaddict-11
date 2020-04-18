
import ProfileComponent from "./components/profile.js";
import MenuComponent from "./components/menu.js";
import FilmComponent from "./components/film.js";
import FilmCardComponent from "./components/filmCard.js";
import TopRatedComponent from "./components/topRated.js";
import MostCommentedComponent from "./components/mostCommented.js";
import StatisticsComponent from "./components/statistics.js";
import PopupComponent from "./components/popup.js";
import {FILM_CARDS_PER_ROW, FILM_CARDS_BY_BUTTON, RenderPosition, ESC_KEY} from "./const.js";
import {generatedFilms} from "./mock/generateFilmCards";
import {generateMenu} from "./mock/generateMenu";
import {render} from "./utils.js";

const firstCard = generatedFilms[0];
const menu = generateMenu(generatedFilms);

let showingFilmsCount = FILM_CARDS_PER_ROW;

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);
const footer = document.querySelector(`.footer`);
const footerStatistics = footer.querySelector(`.footer__statistics`);

const filmComponent = new FilmComponent();
const showMoreBtn = filmComponent.getElement().querySelector(`.films-list__show-more`);

render(header, new ProfileComponent().getElement(), RenderPosition.BEFOREEND);
render(main, new MenuComponent(menu).getElement(), RenderPosition.BEFOREEND);
render(main, new FilmComponent().getElement(), RenderPosition.BEFOREEND);
render(footerStatistics, new StatisticsComponent().getElement(), RenderPosition.BEFOREEND);

const renderFilm = (container, film, position) => {
  const popupComponent = new PopupComponent(film);
  const popupElement = popupComponent.getElement();
  const popupMainElements = [`.film-card__poster`, `.film-card__title`, `.film-card__comments`];
  const popupCloseBtn = popupElement.querySelector(`.film-details__close-btn`);
  console.log(popupElement)

  const renderPopup = () => {
    body.appendChild(popupElement);
    document.addEventListener(`keydown`, onEscKeyDown);
    popupCloseBtn.addEventListener(`click`, onPopupCloseBtnClick);
  };

  const closePopup = () => {
    body.removeChild(popupElement);
    document.removeEventListener(`keydown`, onEscKeyDown);
    popupCloseBtn.removeEventListener(`click`, onPopupCloseBtnClick);
  };

  const onPopupCloseBtnClick = () => {
    closePopup();
  };

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === ESC_KEY) {
      closePopup();
    }
  };

  const filmCardComponent = new FilmCardComponent(film);
  render(container, filmCardComponent.getElement(), position);

  popupMainElements.forEach((element) => {
    filmCardComponent.getElement()
    .querySelector(element)
    .addEventListener(`click`, renderPopup);
  });

};

const renderFilmCollections = (container, films) => {
  const filmsListContainer = container.getElement().querySelector(`.films-list__container`);

  films.slice(0, showingFilmsCount)
  .forEach((film) => renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND));


  showMoreBtn.addEventListener(`click`, () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + FILM_CARDS_BY_BUTTON;

    films.slice(prevFilmsCount, showingFilmsCount).forEach((film) => renderFilm(filmsListContainer, film, RenderPosition.BEFOREEND));

    if (showingFilmsCount >= generatedFilms.length) {
      showMoreBtn.remove();
    }
  });
};

renderFilmCollections(new FilmComponent(), generatedFilms);


// Отрисовка доп карточек (topRated и mostCommented)

// const mostCommentedFilms = generatedFilms.slice().sort((a, b) => a.comments.length >= b.comments.length ? -1 : 1);
// const topRatedFilms = generatedFilms.slice().sort((a, b) => a.rating > b.rating ? -1 : 1);


// const topRatedFilmsList = films.querySelector(`.films-list--extra`);
// const topRatedFilmsContainer = topRatedFilmsList.querySelector(`.films-list__container`);

// topRatedFilms.slice(0, EXTRA_FILM_CARDS)
// .forEach((film) => render(topRatedFilmsContainer, createFilmCardTemplate(film), `beforeend`));

// const mostCommentedFilmsList = films.querySelector(`.films-list--extra:last-child`);
// const mostCommentedFilmsContainer = mostCommentedFilmsList.querySelector(`.films-list__container`);

// mostCommentedFilms.slice(0, EXTRA_FILM_CARDS)
// .forEach((film) => render(mostCommentedFilmsContainer, createFilmCardTemplate(film), `beforeend`));
