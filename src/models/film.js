import moment from "moment";

export default class FilmModel {
  constructor(data) {
    this.id = data.id;
    this.title = data.film_info.title;
    this.originalTitle = data.film_info.alternative_title;
    this.poster = data.film_info.poster;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.year = data.film_info.release.date;
    this.duration = data.film_info.runtime;
    this.actors = data.film_info.actors;
    this.description = data.film_info.description;
    this.rating = data.film_info.total_rating;
    this.country = data.film_info.release.release_country;
    this.genre = data.film_info.genre;
    this.ageLimit = data.film_info.age_rating;
    this.addedToWatchList = Boolean(data.user_details.watchlist);
    this.markedAsWatched = Boolean(data.user_details.already_watched);
    this.isFavorite = Boolean(data.user_details.favorite);
    this.watchedDate = moment(data.user_details.watching_date);
    this.comments = data.comments;
  }

  toRAW() {

    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitle,
        "poster": this.poster,
        "director": this.director,
        "writers": this.writers,
        "release": {
          "date": this.year,
          "release_country": this.country,
        },
        "runtime": this.duration,
        "actors": this.actors,
        "description": this.description,
        "total_rating": this.rating,
        "genre": this.genre,
        "age_rating": this.ageLimit,
      },
      "user_details": {
        "watchlist": this.addedToWatchList,
        "already_watched": this.markedAsWatched,
        "favorite": this.isFavorite,
        "watching_date": this.watchedDate.toISOString(),
      }
    };
  }
  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  static clone(data) {
    return new FilmModel(data.toRAW(true));
  }
}
