import moment from "moment";
import {StatsSortType, BAR_HEIGHT} from "../const.js";
import {getHours, getMinutes, getRankType} from "../utils/common.js";
import AbstractSmartComponent from "./abstractSmartComponent.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';


const createRankMarkup = (rank) => {
  return (
    `<p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
    </p>`
  );
};

const getGenres = (watchedFilms) => {
  let genresCount = {};

  watchedFilms.map((film) => {
    film.genre.map((gen) => {
      if (gen in genresCount) {
        genresCount[gen]++;
      } else {
        genresCount[gen] = 1;
      }
    });
  });

  return genresCount;
};

const getTopGenre = (watchedFilms) => {
  const genresCount = getGenres(watchedFilms);

  let maxGenreCount = 1;
  let topGenre = ``;

  Object.keys(genresCount).map((genre) => {
    if (maxGenreCount === 1 || genresCount[genre] > maxGenreCount) {
      maxGenreCount = genresCount[genre];
      topGenre = genre;
    }
  });

  return topGenre;
};

const renderChart = (statsCtx, genres) => {
  if (Object.keys(genres).length === 0) {
    return null;
  }

  statsCtx.height = BAR_HEIGHT * Object.keys(genres).length;

  return new Chart(statsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(genres),
      datasets: [{
        data: Object.values(genres),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const getFilmsByPeriods = (films, period) => {
  let dateFrom;
  const today = new Date();

  switch (period) {
    case StatsSortType.TODAY:
      dateFrom = moment(today.setDate(today.getDate() - 1));
      break;
    case StatsSortType.WEEK:
      dateFrom = moment(today.setDate(today.getDate() - 7));
      break;
    case StatsSortType.MONTH:
      dateFrom = moment(today.setMonth(today.getMonth() - 1));
      break;
    case StatsSortType.YEAR:
      dateFrom = moment(today.setFullYear(today.getFullYear() - 1));
      break;
    default:
      dateFrom = null;
  }

  return films.filter((film) => {
    const watchedDate = film.watchedDate;

    if (!dateFrom) {
      return true;
    }
    return watchedDate.diff(dateFrom) > 0;
  });
};

const createStatsTemplate = (watchedFilms, filmsByPeriods, period) => {
  const rank = getRankType(watchedFilms.length);
  const rankMarkup = rank ? createRankMarkup(rank) : ``;

  const totalDuration = filmsByPeriods.reduce((prev, cur) => {
    prev.add(cur.duration);
    return prev;
  }, moment.duration());

  const hours = getHours(totalDuration);
  const minutes = getMinutes(totalDuration);


  const topGenre = getTopGenre(filmsByPeriods);

  return (
    `<section class="statistic">
    ${rankMarkup}
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${period === StatsSortType.ALL ? `checked` : ``}>
    <label for="statistic-all-time" data-period = "all-time" class="statistic__filters-label">All time</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${period === StatsSortType.TODAY ? `checked` : ``}>
    <label for="statistic-today" data-period = "today" class="statistic__filters-label">Today</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${period === StatsSortType.WEEK ? `checked` : ``}>
    <label for="statistic-week" data-period = "week" class="statistic__filters-label">Week</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${period === StatsSortType.MONTH ? `checked` : ``}>
    <label for="statistic-month" data-period = "month" class="statistic__filters-label">Month</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${period === StatsSortType.YEAR ? `checked` : ``}>
    <label for="statistic-year" data-period = "year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${filmsByPeriods.length}<span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${minutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
</section>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(films) {
    super();
    this._films = films;
    this._currentPeriod = StatsSortType.ALL;
    this._filmsByPeriods = getFilmsByPeriods(this._films, this._currentPeriod);
    this._chart = null;
    this._renderChart();

    this.setPeriodChangeHandler();
  }

  rerender() {
    super.rerender();
    this._renderChart();
  }

  recoveryListeners() {
    this.setPeriodChangeHandler();
  }


  getTemplate() {
    return createStatsTemplate(this._films, this._filmsByPeriods, this._currentPeriod);
  }

  _renderChart() {
    const statsCtx = this.getElement().querySelector(`.statistic__chart`);
    this._resetChart();
    if (this._films.length !== 0) {
      this._chart = renderChart(statsCtx, getGenres(getFilmsByPeriods(this._films, this._currentPeriod)));
    }
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  setPeriodChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {

      if (evt.target.tagName === `P`) {
        return;
      }

      this._currentPeriod = evt.target.dataset.period;
      this._filmsByPeriods = getFilmsByPeriods(this._films, this._currentPeriod);
      this.rerender();
    });
  }

}
