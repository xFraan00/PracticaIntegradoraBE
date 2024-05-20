const socket = io();
const btnSend = document.getElementById('btnSend');
const p = document.createElement('p');
const messageContainer = document.getElementById('messageContainer');
const messageInput = document.getElementById('message');
const chatInterface = document.getElementById('chatInterface');
const btnUserConfirm = document.getElementById('btnUserConfirm');
const btnExit = document.getElementById('btnExit');
const userBox = document.getElementById('userBox');
const userInput = document.getElementById('user');
const userGreeting = document.getElementById('userGreeting');
const messagesFromDb = [];

btnUserConfirm.addEventListener('click', () => {
    if (userInput.value.trim() === '') 
        userInput.focus();
    else {
        messagesFromDb.forEach(element => {
            const messageFromDb = document.createElement('p');
            messageFromDb.innerHTML = `<strong>${element.user}</strong>: ${element.message}`;
            messageContainer.appendChild(messageFromDb);
        });
        userGreeting.innerHTML = `¡Bienvenido, ${userInput.value}!`;
        chatInterface.style.display = 'block';
        userBox.style.display = 'none';
    }
});

btnExit.addEventListener('click', () => { 
    location.reload(); 
});

btnSend.addEventListener('click', () => {
    if (messageInput.value.trim() === '') {
        messageInput.focus();
    } else {
        p.innerHTML = `<strong>${userGreeting.textContent}</strong>: ${messageInput.value}</br>`;
        messageContainer.appendChild(p);
        socket.emit('message', { message: messageInput.value, userName: userGreeting.textContent });
        messageInput.value = '';
    }
});

socket.on('messagesDB', (data) => {
    data.forEach(element => {
        messagesFromDb.push(element);
    });
});
