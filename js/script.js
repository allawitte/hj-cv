'use strict';
const photoBlock = document.querySelector('.photo');
const photoP = document.querySelector('.photo-msg');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");

photoBlock.addEventListener('click', choosePhoto);
photoBlock.addEventListener('drop', dropImg);
photoBlock.addEventListener('dragover', cancel);
photoBlock.addEventListener('dragenter', cancel);
canvas.addEventListener('mousemove', changeCursor);
canvas.addEventListener('mousedown', moveRect);
canvas.addEventListener('mouseup', stopRect);
canvas.width = 400;
canvas.height = 300;

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.deltaX = 0;
        this.deltaY = 0;
        this.inside = false;
        this.toMove = false;
        this.corners = {};
    }

    makeRect() {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    setStart(x, y) {
        this.x = x - this.deltaX;
        this.y = y - this.deltaY;
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
        ctx.clearRect(0, 0, 400, 300);
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
            }
        };

        let action = this.isCorner(x, y);

        if (Object.keys(directions).includes(action)) {
            directions[action](x, y);
        }

        function size(x, x1, y, y1){
          return  (x - x1 + y - y1)/2;
        }
    }
}
const rect = new Rectangle(50, 50, 100, 100);
rect.makeRect();

function stopRect() {
    rect.toMove = false;
    canvas.style.cursor = 'default';
}

function moveRect(e) {
    rect.toMove = true;
}

function changeCursor(e) {
    let cursor = {x: e.offsetX, y: e.offsetY};
    let corner = rect.isCorner(cursor.x, cursor.y);
    if (corner) {
        canvas.style.cursor = rect.cursorStyle(corner);
        if (rect.toMove) {
            rect.resize(cursor.x, cursor.y);
            return;
        }
    }
    //console.log('inside', isCursorInside(rect, cursor));
    if (isCursorInside(rect, cursor)) {
        if (!rect.inside) {
            rect.inside = true;
            canvas.style.cursor = 'move';
        }
        else {
            if (rect.toMove) {
                ctx.clearRect(0, 0, 400, 300);
                rect.setStart(cursor.x, cursor.y);
                rect.makeRect();
            }
        }
    }
    else {
        console.log('default');
        canvas.style.cursor = 'default';
        if (rect.inside) {
            rect.inside = false;
        }
    }
}

function isCursorInside(rect, cursor) {
    if (cursor.x > rect.x && cursor.x < rect.x + rect.width) {
        if (cursor.y > rect.y && cursor.y < rect.y + rect.height) {
            return true;
        }
    }
    return false;
}


function dropImg(e) {
    alert('prevented');
    e.preventDefault();
    e.stopPropagation();
    let img = event.dataTransfer.files[0];

    readImage(img)
        .then(res => renderImg(res))
        .then(img => displayImg(img));
}

function displayImg(img) {
    photoP.classList.add('hidden');
    removeImgFromBlock(photoBlock);
    photoBlock.appendChild(img);
}

function cancel(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}

function choosePhoto(e) {
    const photoFile = document.querySelector('.photo input[type=file]');
    let click = new MouseEvent('click');
    photoFile.addEventListener('change', showImage);
    photoFile.dispatchEvent(click);
}

const showImage = function (e) {
    if (e.target.files && e.target.files.length) {
        readImage(e.target.files[0])
            .then(res => renderImg(res))
            .then(img => displayImg(img));
    }
    else {
        console.log('error to load image');
    }
};

function readImage(img) {
    return new Promise(function (resolve, reject) {
        if (img) {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject('error');
            };
            reader.readAsDataURL(img);
        }
    })
}

function renderImg(blob) {
    return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () {
            resolve(img);
        };
        img.src = blob;
    })
}

function removeImgFromBlock(block) {
    let img = block.querySelector('img');
    try {
        block.removeChild(img);
    }
    catch (e) {
        //console.log(e);
    }

}
/**
 * Created by HP on 12/8/2017.
 */
