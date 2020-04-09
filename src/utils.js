import {MINUTES_IN_HOUR} from "./const.js";

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

  return `${hours}h ${minutes}m`;
};
