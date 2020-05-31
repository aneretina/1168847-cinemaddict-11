export default class Comments {
  constructor(api) {
    this._comments = [];
    this._api = api;
  }

  getComments() {
    return this._comments;
  }

  setComments(data) {
    this._comments = data;
  }

  deleteComment(id) {
    return this._api.deleteComment(id);
  }

  addComment(data, id) {
    return this._api.createComment(data, id);
  }
}
