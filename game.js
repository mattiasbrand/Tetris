var _canvasWidth;
var _canvasHeight;
var _ctx;
var _intervalId = 0;
var _backColor = "#000000";
var _colorRed = "#FF0000";
var _colorBlue = "#0000FF";
var _colorGreen = "#00FF00";
var _colorYellow = "#FFFF00";
var _colorFoo = "#AAAA00";
var _colorFoo2 = "#00AAAA";
var _colorGrey = "#CCCCCC";
var _scoreColor = "#FFFFFF";
var _app = $(document);
var _score = 0;

// Tile
var _tileWidth, _tileHeight;

var _brick1 = [
    [_colorGreen, _colorGreen],
    [_colorGreen, _colorGreen]
];
var _brick2 = [
    [_colorBlue],
    [_colorBlue],
    [_colorBlue],
    [_colorBlue]
];
var _brick3 = [
    [_colorYellow, _colorYellow],
    [_colorYellow, undefined],
    [_colorYellow, undefined]
];
var _brick4 = [
    [_colorFoo, _colorFoo],
    [undefined, _colorFoo],
    [undefined, _colorFoo]
];
var _brick5 = [
    [_colorFoo2, undefined],
    [_colorFoo2, _colorFoo2],
    [undefined, _colorFoo2]
];

var _availableBricks = [ _brick1, _brick2, _brick3, _brick4, _brick5];

function onKeyDown(evt) {
    if (evt.keyCode === 39)
        _rightDown = true;
    else if (evt.keyCode === 37)
        _leftDown = true;
    else if (evt.keyCode === 32)
        _app.trigger("space-clicked");
}
function onKeyUp(evt) {
    if (evt.keyCode == 39)
        _app.trigger("right-clicked");
    else if (evt.keyCode == 37)
        _app.trigger("left-clicked");
    else if (evt.keyCode == 40)
        draw();
}

function drawRect(x, y, w, h, color) {
    _ctx.fillStyle = color;
    _ctx.beginPath();
    _ctx.rect(x, y, w, h);
    _ctx.closePath();
    _ctx.fill();
}
function clear() {
    _ctx.clearRect(0, 0, _canvasWidth, _canvasHeight);
}
function drawScore() {
    _ctx.beginPath();
    _ctx.fillStyle = _scoreColor;
    _ctx.font = 'bold 20px sans-serif';
    _ctx.fillText('Score: ' + _score, 10, 20);
    _ctx.closePath();
    _ctx.fill();
}

function drawGameOver() {
    _ctx.beginPath();
    _ctx.fillStyle = _colorRed;
    _ctx.font = 'bold 40px sans-serif';
    _ctx.fillText('Game over', 100, 200);
    _ctx.closePath();
    _ctx.fill();
}

function drawBoard() {
    for (var rowIndex = 0; rowIndex < _board.rowCount; rowIndex++) {
        for (var columnIndex = 0; columnIndex < _board.columnCount; columnIndex++) {
            var color = _board.getTile(columnIndex, rowIndex);
            if (color !== undefined) drawRect(columnIndex * _tileWidth, rowIndex * _tileHeight, _tileWidth - 1, _tileHeight - 1, color);
        }
    }
}
function drawBrick() {
    var brick = _board.getBrick();
    if(brick === undefined) return;

    var columns = brick.getColumns();
    var rowCount = columns[0].length;
    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            var color = columns[columnIndex][rowIndex];
            if (color !== undefined) {
                var x = columnIndex + _board.getBrickX();
                var y = rowIndex + _board.getBrickY();
                drawRect(x * _tileWidth, y * _tileHeight, _tileWidth - 1, _tileHeight - 1, color);
            }
        }
    }
}

function draw() {
    _ctx.fillStyle = _backColor;
    clear();
    _board.tick();
    drawBoard();
    drawBrick();
    drawScore();

    if(_board.isGameOver()) {
        clearInterval(_intervalId);
        drawGameOver();
    }
}

function insertRandomBrick() {
    var brickNo = Math.floor(Math.random() * _availableBricks.length);
    var brickTemplate = _availableBricks[brickNo];
    var brick = brickTemplate.slice(0, brickTemplate.length);
    _board.insertBrick(brick, false);
}

function insertUncontrollablePiece() {
    var brickNo = Math.floor(Math.random() * _availableBricks.length);
    var brickTemplate = _availableBricks[brickNo];
    var brick = [];
    for(var rowIndex = 0; rowIndex < brickTemplate.length; rowIndex++) {
        brick.push(brickTemplate[rowIndex].slice(0));
    }
    var columnCount = brick.length;
    var rowCount = brick[0].length;

    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            if(brick[columnIndex][rowIndex] !== undefined)brick[columnIndex][rowIndex] = _colorGrey;
        }
    }
    _board.insertBrick(brick, true);
}

function init() {
    _ctx = $('#canvas')[0].getContext("2d");
    _canvasWidth = $("#canvas").width();
    _canvasHeight = $("#canvas").height();

    _score = 0;
    _app.on("row-destroyed", function () { _score += 100; });
    _app.on("brick-stuck", function () { _score += 5; });

    _app.keydown(onKeyDown);
    _app.keyup(onKeyUp);
    _app.on("brick-stuck", insertRandomBrick);

    _board.init(_app);
    _tileWidth = _canvasWidth / _board.columnCount;
    _tileHeight = _canvasHeight / _board.rowCount;
    insertRandomBrick();
    //insertUncontrollablePiece();
    _intervalId = setInterval(draw, 300);
}

_app.ready(function () {
    init();
});