import {MENU_OPTIONS} from "../const.js";

export const generateMenu = () => {
  return MENU_OPTIONS.map((it) => {
    return {
      menuOption: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};

