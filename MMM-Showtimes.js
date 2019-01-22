Module.register("MMM-Showtimes",{
  defaults: {
    movies: 5,
    cinema: 9521,
    title: "Vue Cinema Listings",
    scrollTime: 1000,
  },
  getScripts: function() {
		return ["jquery.js"];
	},
  getStyles: function(){
    return ["MMM-Showtimes.css"];
  },
  start: function(){
    Log.info("Starting Module: " + this.name);
    var style = document.createElement("style");
    style.innerHTML = `.cinema-listings ul > li.film:nth-child(n+` + (this.config.movies + 1) + `){
    	display:none;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
    var interval = setInterval(function(){
      var li = $('#cinema li').first();
  			$('#cinema li').first().remove();
  			$('#cinema').append(li);
    }, this.config.scrollTime);
  },
  getDom: function(){
    //  Create initial element.
    var wrapper = document.createElement("div");
    wrapper.className = "cinema-listings light";
    //  Create and append Title.
    var title = document.createElement("span");
    title.className = "title bright";
    title.innerHTML = this.config.title;
    wrapper.appendChild(title);
    //  Create and append Cinema ul.
    var cinema = document.createElement("ul");
    cinema.id = "cinema";
    //  Fetch Movies and show times.
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.cinelist.co.uk/get/times/many/" + this.config.cinema, true);
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
          Log.error(this.name + ": 401 UNAUTHORIZED.");
        } else {
          Log.error(this.name + ": Error Loading Cinema Listings.");
        }
      }
    };
    request.send();
    wrapper.appendChild(cinema);
    return wrapper;
  },
  getHeader: function() {
		return this.config.title;
	},
});
