import AbstractSmartComponent from "./abstractComponent.js";
import {EMOJIS} from "../const.js";

export const createCommentsMarkup = (comments) => {
  return comments
    .map((comment) => {
      return (
        `<li class="film-details__comment" id="${comment.id}">
      <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.userName}</span>
        <span class="film-details__comment-day">${comment.date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
      );
    }).join(`\n`);
};

const createEmojiMarkup = (emojis) => {
  return emojis
      .map((emoji) => {
        return (
          `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
           <label class="film-details__emoji-label" for="emoji-${emoji}">
            <img src="./images/emoji/${emoji}.png" data-emoji=${emoji} width="30" height="30" alt="emoji">
           </label>`
        );
      }).join(`\n`);
};

const createCommentsTemplate = (comments) => {
  const commentsCount = comments.length;
  const commentMarkup = createCommentsMarkup(comments);
  const emojiMarkup = createEmojiMarkup(EMOJIS);

  return (
    ` <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
          <ul class="film-details__comments-list">
              ${commentMarkup}
            </ul>
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>
                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>
              <div class="film-details__emoji-list">
                  ${emojiMarkup}
             </div>
            </div>
       </section>`
  );
};


export default class Comment extends AbstractSmartComponent {
  constructor(comments) {
    super();
    this._comments = comments;

    this._currentEmoji = null;

   // this._commentInputs = this.getElement().querySelector(`.film-details__comment-input`);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {

    this.setCommentsDeleteButtonClickHandler(this._deleteCommentsButtonClickHandler);
    this.setSendCommentHandler(this._sendCommentHandler);
  }

  setCommentsDeleteButtonClickHandler(handler) {
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtons.forEach((button) => button.addEventListener(`click`, handler));
    this._deleteCommentsButtonClickHandler = handler;
  }

  setSendCommentHandler(handler) {
    this._commentInputs.addEventListener(`keydown`, handler);
    this._sendCommentHandler = handler;
  }

  clearPopupEmojiContainer() {
    this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
  }

  reset() {
    this._commentInputs.value = ``;
  }
}
