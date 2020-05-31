import moment from "moment";

export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.text = data[`comment`];
    this.userName = data[`author`];
    this.date = data[`date`];
    this.emoji = data[`emotion`];
  }

  toRaw() {
    return {
      "comment": this.text,
      "date": moment(this.date).toISOString(),
      "emotion": this.emoji
    }
  }
  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
