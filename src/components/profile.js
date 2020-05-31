import AbstractComponent from "./abstractComponent.js";
import {getRankType} from "../utils/common";

export const createUserRankHeaderProfileTemplate = (watchedFilms) => {
  const userRank = watchedFilms ? getRankType(watchedFilms.length) : ``;
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRankHeaderProfile extends AbstractComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
  }

  getTemplate() {
    return createUserRankHeaderProfileTemplate(this._filmsModel);
  }
}
