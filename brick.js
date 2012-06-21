var brickFactory = function () {
    var _columns;
    var _columnCount;
    var _rowCount;
    var _lowerBounds;
    var _isUncontrollable = false;

    var init = function (shape, isUncontrollable) {
        _isUncontrollable = isUncontrollable;
        _columns = shape;
        _columnCount = shape.length;
        _rowCount = shape[0].length;
        initLowerBounds();
    };

    var initLowerBounds = function () {
        _lowerBounds = new Array(_columnCount);
        for (var columnIndex = 0; columnIndex < _columnCount; columnIndex++) {
            _lowerBounds[columnIndex] = getHighestNonNullIndexFrom(_columns[columnIndex]);
        }
    };
    var getHighestNonNullIndexFrom = function (column) {
        for (var rowIndex = _rowCount; rowIndex >= 0; rowIndex--) {
            if (column[rowIndex] !== undefined) return rowIndex;
        }
    };

    var getLowerBounds = function () {
        return _lowerBounds;
    };

    var transpose = function () {
        var matrix = _columns;
        var columnCount = matrix.length;
        var rowCount = matrix[0].length;
        var result = [];

        for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            result[rowCount-rowIndex-1] = [];
            for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                result[rowCount-rowIndex-1][columnIndex] = matrix[columnIndex][rowIndex];
            }
        }

        return result;
    };

    return {
        init:init,
        getLowerBounds:getLowerBounds,
        getColumns:function () {
            return _columns;
        },
        transpose:transpose,
        isUncontrollable: function() { return _isUncontrollable;}
    };
};