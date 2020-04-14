
export const createControlsTemplate = (control, isActive) => {
  const {addToWatchList, markAsWatched, favourite} = control;
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${addToWatchList} ${isActive ? `active` : ``}">Add to watchlist</button>
     <button class="film-card__controls-item button film-card__controls-item--${markAsWatched} ${isActive ? `active` : ``}">Mark as watched</button>
     <button class="film-card__controls-item button film-card__controls-item--${favourite} ${isActive ? `active` : ``}">Mark as favorite</button>`
  );
};

export const createFilmCardTemplate = (film) => {
  const {title, poster, description, comments, rating, year, duration, genre} = film;
  const controls = createControlsTemplate(film);
  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${year}</span>
          <span class="film-card__duration">${duration}</span>
          <span class="film-card__genre">${genre}</span>
        </p>
        <img src=${poster} alt="${title}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          ${controls}
        </form>
      </article>`
  );
};
