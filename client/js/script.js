'use strict';
const photoBlock = document.querySelector('.photo');
const photoP = document.querySelector('.photo-msg');
const buttonsContainer = document.querySelector('.radio');
let canvas;
let ctx;
let canvasImg;
let rect;
const pcSelected = document.querySelector('.radio');
const video = document.createElement('video');
let takePhotoBtn;


function videoSuccess(stream) {
    photoBlock.appendChild(video);
    takePhotoBtn = document.createElement('i');
    takePhotoBtn.classList.add('fa');
    takePhotoBtn.className = 'fa fa-camera m-1 text-muted mx-auto';
    video.src = URL.createObjectURL(stream);
    video.setAttribute('autoplay', true);
    video.setAttribute('playsinline', true);
    photoBlock.appendChild(takePhotoBtn);
    takePhotoBtn.addEventListener('click', takePhoto);
}

function takePhoto() {

    createCanvas();
    // const audio = document.createElement('audio');
    // audio.src = './audio/click.mp3';
    // audio.autoplay = true;
    const photo = new Photo(photoBlock, photoP, video.videoWidth, video.videoHeight);
    makeSavePhotoBtn();
    photo.renderImgOnCanvas(video, photo.ctxImg, rect);

}

createDragClickPhoto();


pcSelected.addEventListener('change', getPhotoFromPc);

//import { Rectangle } from './modules/rectangle.js';


function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 300;
    canvas.addEventListener('mousemove', changeCursor);
    canvas.addEventListener('mousedown', moveRect);
    canvas.addEventListener('mouseup', stopRect);

    canvasImg = document.createElement('canvas');
    canvasImg.classList.add('bg-light');
    canvasImg.id = 'image-cnv';
    clearPhotoBlock();
    photoBlock.appendChild(canvasImg);
    photoBlock.appendChild(canvas);
    rect = new Rectangle(50, 50, 100, 100, canvas);
    rect.makeRect();
}

function createDragClickPhoto() {
    let p = document.createElement('p');
    p.classList.add('photo-msg');
    p.textContent = 'Кликните здесь для выбора фото или перетащите его сюда';
    photoBlock.appendChild(p);
    photoBlock.addEventListener('click', choosePhoto);
    photoBlock.addEventListener('drop', dropImg);
    photoBlock.addEventListener('dragover', cancel);
    photoBlock.addEventListener('dragenter', cancel);
    let input = document.createElement('input');
    input.type = 'file';
    input.classList.add('tiny');
    photoBlock.appendChild(input);
    let radioPc = document.querySelector('.radio #pc');
    radioPc.checked = true;
}

function detachEvents() {
    photoBlock.removeEventListener('click', choosePhoto);
    photoBlock.removeEventListener('drop', dropImg);
    photoBlock.removeEventListener('dragover', cancel);
    photoBlock.removeEventListener('dragenter', cancel);
}


function getPhotoFromPc(e) {
    let btn = e.target;
    clearPhotoBlock();
    if (btn.id == 'pc') {
        createDragClickPhoto();
    }
    else if (btn.id == 'moment') {
        detachEvents();
        navigator.mediaDevices
            .getUserMedia({video: true, audio: false})
            .then(videoSuccess)
        // .catch(err => {
        //     const errorMsg = document.querySelector('#error-message');
        //     errorMsg.textContent = 'К сожалению, работа с медиа-ресурсами не поддерживается ващшм браузером';
        //     errorMsg.classList.add('visible');
        // });

    }
}


//import { Photo } from './modules/photo.js';

function clearPhotoBlock() {
    while (photoBlock.firstChild) {
        photoBlock.removeChild(photoBlock.firstChild);
    }

}

function stopRect() {
    rect.toMove = false;
    canvas.style.cursor = 'default';
}

function moveRect(e) {
    if (rect.inside || rect.isCorner(e.offsetX, e.offsetY)) {
        rect.toMove = true;
        rect.setDelta(e.offsetX, e.offsetY);
    }
}

function changeCursor(e) {
    let cursor = {x: e.offsetX, y: e.offsetY};
    let corner = rect.isCorner(cursor.x, cursor.y);
    if (corner) {
        canvas.style.cursor = rect.cursorStyle(corner);
        if (rect.toMove) {
            rect.resize(cursor.x, cursor.y);
        }
        return;
    }
    if (rect.isCursorInside(cursor)) {
        canvas.style.cursor = 'move';
        if (!rect.inside) {
            rect.inside = true;
        }
        else {
            if (rect.toMove) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                rect.setStart(cursor.x, cursor.y);
                rect.makeRect();
            }
        }
    }
    else {
        canvas.style.cursor = 'default';
        if (rect.inside) {
            rect.inside = false;
        }
    }
}

function dropImg(e) {
    alert('prevented');
    e.preventDefault();
    e.stopPropagation();
    let img = event.dataTransfer.files[0];
    const photo = new Photo(photoBlock, photoP);

    photo.readImage(img)
        .then(res => photo.renderImg(res))
        .then(img => photo.displayImg(img));
}


function cancel(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}

function choosePhoto(e) {
    console.log('hello');
    const photoFile = document.querySelector('.photo input[type=file]');
    let click = new MouseEvent('click');
    photoFile.addEventListener('change', showImage);
    photoFile.dispatchEvent(click);
}

const showImage = function (e) {
    if (e.target.files && e.target.files.length) {
        createCanvas();
        detachEvents();
        const photo = new Photo(photoBlock, photoP);
        photo.readImage(e.target.files[0])
            .then(res => photo.renderImg(res))
            .then(img => {
                makeSavePhotoBtn();
                console.log('rect', rect)
                photo.renderImgOnCanvas(img, photo.ctxImg, rect);
            })
    }
    else {
        console.log('error to load image');
    }
};

function makeSavePhotoBtn() {
    let savePhotoBtn = document.createElement('button');
    savePhotoBtn.id = 'save-photo';
    savePhotoBtn.textContent = 'сохранить фото';
    savePhotoBtn.className = 'btn btn-outline-primary d-block mx-auto btn-sm';
    let container = document.querySelector('.photo-container');
    container.insertBefore(savePhotoBtn, buttonsContainer);
}

function switchPhotoControls(data){
    if(data){
        let radio = document.querySelector('.radio');
        radio.classList.add('d-none');
        let buttons = document.querySelector('.buttons ');
        buttons.classList.remove('d-none');
    }
    else {
        let radio = document.querySelector('.radio');
        radio.classList.remove('d-none');
        let buttons = document.querySelector('.buttons ');
        buttons.classList.add('d-none'); 
    }
     
}

function trashPicture(){
    clearPhotoBlock();
    createDragClickPhoto();
    switchPhotoControls(0)
}

/**
 * Created by HP on 12/8/2017.
 */
