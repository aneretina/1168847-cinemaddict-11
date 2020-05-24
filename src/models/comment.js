export default class CommentModel {
  constructor(api) {
    this._api = api;
    this._comments = [];
  }

  getComments() {
    return this._comments;
  }

  setCommentsByFilmId(filmId, handler) {
    this._api.getComments(filmId)
      .then((comments) => {
        this._comments = comments;
        handler();
      });
  }

  addComment(newComment) {
    this._comments.push(newComment);
  }

  deleteComment(commentId) {
    this._comments = [].concat(this._comments.slice(0, commentId), this._comments.slice(commentId + 1));
  }
}
