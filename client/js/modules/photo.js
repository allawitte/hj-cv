'use strict';

class Photo {
    constructor(photoBlock, photoP, videoWidth, videoHeight){
        this.photoBlock = photoBlock;
        this.photoP = photoP;
        this.canvasImg = document.querySelector('#image-cnv');
        this.ctxImg = this.canvasImg.getContext('2d');
        this.canvasImg.width = videoWidth || 400;
        this.canvasImg.height = videoHeight || 300;
    }

    displayImg(img) {
        this.photoP.classList.add('hidden');
        this.removeImgFromBlock(this.photoBlock);
        this.photoBlock.appendChild(img);
        return img;
    }
    removeImgFromBlock(block){
        let img = block.querySelector('img');
        try {
            block.removeChild(img);
        }
        catch (e) {
        }
    }
    renderImg(blob) {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.src = blob;
        })
    }

    readImage(img) {
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

    renderImgOnCanvas(img, canvas, rect) {
        console.log('rect', rect);
        canvas.drawImage(img, 0, 0,);
        let btn = document.querySelector('.photo-container .btn');
        btn.addEventListener('click', this.cutPhoto(img, rect));
    }

    replaceImg(blob){
        let img = new Image();
        img.src = blob;
        while ( this.photoBlock.firstChild) {
            this.photoBlock.removeChild( this.photoBlock.firstChild);
        }
        this.photoBlock.appendChild(img) ;
    }

    cutPhoto(img, rect) {
        return  (e) => {
            console.log('rect', rect);
            this.canvasImg.width = 150;
            this.canvasImg.height = 150;
            this.ctxImg.clearRect(0, 0, rect.canvas.width, rect.canvas.height);
            this.ctxImg.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, 150, 150);
            let blobImg = this.canvasImg.toDataURL();
            this.replaceImg(blobImg);
            let btn = document.querySelector('.photo-container .btn');
            let container = document.querySelector('.photo-container');
            container.removeChild(btn);
            switchPhotoControls(1);

            let trash = document.querySelector('.fa-trash');
            trash.addEventListener('click', trashPicture);
        }
    }  

}
/**
 * Created by HP on 1/6/2018.
 */
