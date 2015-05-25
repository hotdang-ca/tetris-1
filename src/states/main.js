/**
 * Created by Gytis on 2015-04-20.
 */
/// <reference path="../../lib/kiwi.d.ts" />
/// <reference path="../gameObjects/shape.ts" />
/// <reference path="../gameObjects/board.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        _super.apply(this, arguments);
        this.pressed = false;
        this.rotating = false;
        this.direction = 0;
        this.blocks = [
            'blue',
            'cyan',
            'green',
            'orange',
            'purple',
            'red',
            'yellow'
        ];
        this.shapes = [
            'I',
            'J',
            'L',
            'O',
            'S',
            'T',
            'Z'
        ];
    }
    MainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.addImage('board', 'assets/img/board.png');
        this.addImage('borders', 'assets/img/borders.png');
        for (var index in this.blocks) {
            var color = this.blocks[index];
            this.addImage('block-' + color, 'assets/img/block-' + color + '.png');
        }
    };
    MainState.prototype.moveLeft = function () {
        if (this.leftKey.isDown && this.board.canMove(this.currentShape.getBlocks(), -1) && !this.pressed) {
            this.board.setBlocks(this.currentShape.getBlocks(), 0 /* Empty */);
            this.currentShape.move(-1);
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            this.pressed = true;
            this.moveTimer.start();
        }
    };
    MainState.prototype.moveRight = function () {
        if (this.rightKey.isDown && this.board.canMove(this.currentShape.getBlocks(), 1) && !this.pressed) {
            this.board.setBlocks(this.currentShape.getBlocks(), 0 /* Empty */);
            this.currentShape.move(1);
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            this.pressed = true;
            this.moveTimer.start();
        }
    };
    MainState.prototype.tryToRotate = function (direction) {
        var positions = this.currentShape.getNextRotation(direction);
        var rotated = false;
        while (positions.length > 0) {
            if (this.board.blocksEmpty(positions)) {
                rotated = true;
                this.board.setBlocks(this.currentShape.getBlocks(), 0 /* Empty */);
                this.currentShape.rotate(direction);
                this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
                break;
            }
            if (rotated) {
                break;
            }
            positions = this.currentShape.getNextRotation(direction);
        }
        return rotated;
    };
    MainState.prototype.rotate = function () {
        if ((this.xKey.isDown || this.zKey.isDown || this.upKey.isDown) && !this.rotating) {
            if (this.xKey.isDown) {
                this.direction = 1;
            }
            else if (this.zKey.isDown) {
                this.direction = -1;
            }
            else {
                this.direction = 2;
            }
            this.rotating = true;
            this.board.setBlocks(this.currentShape.getBlocks(), 2 /* CurrentShape */);
            if (this.upKey.isDown) {
                if (!this.tryToRotate(1)) {
                    this.tryToRotate(-1);
                }
            }
            else {
                this.tryToRotate(this.direction);
            }
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
        }
        if ((this.direction == -1 && this.zKey.isUp) || (this.direction == 1 && this.xKey.isUp) || (this.direction == 2 && this.upKey.isUp)) {
            this.rotating = false;
        }
    };
    MainState.prototype.changeDelay = function () {
        if (this.downKey.isDown) {
            this.dropTimer.delay = 0.001;
        }
        else {
            this.dropTimer.delay = 0.5;
        }
    };
    MainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.moveLeft();
        this.moveRight();
        this.rotate();
        this.changeDelay();
        this.dropTimer.start();
    };
    MainState.prototype.resetControls = function () {
        this.pressed = false;
    };
    //drop down event
    MainState.prototype.dropDown = function () {
        if (this.board.canFall(this.currentShape.getBlocks())) {
            this.board.setBlocks(this.currentShape.getBlocks(), 0 /* Empty */);
            this.currentShape.fall();
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            return;
        }
        ////try to clear the row
        this.board.clearRows(this.currentShape.getBlocks());
        this.createEmptyShape();
        if (this.board.canCreateShape(this.currentShape.getBlocks())) {
            this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
            this.addChild(this.currentShape.getGameObject());
            return;
        }
        //console.log('gg');
        //if unable to create new shape gg
    };
    MainState.prototype.randomShape = function () {
        return 'Shape' + this.shapes[Math.floor(Math.random() * 7)];
    };
    MainState.prototype.createEmptyShape = function (shapeName, x, y) {
        if (shapeName === void 0) { shapeName = ''; }
        if (x === void 0) { x = 4; }
        if (y === void 0) { y = -1; }
        if (shapeName.length == 0) {
            shapeName = this.randomShape();
        }
        this.currentShape = new Shapes[shapeName](this, x, y);
    };
    MainState.prototype.createNewShape = function (shapeName, x, y) {
        if (shapeName === void 0) { shapeName = ''; }
        if (x === void 0) { x = 4; }
        if (y === void 0) { y = -1; }
        if (shapeName.length == 0) {
            shapeName = this.randomShape();
        }
        this.currentShape = new Shapes[shapeName](this, x, y);
        this.board.setBlocks(this.currentShape.getBlocks(), 1 /* Taken */);
        this.addChild(this.currentShape.getGameObject());
    };
    MainState.prototype.create = function () {
        _super.prototype.create.call(this);
        //controls
        this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
        this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
        this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
        this.zKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.Z);
        this.xKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.X);
        //move timer for limiting move amount
        this.moveTimer = this.game.time.clock.createTimer('move', 0.1, 0);
        this.moveTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resetControls, this);
        //board
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.borders, 0, 80));
        this.addChild(new Kiwi.GameObjects.StaticImage(this, this.textures.board, 5, 85));
        this.board = new Board();
        //drop the first shape
        this.createNewShape();
        this.dropTimer = this.game.time.clock.createTimer('fall', 0.5, 0);
        this.dropTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.dropDown, this);
        this.dropTimer.start();
    };
    return MainState;
})(Kiwi.State);
//# sourceMappingURL=main.js.map