'use strict';
const connection = new WebSocket('ws://localhost:2222');
const nameInput = document.querySelector('#name');
const nameSend = document.querySelector('#nameSend');

connection.addEventListener('message', msgHandler);

nameSend.addEventListener('click', sendName);

function sendName(e){
    e.preventDefault();
    let message = {
        from: 'client',
        type: 'name',
        text: nameInput.value
    };
    connection.send(JSON.stringify(message));
}

function msgHandler(msg){
    console.log('message', msg);
}
connection.onopen = function() {
    console.log('Connection open!');
}
/**
 * Created by HP on 1/18/2018.
 */
