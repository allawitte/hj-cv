'use strict';
class Rectangle {
    constructor(x, y, width, height, canvas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.deltaX = 0;
        this.deltaY = 0;
        this.inside = false;
        this.toMove = false;
        this.corners = {};
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    makeRect() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    setStart(x, y) {
        this.x = x - this.deltaX;
        this.y = y - this.deltaY;
    }

    setDelta(x, y) {
        this.deltaX = x - this.x;
        this.deltaY = y - this.y;
    }

    cursorStyle(style) {
        const cursor = {
            leftTop: 'nw-resize',
            rightTop: 'sw-resize',
            leftBottom: 'ne-resize',
            rightBottom: 'se-resize'
        }
        return cursor[style];
    }

    isCorner(x, y) {
        const delta = 10;
        this.corners = {
            leftTop: {x: this.x, y: this.y},
            rightTop: {x: this.x + this.width, y: this.y},
            leftBottom: {x: this.x, y: this.y + this.height},
            rightBottom: {x: this.x + this.width, y: this.y + this.height}
        };

        for (let corner in this.corners) {
            let point = this.corners[corner];
            if (getDistance(point) < delta) {
                return corner;
            }
        }
        return false;
        function getDistance(point) {
            return Math.sqrt(Math.pow((x - point.x), 2) + Math.pow((y - point.y), 2));
        }
    }

    reDraw() {
        console.log(this.canvas.width);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.makeRect();
    }

    resize(x, y) {
        const directions = {
            'leftTop': (x, y) => {
                let rightX = this.x + this.width;
                let rightY = this.y + this.height;
                this.x = x;
                this.y = y;
                this.width = size(rightX, this.x, rightY, this.y);
                this.height = size(rightX, this.x, rightY, this.y);
                this.reDraw();
            },
            'rightTop': (x, y) => {
                let rightX = x;
                let rightY = this.y + this.width;
                this.y = y;
                this.width = size(rightX, this.x, rightY, this.y);
                this.height = size(rightX, this.x, rightY, this.y);
                this.reDraw();
            },
            'leftBottom': (x, y) => {
                let rightX = this.x + this.width;
                let rightY = this.y + this.height;
                this.x = x;
                this.width = size(rightX, this.x, rightY, this.y);
                this.height = size(rightX, this.x, rightY, this.y);
                this.reDraw();
            },
            'rightBottom': (x, y)=> {
                let rightX = x;
                let rightY = y;
                this.width = size(rightX, this.x, rightY, this.y);
                this.height = size(rightX, this.x, rightY, this.y);
                this.reDraw();
            }
        };

        let action = this.isCorner(x, y);

        if (Object.keys(directions).includes(action)) {
            directions[action](x, y);
        }

        function size(x, x1, y, y1) {
            return (x - x1 + y - y1) / 2;
        }
    }

    isCursorInside(cursor){
        if (cursor.x > this.x && cursor.x < this.x + this.width) {
            if (cursor.y > this.y && cursor.y < this.y + this.height) {
                return true;
            }
        }
        return false;
    }
}
/**
 * Created by HP on 1/5/2018.
 */
