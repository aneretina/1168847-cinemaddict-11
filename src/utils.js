import {MINUTES_IN_HOUR, RenderPosition} from "./const.js";

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

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

