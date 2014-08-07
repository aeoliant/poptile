var EMPTY = 0;
var game = {
	init: function () {
		var h = 0;
		game.width = 4;
		game.height = 13;
		game.board = [];
		game.numColours = 5;
		game.charKey = ['*', '#', '@', '!', '&', '%'];
		for (;h < game.height; h++) {
			game.board[h] = [];
		}
		game.newGame();
	},

	newGame: function() {
		game.gameOver = false;
		game.score = 0;
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
				game.gravity();
				game.shift();
				game.generateNewLine();
				game.checkGameOver();
				//game.print();
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

	// Call this after pop
	gravity: function () {
		var h = 0, w = 0;
		for (; w < game.width; w++) {
			for (; h < game.height && game.board[h][w] != EMPTY; h++) {}
			if (h == game.height) {
				h = 0;
				continue;
			}
			var ground = h;
			for (; h < game.height && game.board[h][w] == EMPTY; h++) {}
			if (h == game.height) {
				h = 0;
				continue;
			}
			var sky = h;
			var diff = sky - ground;
			if (diff == 0) {
				h = 0;
				continue;
			}
			for (; h < game.height && game.board[h][w] != EMPTY; h++) {
				game.board[h - diff][w] = game.board[h][w];
			}
			h = h - diff;
			var outerspace = h;
			for (; h < outerspace + diff; h++) {
				console.log(h);
				game.board[h][w] = EMPTY;
			}
			h = 0;
		}
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

	generateNewLine: function () {
		var w = 0;
		for (; w < game.width; w++) {
			game.board[0][w] = game.randomColour();
		}
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
	}

};

//module.exports.game = game;
