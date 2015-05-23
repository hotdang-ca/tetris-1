/**
 * Created by Gytis on 2015-05-22.
 */
/// <reference path="shape.ts" />
var Board = (function () {
    function Board() {
        /**
         * 0 empty
         * 1 taken by other
         * 2 taken by current
         * @type {Array}
         */
        this.isTaken = [];
        for (var i = 0; i < 20; i++) {
            this.isTaken[i] = [];
            for (var j = 0; j < 10; j++) {
                this.isTaken[i][j] = 0;
            }
        }
    }
    Board.prototype.setCurrentShapeBlocks = function (blocks, reset) {
        var status = (reset) ? 1 : 2;
        for (var index in blocks) {
            var block = blocks[index];
            this.isTaken[block.y][block.x] = status;
        }
    };
    Board.prototype.canFall = function (blocks) {
        this.setCurrentShapeBlocks(blocks, false);
        for (var index in blocks) {
            var block = blocks[index];
            if (block.y == 19 || this.isTaken[block.y + 1][block.x] == 1) {
                this.setCurrentShapeBlocks(blocks, true);
                return false;
            }
        }
        this.setCurrentShapeBlocks(blocks, true);
        return true;
    };
    Board.prototype.canMove = function (blocks, x) {
        this.setCurrentShapeBlocks(blocks, false);
        for (var index in blocks) {
            var block = blocks[index];
            if (x < 0 && (block.x == 0 || this.isTaken[block.y][block.x - 1] == 1)) {
                this.setCurrentShapeBlocks(blocks, true);
                return false;
            }
            if (x > 0 && (block.x == 9 || this.isTaken[block.y][block.x + 1] == 1)) {
                this.setCurrentShapeBlocks(blocks, true);
                return false;
            }
        }
        this.setCurrentShapeBlocks(blocks, true);
        return true;
    };
    Board.prototype.setBlocks = function (blocks, taken) {
        var status = (taken) ? 1 : 0;
        for (var index in blocks) {
            var block = blocks[index];
            this.isTaken[block.y][block.x] = status;
        }
    };
    return Board;
})();
//# sourceMappingURL=board.js.map