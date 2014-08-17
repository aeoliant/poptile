var EMPTY = 0;
var game = {
	init: function () {
		var h = 0;
		game.width = 4;
		game.height = 13;
		game.board = [];
		game.numColours = 4;
		game.charKey = ['*', '#', '@', '!', '&', '%'];
		for (;h < game.height; h++) {
			game.board[h] = [];
		}
		game.newGame();
	},

	newGame: function() {
		game.gameOver = false;
		game.score = 0;
		game.limit = 200;
		game.diff = 400;
		var h = 0, w = 0;
		for (; h < 4; h++) {
			for (;w < game.width; w++) {
				game.board[h][w] = game.randomColour();
			}
			w = 0;
		}
		for (; h < game.height; h++) {
			for (;w < game.width; w++) {
				game.board[h][w] = EMPTY;
			}
			w = 0;
		}
	},

	randomColour: function () {
		return Math.floor(Math.random() * game.numColours) + 1;
	},

	pop: function (h, w, target) {
		if (!game.gameOver && game.inBounds(h, w)) {
			if (target == undefined && game.board[h][w] != EMPTY) {
				game.pop(h, w, game.board[h][w]);
				var steps = [];
				while (steps.push(game.copy2dArray(game.board)) && game.gravity(steps) && steps.push(game.copy2dArray(game.board)) && game.cascade()) {
				}
				console.log(steps);
				game.shift();
				game.generateNewLine();
				game.checkGameOver();
				//game.print();
				return steps;
			}
			else if (game.board[h][w] == target) {
				game.board[h][w] = EMPTY;
				game.score++;
				game.pop(h + 1, w, target);
				game.pop(h - 1, w, target);
				game.pop(h, w + 1, target);
				game.pop(h, w - 1, target);
			}
		}
	},

	inBounds: function (h, w) {
		return (h >= 0 && h < game.height && w >= 0 && w < game.width);
	},

	// Simulates gravity by making all tiles fall down as far as they go
	// Returns: true if anything moved, false otherwise
	gravity: function(steps) {
		var h = 0, w = 0, moved = false;
		var vectorGraph = [];
		for (; w < game.width; w++) {
			vectorGraph[w] = [];
			var moveDown = 0;
			for (; h < game.height; h++) {
				if (game.board[h][w] == EMPTY) {
					moveDown++;
				}
				else {
					if (moveDown > 0 && game.board[h][w] != EMPTY) {
						moved = true;
					}
					game.board[h - moveDown][w] = game.board[h][w];
					
					if (moveDown > 0) {
						vectorGraph[w][h] = moveDown;
						game.board[h][w] = EMPTY;
					}
				}
			}
			h = 0;
		}
		//console.log("moved: " + moved);
		//console.log(vectorGraph);
		if (moved) 
			steps.push(vectorGraph);
		return moved;
	},

	// Precondition: h, w in bounds
	// Returns: true if board.game[h][w] is part of a 3 in-a-row, false otherwise
	check3: function(h, w) {
		var d = 1, hcount = 1, vcount = 1;
		for (; d < 3; d++) {
			if (w + d < game.width && game.board[h][w + d] == game.board[h][w]) {
				hcount++;
			}
			if (h + d < game.height && game.board[h + d][w] == game.board[h][w]) {
				vcount++;
			}
		}
		//console.log("[" + h + ", " + w + "] hcount: " + hcount + " vcount: " + vcount);
		return (hcount == 3) || (vcount == 3);
	},

	// Pops 3 in-a-rows
	// Returns: true if it finds a 3 in-a-row, false otherwise
	cascade: function () {
		var h = 0, w = 0, popped = false;
		for (; h < game.height; h++) {
			for (; w < game.width; w++) {
				if (game.board[h][w] != EMPTY && game.check3(h, w)) {
					popped = true;
					//console.log("popped: [" + h + ", " + w + "]");
					game.pop(h, w, game.board[h][w]);
				}
			}
			w = 0;
		}
		//console.log("popped: " + popped);
		return popped;
	},

	shift: function () {
		var h = game.height - 1, w = 0;
		for (; w < game.width; w++) {
			for (; h > 0; h--) {
				game.board[h][w] = game.board[h - 1][w];
			}
			h = game.height - 1;
		}
	},

	// New line can't have run of 3
	checkNewLine: function() {
		var w = 0;
		for (; w < game.width; w++) {
			if (game.check3(0, w) == true) {
				return true;
			}
		}
		return false;
	},

	generateNewLine: function () {
		var w = 0;
		// New line can't have run of 3, just looks odd
		do {
			w = 0;
			for (; w < game.width; w++) {
				game.board[0][w] = game.randomColour();
			}
		}
		while (game.checkNewLine());
	},

	checkGameOver: function () {
		var w = 0;
		for (; w < game.width; w++) {
			if (game.board[game.height - 1][w] != EMPTY)
				game.gameOver = true;
		}
	},

	print: function() {
		var h = game.height - 1, w = 0;
		for (; h >= 0; h--) {
			for (; w < game.width; w++) {
				process.stdout.write(game.charKey[game.board[h][w]]);
			}
			process.stdout.write('\n');
			w = 0;
		}
	},

	copy2dArray: function(arr) {
		var i = 0, len = arr.length, copy = new Array(len);
		for (; i < len; i++)
    		copy[i] = arr[i].slice(0);
    	return copy;
	},

	bumpScore: function() {
		game.score++;
		if (game.score >= game.limit) {
			game.limit = game.limit + game.diff;
			game.diff = game.diff * 2;
			game.numColours++;
		}
	}

};

//module.exports.game = game;
