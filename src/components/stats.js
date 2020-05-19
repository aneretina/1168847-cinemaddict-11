import moment from "moment";
import {StatsSortType, BAR_HEIGHT} from "../const.js";
import {formatRank} from "../utils/common.js";
import {getWatchedFilms} from "../utils/filter";
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

const renderChart = (statsCtx, watchedFilms) => {
  const genresCounts = getGenres(watchedFilms);
  statsCtx.height = BAR_HEIGHT * genresCounts.length;

  return new Chart(statsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(genresCounts),
      datasets: [{
        data: Object.values(genresCounts),
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

const createStatsTemplate = (films, filterType) => {
  const watchedFilms = getWatchedFilms(films);
  const watchedFilmsCount = watchedFilms.length;
  const rank = formatRank(watchedFilms.length);
  const rankMarkup = rank ? createRankMarkup(rank) : ``;

  const totalDuration = watchedFilms.reduce((prev, cur) => {
    prev += cur.duration;
    return prev;
  }, 0);

  const hours = moment.utc(moment.duration(totalDuration, `minutes`).asMilliseconds()).format(`H`);
  const minutes = moment.utc(moment.duration(totalDuration, `minutes`).asMilliseconds()).format(`m`);

  const topGenre = getTopGenre(watchedFilms);

  return (
    `<section class="statistic">
    ${rankMarkup}
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${filterType === StatsSortType.ALL ? `checked` : ``}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${filterType === StatsSortType.TODAY ? `checked` : ``}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${filterType === StatsSortType.WEEK ? `checked` : ``}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${filterType === StatsSortType.MONTH ? `checked` : ``}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${filterType === StatsSortType.YEAR ? `checked` : ``}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span></p>
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
    this._watchedFilms = getWatchedFilms(this._films);
    this._activeSortType = StatsSortType.ALL;


    this._chart = null;
  }

  rerender() {
    this._renderChart();
  }

  show() {
    super.show();
  }

  recoveryListeners() {
    this.setFilterInputHandler(this.filterInputhandler);
  }


  getTemplate() {
    return createStatsTemplate(this._films, this._activeSortType);
  }

  _renderChart() {
    const statsCtx = this.getElement().querySelector(`.statistic__chart`);
    if (this._watchedFilms.length !== 0) {
      this._chart = renderChart(statsCtx, this._watchedFilms);
    }
  }

  setFilterInputHandler(handler) {
    this.getElement().querySelectorAll(`.statistic__filters-input`)
        .forEach((input) => {
          input.addEventListener(`change`, (evt) => {
            handler(evt.target.value);
          });
        });
    this.filterInputhandler = handler;
  }
}
