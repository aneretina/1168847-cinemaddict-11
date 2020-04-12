
import {COMMENTS_EMOJIS, COMMENTS_TEXTS, COMMENTS_AUTHORS} from "../const.js";
import {getRandomItem, getRandomDate} from "../utils.js";
import {createCommentsTemplate} from "../components/comment.js";

const generateComment = () => {
  return {
    emoji: getRandomItem(COMMENTS_EMOJIS),
    author: getRandomItem(COMMENTS_AUTHORS),
    text: getRandomItem(COMMENTS_TEXTS),
    date: getRandomDate(new Date(2015, 1, 1), new Date()),
  };
};

export const generateComments = (count) => {
  let comments = new Array(count)
        .fill(``)
        .map(generateComment);
  return comments.map((it) => createCommentsTemplate(it)).join(`\n`);
};
