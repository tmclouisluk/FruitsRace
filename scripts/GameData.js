/**
 * This document contains the game data and configuration
 */
// -1=unavailable, 0=empty, xy = user x, level y, e.g. 11, user 1 owns and the land is level 1
// generate the land mark from board road.
var land = {
	marker : [
		-1, 0, -1, 0, -1, 0, 0, -1, 0, 0,
		-1, 0, -1, 0, 0, 0, 0, -1, 0, 0,
		-1, 0, -1, 0, 0, 0, 0, 0, -1, 0,
		-1, 0, 0, -1, 0, 0, -1, 0, -1, 0
	], 
	cost : [
		-1, 1200, -1, 1200, -1, 4000, 2000, -1, 2000, 2000,
		-1, 2800, -1, 2800, 2800, 4000, 3600, -1, 3600, 3600,
		-1, 4400, -1, 4400, 4400, 4000, 5200, 5200, -1, 5200,
		-1, 6000, 6000, -1, 6000, 4000, -1, 7000, -1, 7000
	],
	pay : [
		50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
		50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
		50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
		50, 50, 50, 50, 50, 50, 50, 50, 50, 50
	],
	upgradefactor : [1,1.5,2,3]
};

function getLandLevel(boardIndex) {
	return land.marker[boardIndex] % 10;
}

function getLandOwner(boardIndex){
	return parseInt(land.marker[boardIndex]/10, 10) - 1;
}

