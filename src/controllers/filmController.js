/* eslint-disable no-unused-expressions */
/* eslint-disable max-nested-callbacks */
import FilmCardComponent from "../components/filmCard.js";
import PopupComponent from "../components/popup.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESC_KEY, ControlButton, Mode, ENTER_KEY} from "../const.js";
import {formatCommentDate, getRandomDate} from "../utils/common.js";
import {encode} from "he";
import FilmModel from "../models/film";
import CommentComponent from "../components/comment.js";
import CommentsModel from "../models/comments.js";

const body = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._api = api;
    this._popupComponent = null;
    this._filmCardComponent = null;
    this._commentComponent = null;
    this._commentsModel = new CommentsModel(this._api);

    this._id = null;
    this._mode = Mode.DEFAULT;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._film = film;
    const container = this._container;
    this._id = film.id;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._popupComponent = new PopupComponent(film);
    const commentsContainer = this._popupComponent.getElement().querySelector(`.form-details__bottom-container`);

    const renderPopup = () => {
      body.appendChild(this._popupComponent.getElement());
      this._mode = Mode.POPUP;
      document.addEventListener(`keydown`, this._onEscKeyDown);


      this._api.getComments(this._film.id)
      .then((data) => {
        this._commentsModel.setComments(data);
        this._commentComponent = new CommentComponent(this._commentsModel.getComments());
        render(commentsContainer, this._commentComponent, RenderPosition.BEFOREEND);
        this._commentComponent._setCommentsEmoji();

        this._commentComponent.setCommentsDeleteButtonClickHandler((evt) => {
          evt.preventDefault();
          const deleteCommentButton = evt.target;
          const commentElement = deleteCommentButton.closest(`.film-details__comment`);
          const deleteCommentId = commentElement.id;
          this._commentsModel.deleteComment(deleteCommentId)
          .then(() => {
            const newFilm = FilmModel.clone(film);
            newFilm.comments = this._film.comments.filter((commentId) => {
              return commentId !== deleteCommentId;
            });
            // let comments = this._commentsModel.getComments();
            // this._commentsModel.setComments(comments.filter((comment) => {
            // comment.id !== deleteCommentId;
            // }));
            this._onDataChange(this, film, newFilm);
          });
        });

        this._commentComponent.setSendCommentHandler((evt) => {
          if (evt.key === ENTER_KEY && (evt.ctrlKey || evt.metaKey)) {
            const newComment = {
              id: String(new Date().getTime() + Math.random()),
              emoji: this._commentComponent.getCurrentEmoji(),
              text: encode(evt.target.value),
              date: formatCommentDate(getRandomDate(new Date(2015, 0, 1), new Date())),
            };

            if (!newComment) {
              return;
            }

            this._commentsModel.addComment(newComment, film.id)
            .then(() => {
              const newFilm = FilmModel.clone(film);
              newFilm.comments = newFilm.comments.concat(newComment);
              this._onDataChange(this, film, newFilm);
            });
          }
        });
      });
    };

    this._popupComponent.setPopupCloseButtonClickHandler(() => {
      this._closePopup();
    });

    this._popupComponent.setControlButtonsChangeHandler((buttonName) => {
      if (buttonName === ControlButton.WATCHLIST) {
        const newFilm = FilmModel.clone(film);
        newFilm.addedToWatchList = !newFilm.addedToWatchList;
        this._onDataChange(this, film, newFilm);
      }

      if (buttonName === ControlButton.WATCHED) {
        const newFilm = FilmModel.clone(film);
        newFilm.markedAsWatched = !newFilm.markedAsWatched;
        this._onDataChange(this, film, newFilm);
      }

      if (buttonName === ControlButton.FAVORITE) {
        const newFilm = FilmModel.clone(film);
        newFilm.isFavorite = !newFilm.isFavorite;
        this._onDataChange(this, film, newFilm);
      }
    });

    this._filmCardComponent.setClickPopupShowElementsHandler(() => {
      this._onViewChange();
      renderPopup();
    });

    this._filmCardComponent.setAddToWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.addedToWatchList = !newFilm.addedToWatchList;
      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setMarkAsWatchButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.markedAsWatched = !newFilm.markedAsWatched;
      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(film);
      newFilm.isFavorite = !newFilm.isFavorite;
      this._onDataChange(this, film, newFilm);
    });

    if (oldFilmCardComponent && oldPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupComponent, oldPopupComponent);
      return;
    }
    render(container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }


  _closePopup() {
    this._mode = Mode.DEFAULT;
    this._popupComponent.getElement().remove();
    // this._popupComponent.clearPopupEmojiContainer();
    this._popupComponent.removePopupCloseButton(() => {
      this._closePopup();
    });
  }

  _onEscKeyDown(evt) {
    if (evt.key === ESC_KEY) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
      this._mode = Mode.DEFAULT;
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  getId() {
    return this._id;
  }
}
