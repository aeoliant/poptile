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
		if (game.inBounds(h, w)) {
			if (target == undefined) {
				game.pop(h, w, game.board[h][w]);
				game.gravity();
				game.shift();
				game.generateNewLine();
				game.print();
			}
			if (game.board[h][w] == target) {
				game.board[h][w] = EMPTY;
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

	// Call this after pop
	gravity: function () {
		var h = 0, w = 0;
		for (; w < game.width; w++) {
			for (; h < game.height && game.board[h][w] != EMPTY; h++) {console.log(h);}
			if (h == game.height) {
				h = 0;
				continue;
			}
			var ground = h;
			console.log("ground = " + ground);
			for (; h < game.height && game.board[h][w] == EMPTY; h++) {console.log(h);}
			if (h == game.height) {
				h = 0;
				continue;
			}
			var sky = h;
			var diff = sky - ground;
			console.log("sky = " + sky);
			if (diff == 0) {
				h = 0;
				continue;
			}
			for (; h < game.height && game.board[h][w] != EMPTY; h++) {
				game.board[h - diff][w] = game.board[h][w];
				console.log("moving [" + h + ", " + w + "] to [" + (h - diff) + ", " + w + "]");
			}
			h = h - diff;
			var outerspace = h;
			console.log("outerspace = " + outerspace);
			for (; h < outerspace + diff; h++) {
				console.log(h);
				game.board[h][w] = EMPTY;
			}
			h = 0;
		}
	},

	shift: function () {
		var h = 0, w = 0;
		for (; w < game.width; w++) {
			for (; h < game.height && game.board[h][w] != EMPTY; h++) {console.log(h);}
			if (h == game.height) {
				h = 0;
				continue;
			}
			var top = h;
			for (; h >= 0; h--) {
				game.board[h + 1][w] = game.board[h][w];
			}
			h = 0;
		}
	},

	generateNewLine: function () {
		var w = 0;
		for (; w < game.width; w++) {
			game.board[0][w] = game.randomColour();
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
	}

};

module.exports.game = game;
