import FilmCardComponent from "../components/film-card.js";
import PopupComponent from "../components/popup.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESC_KEY, ControlButton, Mode, ENTER_KEY, SHAKE_ANIMATION_TIMEOUT} from "../const.js";
import {shake} from "../utils/common.js";
import {encode} from "he";
import FilmModel from "../models/film.js";
import CommentComponent from "../components/comment.js";
import CommentsModel from "../models/comments.js";
import Comment from "../models/comment";

const body = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange, api, onCommentChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onCommentChange = onCommentChange;

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

    const renderPopup = () => this._popup(film, commentsContainer);

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
      remove(oldPopupComponent);
      if (this._mode === Mode.POPUP) {
        renderPopup();
      }
      return;
    }
    render(container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    this._popupComponent.getElement().remove();
    this._commentComponent.reset();
    this._onCommentChange();
    this._popupComponent.setPopupCloseButtonClickHandler(() => {
      this._closePopup();
    });
  }

  _popup(film, commentsContainer) {
    const renderPopup = () => {
      body.appendChild(this._popupComponent.getElement());
      this._mode = Mode.POPUP;
      document.addEventListener(`keydown`, this._onEscKeyDown);


      this._api.getComments(this._film.id)
      .then((data) => {
        this._commentsModel.setComments(data);
        if (this._commentComponent) {
          remove(this._commentComponent);
        }
        this._commentComponent = new CommentComponent(this._commentsModel.getComments());
        render(commentsContainer, this._commentComponent, RenderPosition.BEFOREEND);
        this._commentComponent._setCommentsEmoji();

        this._commentComponent.setCommentsDeleteButtonClickHandler((evt) => {
          evt.preventDefault();
          const deleteCommentButton = evt.target;
          deleteCommentButton.innerHTML = `Deleting...`;
          deleteCommentButton.setAttribute(`disabled`, `true`);
    

          const commentElement = deleteCommentButton.closest(`.film-details__comment`);
          const deleteCommentId = commentElement.id;
          this._commentsModel.deleteComment(deleteCommentId)
          .then(() => {
            const newFilm = FilmModel.clone(film);
            this._commentComponent.showNormalBorder();
            newFilm.comments = this._film.comments.filter((commentId) => {
              return commentId !== deleteCommentId;
            });
            const comments = this._commentsModel.getComments();
            this._commentsModel.setComments(comments.filter((comment) => {
              return comment.id !== deleteCommentId;
            }));
            this._onDataChange(this, film, newFilm);
          })
          .catch(() => {
            deleteCommentButton.removeAttribute(`disabled`);
            shake(this._commentComponent.getElement().querySelectorAll(`.film-details__comment`), SHAKE_ANIMATION_TIMEOUT);
          });
        });

        this._commentComponent.setSendCommentHandler((evt) => {
          if (evt.key === ENTER_KEY && (evt.ctrlKey || evt.metaKey)) {
            if (!(this._commentComponent.getCurrentEmoji() && evt.target.value)) {
              this._commentComponent.showErrorBorder();
              shake(this._commentComponent.getElement(), SHAKE_ANIMATION_TIMEOUT);
            }

            const formElements = this._popupComponent.getElement().querySelector(`form`)
            .querySelectorAll(`input, textarea, button`);
            const newComment = new Comment({
              id: String(new Date().getTime() + Math.random()),
              emotion: this._commentComponent.getCurrentEmoji(),
              comment: encode(evt.target.value),
              date: new Date(),
            });

            this._disableFormElements(formElements);

            this._commentsModel.addComment(newComment, film.id)
            .then((response) => {
              const newFilm = new FilmModel(response.movie);
              this._onDataChange(this, film, newFilm);
              this._commentComponent.showNormalBorder();
              const newComments = response.comments.map((comment) => {
                return new Comment(comment);
              });
              this._commentsModel.setComments(newComments);
            })
            .catch(() => {
              this._activateFormElements(formElements);
              this._commentComponent.showErrorBorder();
              shake(this._commentComponent.getElement(), SHAKE_ANIMATION_TIMEOUT);
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

    return renderPopup();
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

  _disableFormElements(elements) {
    elements.forEach((element) => {
      element.setAttribute(`disabled`, `true`);
    });
  }

  _activateFormElements(elements) {
    elements.forEach((element) => {
      element.removeAttribute(`disabled`);
    });
  }
}
