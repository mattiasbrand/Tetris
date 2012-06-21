var _board = function () {
    var _rowCount = 20;
    var _columnCount = 15;
    var _rows = new Array(_rowCount);
    var _events;
    var _brick, _brickX, _brickY;
    var _isGameOver = false;

    var init = function (events) {
        _events = events;
        _events.on("right-clicked", moveBrickRight);
        _events.on("left-clicked", moveBrickLeft);
        _events.on("space-clicked", flipTile);
        _events.on("down-clicked", tick);
        clearBoard();
    };

    var moveBrickRight = function () {
        if(_brick === undefined || _brick.isUncontrollable()) return;
        if ((_brickX + _brick.getColumns().length - 1) === _columnCount - 1) return;
        if (isIntersectingBoard(_brick.getColumns(), _brickX + 1, _brickY)) return;
        _brickX += 1;
    };
    var moveBrickLeft = function () {
        if(_brick === undefined || _brick.isUncontrollable()) return;
        if (_brickX === 0) return;
        if (isIntersectingBoard(_brick.getColumns(), _brickX - 1, _brickY)) return;
        _brickX -= 1;
    };

    var flipTile = function () {
        if(_brick === undefined || _brick.isUncontrollable()) return;
        var transposedBrick = _brick.transpose();
        if(isIntersectingBoard(transposedBrick, _brickX, _brickY) === false) {
            _brick.init(transposedBrick, _brick.isUncontrollable());
        }
    };

    var clearBoard = function () {
        for (var rowIndex = 0; rowIndex < _rowCount; rowIndex++) {
            _rows[rowIndex] = new Array(_columnCount);
        }
    };
    var isRowComplete = function (row) {
        for (var columnIndex = 0; columnIndex < _columnCount; columnIndex++) {
            if (row[columnIndex] === undefined) return false;
        }

        return true;
    };
    var insertBrick = function (brickMatrix, isUncontrollable) {
        _brick = brickFactory();
        _brick.init(brickMatrix, isUncontrollable);
        _brickX = 3;
        _brickY = -brickMatrix[0].length;
        if (isBrickStuck()) _isGameOver = true;
    };

    var moveBrick = function () {
        if (_brick === undefined) return;
        if (isBrickStuck()) {
            makeBrickPartOfBoard();
            _events.trigger("brick-stuck");
        }
        _brickY += 1;
    };

    var isBrickStuck = function () {
        var lowerBounds = _brick.getLowerBounds();
        for (var columnIndex = 0; columnIndex < lowerBounds.length; columnIndex++) {
            if (lowerBounds[columnIndex] + _brickY === _rowCount - 1) return true;
            if (hasTileInPosition(columnIndex + _brickX, lowerBounds[columnIndex] + _brickY + 1)) return true;
        }
        return false;
    };

    var makeBrickPartOfBoard = function () {
        var columns = _brick.getColumns();
        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            for (var rowIndex = 0; rowIndex < columns[0].length; rowIndex++) {
                if (columns[columnIndex][rowIndex] !== undefined) {
                    setTile(columnIndex + _brickX, rowIndex + _brickY, columns[columnIndex][rowIndex]);
                }
            }
        }

        _brick = undefined;
    };

    var setTile = function (x, y, color) {
        if(isIllegalPosition(x,y)) return;
        _rows[y][x] = color;
    };

    var hasTileInPosition = function (x, y) {
        if (x < 0 || y < 0) return false;
        return _rows[y][x] !== undefined;
    };

    var destroyRow = function (rowIndex) {
        _rows.splice(rowIndex, 1); // Remove row from board
        _rows.unshift(new Array(_columnCount)); // Insert new empty row
        _events.trigger("row-destroyed");
    };

    var tick = function () {
        moveBrick();
        for (var rowIndex = 0; rowIndex < _rowCount; rowIndex++) {
            var row = _rows[rowIndex];
            if (isRowComplete(row)) {
                destroyRow(rowIndex);
            }
        }
    };

    var getTile = function (x, y) {
        return _rows[y][x];
    };

    var isGameOver = function () {
        return _isGameOver;
    };

    var isIllegalPosition = function (x, y) {
        if (getTile(x, y) !== undefined) return true;
        if (x < 0 || x >= _columnCount) return true;
        if (y >= _rowCount) return true;
        return false;
    };
    var isIntersectingBoard = function (brickShape, x, y) {
        var rowCount = brickShape[0].length;
        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            for (var columnIndex = 0; columnIndex < brickShape.length; columnIndex++) {
                if (isIllegalPosition(columnIndex + x, rowIndex + y)) return true;
            }
        }
        return false;
    };
    return {
        init:init,
        insertBrick:insertBrick,
        rowCount:_rowCount,
        columnCount:_columnCount,
        getTile:getTile,
        tick:tick,
        getBrick:function () {
            return _brick;
        },
        getBrickX:function () {
            return _brickX;
        },
        getBrickY:function () {
            return _brickY;
        },
        isGameOver:isGameOver
    }
}();