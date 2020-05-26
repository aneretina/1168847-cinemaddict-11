export default class CommentsModel {
  constructor(data) {
    this.id = data.id;
    this.emoji = data.emotion;
    this.date = data.date ? new Date(data.date) : null;
    this.userName = data.author;
    this.text = data.comment;
  }

  static parseComment(data) {
    return new CommentsModel(data);
  }

  static parseComments(data) {
    return data.map(CommentsModel.parseComment);
  }
}
