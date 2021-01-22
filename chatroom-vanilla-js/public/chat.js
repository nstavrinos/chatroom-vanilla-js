const chatForm = document.getElementById('msger-inputarea');
const chatMessages = document.querySelector('.msger-chat');

const socket = io("localhost:3000");

//username info
//sessionStorage.getItem("username", username);
//const username="User";
// Message from server

var username = prompt("Please enter your nickname", "User");
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg= e.target.elements.msgerinput.value;
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', {username:username,message:msg});

  // Clear input
  e.target.elements.msgerinput.value = '';
  e.target.elements.msgerinput.focus();
});

// Output message to DOM
function outputMessage(message) {

  if(message.length){
      for(var i=0  ; i<message.length; i++){
            const div = document.createElement('div');
            div.classList.add('msg-left-msg');
            const div_img = document.createElement('div');
            div_img.classList.add('msg-img');
            div.appendChild(div_img);
            const div1 = document.createElement('div');
            div1.classList.add('msg-bubble');
            const div2 = document.createElement('div');
            div2.classList.add('msg-info'); 
            const div3 = document.createElement('div');
            div3.classList.add('msg-info-name'); 
            div3.innerText=message[i].username;
            div2.appendChild(div3);
            const div4 = document.createElement('div');
            div4.classList.add('msg-info-time'); 
            div4.innerText=message[i].time;
            div2.appendChild(div4);
            div1.appendChild(div2);
            const div5= document.createElement('div');
            div5.classList.add('msg-text'); 
            div5.innerText=message[i].message;
            div1.appendChild(div5);
            div.appendChild(div1);
            chatMessages.appendChild(div);
        }
    }
}