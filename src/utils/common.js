import moment from "moment";
import {DurationTime, RankType} from "../const";


export const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomItem = (arr) => {
  const randomIndex = getRandomNumber(0, arr.length);
  return arr[randomIndex];
};


export const formaDuration = (duration) => {
  const hours = moment.duration(duration, `minutes`).hours();
  const minutes = moment.duration(duration, `minutes`).minutes();

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const getHours = (duration) => {
  return Math.floor(duration / DurationTime.MINUTES_IN_HOUR);
};
export const getMinutes = (duration) => {
  return duration % DurationTime.MINUTES_IN_HOUR;
};

export const formatCommentDate = (date) => {
  return moment(date).format(`DD/MM/YY hh:mm`);
  // return moment(date).fromNow();
};

export const getRankType = (watchedFilmsNumber) => {
  switch (true) {
    case (watchedFilmsNumber >= RankType.NOVICE.from && watchedFilmsNumber <= RankType.FAN.from - 1):
      return RankType.NOVICE.rank;
    case (watchedFilmsNumber > RankType.FAN.from && watchedFilmsNumber <= RankType.MOVIE_BUFF.from - 1):
      return RankType.FAN.rank;
    case (watchedFilmsNumber > RankType.MOVIE_BUFF.from - 1):
      return RankType.MOVIE_BUFF.rank;
    default:
      return ``;
  }
};

export const shake = (element, timeout) => {
  element.style.animation = `shake ${timeout / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, timeout);
};


