import moment from "moment";

export const MINUTES_IN_HOUR = 60;

export const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomItem = (arr) => {
  const randomIndex = getRandomNumber(0, arr.length);
  return arr[randomIndex];
};

export const getRandomDuration = (duration) => {
  const hours = `${Math.floor(duration / MINUTES_IN_HOUR)}`;
  const minutes = `${duration % MINUTES_IN_HOUR}`;

  return (hours * MINUTES_IN_HOUR * 60 + minutes * 60) * 1000;
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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

