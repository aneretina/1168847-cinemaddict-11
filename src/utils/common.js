import moment from "moment";
import {DurationTime, RankType} from "../const";

export const formatDuration = (duration) => {
  const hours = moment.duration(duration, `minutes`).hours();
  const minutes = moment.duration(duration, `minutes`).minutes();

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const getHours = (duration) => {
  return Math.floor(duration / DurationTime.MINUTES_IN_HOUR);
};
export const getMinutes = (duration) => {
  return duration % DurationTime.MINUTES_IN_HOUR;
};

export const formatCommentDate = (date) => {
  return moment(date).fromNow();
};

export const getRankType = (watchedFilmsNumber) => {
  switch (true) {
    case (watchedFilmsNumber >= RankType.NOVICE.from && watchedFilmsNumber < RankType.FAN.from):
      return RankType.NOVICE.rank;
    case (watchedFilmsNumber >= RankType.FAN.from && watchedFilmsNumber < RankType.MOVIE_BUFF.from):
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


