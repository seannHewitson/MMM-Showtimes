var Showtimes;
Module.register("MMM-Showtimes",{
  defaults: {
    movies: 5,
    cinema: 9521,
    scrollTime: 1000,
  },
  getScripts: function() {
		return ["jquery.js"];
	},
  getStyles: function(){
    return ["MMM-Showtimes.css"];
  },
  start: function(){
    Showtimes = this;
    Log.info("Starting Module: " + Showtimes.name);
    var style = document.createElement("style");
    style.className = "Cinema";
    style.innerHTML = `.cinema-listings ul > li.film:nth-child(n+` + (Showtimes.config.movies + 1) + `){
      height:0;
      margin:0;
      padding:0;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
    var scrollInterval = setInterval(function(){
      var li = $('#cinema li').first();
  			$('#cinema li').first().remove();
  			$('#cinema').append(li);
    }, Showtimes.config.scrollTime);
  },
  getDom: function(){
    var wrapper = document.createElement("div");
    wrapper.className = "cinema-listings light";
    wrapper.id = "Update-Showtimes";
    wrapper.innerHTML = "";
    return wrapper;
  },
  notificationReceived: function(notification, data, sender) {
		if(notification === "iCLOCK_MIDNIGHT"){
        var wrapper = document.getElementById("Update-Showtimes");
        wrapper.innerHTML = "";
        var cinema = Showtimes.getListings();
        wrapper.appendChild(cinema);
		} else if(notification === "iCLOCK_5_MIN")
      setTimeout(Showtimes.getLate(data), 1000);
	},
  getLate: function(data){
    var films = document.getElementsByClassName('film');
    for(var i = 0; i < films.length; i++){
      var times = films[i].getElementsByTagName('li');
      for(var j = 0; j < times.length; j++){
        var inner = times[j].innerHTML.split(":");
        if(parseInt(inner[0]) < parseInt(data.hour)){
          if(!times[j].classList.contains("red"))
            times[j].classList.add("red");
        }
        else if(parseInt(inner[0]) == parseInt(data.hour))
          if(parseInt(inner[1]) < parseInt(data.minute)){
            if(!times[j].classList.contains("red"))
              times[j].classList.add("red");
          }
      }
    }
  },
  getListings: function(){
    var cinema = document.createElement("ul");
    cinema.id = "cinema";
    //  Fetch Movies and show times.
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.cinelist.co.uk/get/times/many/" + Showtimes.config.cinema, true);
    request.onreadystatechange = function(){
      if(this.readyState === 4){
        if(this.status === 200){
          movies = JSON.parse(this.response);
          //  Iterate through movies.
          for(var i = 0; i < movies.results[0].listings.length; i++){
            //  Create and append movie.
            var movie = document.createElement("li");
            movie.className = "normal film";
            movie.id = "movie";
            //  Create and append Movie Title.
            var movieTitle = document.createElement("span");
            movieTitle.className = "align-left normal xsmall";
            movieTitle.innerHTML = movies.results[0].listings[i].title;
            movie.appendChild(movieTitle);
            //  Create and append Showtimes ul
            var showTimes = document.createElement("ul");
            showTimes.className = "align-right";
            for(var j = 0; j < movies.results[0].listings[i].times.length; j++){
              //  Create and append Showtime li.
              var showTime = document.createElement("li");
              showTime.className = "dimmed xsmall";
              showTime.innerHTML = movies.results[0].listings[i].times[j];
              showTimes.appendChild(showTime);
            }
            movie.appendChild(showTimes)
            cinema.appendChild(movie);
          }
        } else if(this.status === 401){
          Log.error(Showtimes.name + ": 401 UNAUTHORIZED.");
        } else {
          Log.error(Showtimes.name + ": Error Loading Cinema Listings.");
        }
      }
    };
    request.send();
    return cinema;
  },
});
