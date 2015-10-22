'use strict';

// take a look at it tomorrow
module.exports = function initialiseTrack (tracking) {
// create custom color for green
tracking.ColorTracker.registerColor('blue', function(r, g, b) {
	if (r < 50 && g < 50 && b > 200) {
		return true;
	}
	return false;
});
// create custom color for red
tracking.ColorTracker.registerColor('red', function(r, g, b) {
	// returns true to any value that is close to 255
	// reduce g and b to less than 50
	if (r > 200 && g < 50 && b < 50) {
		return true;
	}
	return false;
});

// enable color detection for red and green using tracking.js library
var colors = new tracking.ColorTracker(['blue', 'red']);
colors.on('track', function(event) {
	if (event.data.length === 0) {
		// No colors were detected in this frame.
	} else {
		event.data.forEach(function(rect) {
			// loop through colors that where detected and draw   
			console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
		});
	}
});
// tracker instance listening for a track event, ready to start tracking
tracking.track('#gameVid', colors);
var myTracker = new tracking.Tracker('target');
// listen for track events 
myTracker.on('track', function(event) {
	if (event.data.length === 0) {
		// No targets were detected in this frame.
	} else {
		event.data.forEach(function(data) {
			// Plots the detected targets here.
		});
	}
});
// utility to read <canvas>, <img>, <video> 
var trackerTask = tracking.track('#gameVid', myTracker);
//
}
