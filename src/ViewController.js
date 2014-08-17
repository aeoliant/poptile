var COLOURS = ["#ffffff", "#2ecc71", "#3498db", "#e74c3c", "#f1c40f", "#9b59b6", "#F89406", "#22313F", "#95A5A6"];
var COLOURS_HOVER = ["#E6E6E6", "#15B358", "#1B7FC2", "#CE3323", "#D8AB00", "#82409D", "#DF7B00", "#091826", "#7C8C8D"];

var CELL_SIZE = 35;
var elem = document.getElementById("svg");
var WIDTH = elem.offsetWidth;
var HEIGHT = elem.offsetHeight;

var s = Snap("#svg");
var squares = s.g();

game.init();

var midx = WIDTH/2, midy = HEIGHT/2;
var h = 0, w = 0;
for (; h < game.height; h++) {
	for (; w < game.width; w++) {
		//x,y,w,h
		var square = s.rect(Math.round(midx - (game.width * CELL_SIZE / 2) + (CELL_SIZE * w)), Math.round(midy + (game.height * CELL_SIZE / 2) - 100 - (CELL_SIZE * h)), CELL_SIZE, CELL_SIZE);
		square.attr({
			'gameh':h,
			'gamew':w,
		    fill: COLOURS[game.board[h][w]]
		});
		square.hover(function(a) {
			a.toElement.setAttribute("fill", COLOURS_HOVER[game.board[parseInt(a.toElement.getAttribute("gameh"))][parseInt(a.toElement.getAttribute("gamew"))]]);
		},
		function(a) {
			a.fromElement.setAttribute("fill", COLOURS[game.board[parseInt(a.fromElement.getAttribute("gameh"))][parseInt(a.fromElement.getAttribute("gamew"))]]);
		});
		squares.add(square);
	}
	w = 0;
}

var topLine = s.line(Math.round(midx - (game.width * CELL_SIZE / 2)), Math.round(midy - (game.height * CELL_SIZE / 2 - CELL_SIZE * 2) - 100), Math.round(midx + (game.width * CELL_SIZE / 2)), Math.round(midy - (game.height * CELL_SIZE / 2 - CELL_SIZE * 2) - 100));
topLine.attr({
	stroke: "#7f8c8d",
	strokeWidth: 2,
	"stroke-dasharray" : [4]
});
var score = s.text(-100, -100, game.score.toString());
score.attr({
	fontFamily: 'Lato',
	textAnchor: 'center',
	fill: "#4C595A",
	"font-size":20
})
var scoreBox = score.getBBox();
score.attr({
	x: Math.round(midx - (scoreBox.width/2)),
	y: Math.round(midy + (game.height * CELL_SIZE / 2))
});

var redraw = function (board) {
	if (!board) {
		board = game.board
	}
	var i = 0;
	for (; i < game.height * game.width; i++) {
		var h = squares[i].attr("gameh");
		var w = squares[i].attr("gamew");
		squares[i].attr({
			fill: COLOURS[board[h][w]]
		});
	}
	score.node.textContent = game.score;
	var sbox = score.getBBox();
	score.attr({
		x: Math.round(midx - (sbox.width/2)),
		y: Math.round(midy + (game.height * CELL_SIZE / 2))
	});
};
squares.click(function (a,b,c) {
	var h = parseInt(a.target.getAttribute("gameh"));
	var w = parseInt(a.target.getAttribute("gamew"));
	var replay = game.pop(h, w);
	/*var i = 0;
	var semaphore = 0 ;
	for (; i < replay.length; i+=3) {
		//pop em
		redraw(replay[i]);
		//animate falling
		//end: set dest to i + 2, set from to i + 2
		if (replay[i + 1]) {
			h = 0;
			for (; h < game.height; h++) {
				w = 0;
				for (; w < game.width; w++) {
					if (replay[i + 1][w][h]) {
						var callback = function (squares, h, w) {
							return function () {
								squares[4 * h + w].animate({transform: "t0,0"}, 0, mina.linear);
								semaphore--;
								console.log(h,w,"semaphore minus 1 to: " + semaphore);
							}
						}
						var dy = replay[i][w][h] * CELL_SIZE;
						semaphore++;
						console.log(h,w,"semaphore plus 1 to: " + semaphore);
						squares[4 * h + w].animate({transform: "t0," + dy}, 1000, mina.easeout, callback(squares, h, w));
					}
				}
			}
			//while (semaphore != 0) {}
			redraw(replay[i + 2]);
		}	
	}*/

	redraw();
});
/*squares.click(function (a,b,c) {
	console.log(a.target);
	var h = parseInt(a.target.getAttribute("gameh"));
	var w = parseInt(a.target.getAttribute("gamew"));
	var replay = game.pop(h, w);
	var i = 0;
	var semaphore = 0 ;
	for (; i < replay.length; i+=2) {
		var type = i % 3;
		if (type == 0 || type == 2) {
			h = 0;
			for (; h < game.height; h++) {
				w = 0;
				for (; w < game.width; w++) {
					if (replay[i][w][h]) {
						var callback = function (squares, h, w) {
							return function () {
								console.log(squares[4 * h + w]);
								squares[4 * h + w].animate({transform: "t0,0"}, 0, mina.linear);
								semaphore--;
								console.log("semaphore minus 1 to: " + semaphore);
							}
						}
						var dy = replay[i][w][h] * CELL_SIZE;
						semaphore++;
						console.log("semaphore plus 1 to: " + semaphore);
						squares[4 * h + w].animate({transform: "t0," + dy}, 1000, mina.easeout, callback(squares, h, w));
					}
				}
			}
		}
		break;
		//while (semaphore != 0){}
	}

	//redraw();
});
*/
//squares.animate({ transform: 't100,100' }, 500, mina.easein);

