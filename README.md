# MMM-Rainbow - Local Cinema Showtimes for MagicMirror²

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Unfortunately this is UK only for now. If there's enough interest I will source a better API for global use.
Although I'm sure most of you could easily alter a few lines with an API of your choice to find cinemas close to you.


## Preview

![](img/preview.gif)


## Installation
	
Installation is very simple, just clone the git into your modules directory then add the module to your config.

```shell
cd ~/MagicMirror/modules
git clone https://github.com/aSeann/MMM-Showtimes
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
			module: "MMM-Showtimes",
			position: "top_right",
			config: {
				movies: 5,
				cinema: 9521,		//	Get your local cinema ID from http://www.cinelist.co.uk/
				scrollTime: 3000,	//	Duration in milliseconds to display the next film in the list and remove the first.
				title: "Cinema Listings"	//	What ever you want the title to be, e.g. "Cinema Listings"
			}
		},
    ]
}
```
