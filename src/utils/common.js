import moment from "moment";
import { DurationTime } from "../const";


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

export const formatRank = (watchedFilmsNumber) => {
  if (!watchedFilmsNumber) {
    return ``;
  } else if (watchedFilmsNumber <= 10) {
    return `Novice`;
  } else if (watchedFilmsNumber > 10 && watchedFilmsNumber <= 20) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};

