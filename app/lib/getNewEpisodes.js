var request = nRequire("request");
var _       = nRequire("underscore");
var zpad    = nRequire("zpad");
var util    = nRequire("util")
var moment  = nRequire("moment");

import globals from "./globals";

export default function(accessToken, callback) {
  var headers = {
    "Content-Type": "application/json",
    "trakt-api-key": globals.getClientID(),
    "trakt-api-version": "2",
    "Authorization": "Bearer " + accessToken
  }

  var days = 7;
  var date = new Date();
  date.setDate(date.getDate() - days);
  var printableDate = moment(date).format("YYYY-MM-DD");

  var options = {
    url: "https://api-v2launch.trakt.tv/calendars/my/shows/" + printableDate + "/" + (days + 1),
    headers: headers
  };

  request(options, function(error, response, body){
    var raw = JSON.parse(body);
    var episodes = _.map(raw, function(data) {
      var episode = data["episode"];
      var firstAired = data["first_aired"];
      var title = episode["title"];
      var season = zpad(episode["season"], 2);
      var number = zpad(episode["number"], 2);
      var show = data["show"]["title"];
      return {
        "show": show,
        "what": util.format("s%se%s", season, number),
        "title": title,
        "firstAired": new Date(firstAired)
      }
    });

    callback(episodes)
  });
}