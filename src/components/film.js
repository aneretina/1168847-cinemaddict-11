export const createFilmTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export const createFilmListTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

export const createShowButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};
