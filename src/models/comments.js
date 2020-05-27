export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.text = data[`comment`];
    this.userName = data[`author`];
    this.date = data[`date`];
    this.emoji = data[`emotion`];
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}