'use strict';
const connection = new WebSocket('ws://localhost:2222');
connection.onopen = function() {
    console.log('Connection open!');
}

connection.addEventListener('message', msgHandler);

function msgHandler(data){
    console.log('data', data);
}
/**
 * Created by HP on 1/23/2018.
 */
