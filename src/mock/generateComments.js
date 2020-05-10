
import {COMMENTS_EMOJIS, COMMENTS_TEXTS, COMMENTS_AUTHORS} from "../const.js";
import {getRandomItem, formatCommentDate, getRandomNumber, getRandomDate} from "../utils/common";

const generateComment = () => {
  return {
    emoji: getRandomItem(COMMENTS_EMOJIS),
    author: getRandomItem(COMMENTS_AUTHORS),
    text: getRandomItem(COMMENTS_TEXTS),
    date: formatCommentDate(getRandomDate(new Date(2015, 0, 1), new Date())),
  };
};

export const generateComments = () => {
  return new Array(getRandomNumber(1, 5))
        .fill(``)
        .map(generateComment);
};

