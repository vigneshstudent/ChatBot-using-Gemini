const chatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const API_KEY = "";
const inputInitHeight = chatInput.scrollHeight;

const generateResponse = (incomingChatLi) => {
    const API_URL =  `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
      };
      fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch(error => {
        messageElement.classList.add("error");
        messageElement.textContent = "Something went wrong Try again later......";
    }).finally(() => {
        chatbox.scrollTo(0,chatbox.scrollHeight);
    });
    
}
const createChatLi = (message,className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span><i class='bx bx-bot'></i></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);
    chatInput.style.height = `${inputInitHeight}px`;
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);

}
chatInput.addEventListener("input" ,() => {
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})
sendChatbtn.addEventListener("click", handleChat);
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent default behavior (e.g., new line)
        handleChat();
    }
});
let isShow = false;
chatbotToggler.addEventListener("click", () => {
    if(isShow){
        document.querySelector('.chatbot').style.width = '100%';
        document.querySelector('.chatbot').style.height = '100%';
    }
    else{
        document.querySelector('.chatbot').style.width = '0%';
        document.querySelector('.chatbot').style.height = '0%';   
    }
    isShow = !isShow;
});