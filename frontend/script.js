// model selection which model is working

let workingmodel = 0;
let workingpage = 0;
let isnew = true;
let currentworkingid = 0;
let currentrelatedsearchindex = 0;
// DOM content loaded event listener
document.addEventListener("DOMContentLoaded", () => {
  modelselection();
  historyselection();
  slider();
  hovereffectonsetting();
  Array.from(document.getElementsByClassName("upload")).forEach((element,index) => {
    element.addEventListener("click", () => {
      if (workingpage === index) {
        sendChatMessage();
      }
      if (isnew) {
        togglemain();
        isnew = false;
      }
    });
  });
  copyTextToClipboard();
  gethistoryfrombackend();
});


function modelselection() {
  let models = document.querySelectorAll("#models>div");
  models[workingmodel].classList.add("workingmodel");
  models.forEach((element, key) => {
    element.addEventListener("click", () => {
      models.forEach(ele => {
        ele.classList.remove("workingmodel");
      })
      element.classList.add("workingmodel");

      workingmodel = key;
      console.log("The model selected is ", key);
    })
  })
}

// slecton of the aside history 
let historyindex = 0;

function historyselection() {
  const history = document.getElementById("history");

  history.addEventListener("click", (e) => {
    e.preventDefault();

    const anchor = e.target.closest("#history > div");
    if (!anchor) return;

    const anchors = Array.from(history.querySelectorAll(":scope > div"));
    historyindex = anchors.indexOf(anchor);

    anchors.forEach((element) => {
      element.classList.remove("historyworking");
    });

    anchor.classList.add("historyworking");

    const id = anchor.dataset.id;
    currentworkingid = id;
    getchatbyid(id);
    isnew = false;
    console.log("the history element's id is ", currentworkingid);
  });
}

// function to get chat by id from backend

async function getchatbyid(id) {
  currentrelatedsearchindex = 0;
  const url = `http://localhost:3000/chat/${id}`;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Chat by ID Response:", result);
    const maintextshown = document.getElementsByClassName("maintextshown")[0];
    maintextshown.innerHTML = "";

   for (let index = 0; index < result.chat.messages.length; index++) {
  const messageObj = result.chat.messages[index];
  const responseObj = result.chat.responses[index];

  const userDiv = writecontentofuser(messageObj.content);
    currentworkingid= result.id;
  writecontentonmainscreen2(
    userDiv,
    responseObj.message.content,
    messageObj.model,
    responseObj.related1,
    responseObj.related2
  );
}

    if (workingpage === 0) {
      togglemain();
    }
    currentworkingid = result.chat.id;
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
  }
}
// function to make slider of the menu bar 

function slider() {
  const aside = document.getElementById("aside");
  const icon = document.getElementById("listicon");
  const main = document.querySelector("main");

  icon.addEventListener("click", (e) => {
    aside.style.display = "block";
    e.stopPropagation();
    aside.classList.remove("close");
    aside.classList.add("open");
    icon.style.display = "none";
  });

  main.addEventListener("click", () => {

    if (aside.classList.contains("open")) {
      aside.classList.remove("open");
      aside.classList.add("close");
      icon.style.display = "block";
    }
  });
}

// function toggling the main element in the html page 

function togglemain() {
  let mainscreen1 = document.getElementById("screen1");
  let mainscreen2 = document.getElementById("screen2");
  let models = document.querySelectorAll("#models>div");
  let element = models[workingmodel];
  let modelselectedscreen2 = document.getElementById("modelselectedscreen2");
  modelselectedscreen2.textContent = element.textContent;

  if (mainscreen1.style.display === "none") {
    workingpage = 0;
    mainscreen1.style.display = "flex";
    mainscreen2.style.display = "none";
  } else {
    workingpage = 1;
    mainscreen1.style.display = "none";
    mainscreen2.style.display = "flex";
  }
}

// styling utilities 
function hovereffectonsetting() {
  let setting = document.getElementById("setting");
  setting.addEventListener("mouseenter", () => {
    document.querySelector("#setting>img").style.transform = "scale(1.1)";
  });

  setting.addEventListener("mouseleave", () => {
    document.querySelector("#setting>img").style.transform = "scale(1.0)";
  });
}

// Updated sendChatMessage function to ensure the correct input value is sent
async function sendChatMessage() {
  const url = "http://localhost:3000/chat";

  // Ensure the correct input field is targeted based on the current working page
  const inputFields = document.querySelectorAll(".input");
  const message = inputFields[workingpage].value.trim();


  
  if (!message) {
    console.error("Message is empty. Please enter a valid message.");
    return;
  }
  let div = writecontentofuser(message);

  console.log("workind id is ", currentworkingid);
  const data = {
    message: message,
    model: document.querySelectorAll("#models>div")[workingmodel].textContent,
    role: "user",
    title: message.slice(0, 20),
    id: currentworkingid,
  };

  console.log(data);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log("Response:", result);
    currentworkingid = result.chatId;
    if (data.id === 0) {
      addhistoryelement(data.title,currentworkingid);
    }
    writecontentonmainscreen2(div, result.response.response, data.model, result.response.related[0], result.response.related[1]);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Writing the content on the main screen 2 ;
function writecontentofuser(message) {
  const div = document.createElement("div");
div.innerHTML = `<h1 class="h1">${message}</h1>`;
  div.classList.add("contentdivscreen2");
  const contentDiv = document.getElementsByClassName("maintextshown")[0];
  contentDiv.append(div);
  return div;
}

function writecontentonmainscreen2(div,responsecontent,model,relatedsearch1,relatedsearch2) {
  const string = ` <div class="flex aiimage">
                        <div class="flex" style="width: max-content; gap:5px;">
                            <img src="images/screen2/ai.svg" alt="ai" height="20px">
                            <span>Generated by ${model}</span>
                        </div>
                        <div>
                            <img src="images/screen2/copy.svg" class="pointer" alt="copy" height="20px" >
                            <img src="images/screen2/arrow-path.svg" class="pointer"  alt="refresh" height="20px">
                        </div>
                    </div>

                    <hr>
                    <div class="responsefromai">${marked.parse(responsecontent)}</div>
                    <div class="flex aiimage" >
                        <div class="flex" style="width: max-content; gap:5px;">
                            <span class="helpfull"
                                >
                                <img src="images/screen2/hand-thumbsup.svg" alt="ai" height="20px"
                                    class="pointer">
                                <span>helpfull</span>
                            </span>
                            <span class="hand-thumb-down"><img
                                    src="images/screen2/hand-thumb-down.svg" alt="" height="20px"
                                    class="pointer"> </span>
                        </div>
                        <div class="helpfull">
                            <img src="images/screen2/share.svg" alt="share" height="20px" class="pointer">
                            <span>share</span>
                        </div>
                    </div>

                    <hr>


                    <div>
                        <div style="font-size: 20px; font-weight: bold;">Related Searches</div>
                        <div class="relatedsearches flex">
                            <div class="relatedsearch"><span>${relatedsearch1} </span><img
                                    src="images/screen2/arrow-right.svg" alt="" width="20px"></div>
                            <div class="relatedsearch"><span>${relatedsearch2}</span><img
                                    src="images/screen2/arrow-right.svg" alt="" width="20px"></div>
                        </div>
                    </div>`
                    div.insertAdjacentHTML("beforeend", string);
                   
relatedsearchfunctionality(document.querySelectorAll(".relatedsearch")[currentrelatedsearchindex]);
relatedsearchfunctionality(document.querySelectorAll(".relatedsearch")[currentrelatedsearchindex + 1]);
  currentrelatedsearchindex += 2;
} 

// writecontentonmainscreen2(writecontentofuser("Hello world this is a test message to check the functionality of the chat application."), "This is a test response.", "GPT-4o", "Quantum computer basics", "Cybersecurity in quantum computing")  ;
// function for copying text to clipboard 

function copyTextToClipboard() {
  const copybuton =document.querySelectorAll("[alt='copy']");
  copybuton.forEach((element, index) => {
    element.addEventListener("click", () => {
      navigator.clipboard.writeText(document.getElementsByClassName("responsefromai")[index].innerText).then(function() {
        alert("Text copied to clipboard!");
      })
    });
  });
}

// function for adding the history element in the aside 


function addhistoryelement(title,id) {
  const history = document.getElementById("history");
  const div= document.createElement("div");
  div.classList.add("history-item");
  div.setAttribute("data-id", id);
  div.innerHTML = `<div class="history-element">${title}</div>`;
  history.appendChild(div);
}

// function for getting the history from the backend 

async function gethistoryfrombackend() {
  const url = "http://localhost:3000/history";
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("History Response:", result);
    result.formattedChats.forEach((item) => {
      addhistoryelement(item.title, item.id);
    });
    try {
      document.querySelector("#history>div").classList.add("historyworking");
    } catch (err) {
      console.error("No history items to select:", err);
    }
  } catch (error) {
    console.error("Error fetching history:", error);
  }
}

// newchat functionality

async function newchatenabling() {
  if (isnew) {
    return;
  }
  isnew = true;
  currentworkingid = 0;
  currentrelatedsearchindex = 0;
  const maintextshown = document.getElementsByClassName("maintextshown")[0];
  maintextshown.innerHTML = "";
  togglemain();
} 


// related serach functionality 

function relatedsearchfunctionality(element) {
    element.addEventListener("click", () => {
      const query = element.innerText;
      const inputFields = document.querySelectorAll(".input");
      inputFields[workingpage].value = query;
      sendChatMessage();
    });
}

// select model on screen 2

function selectmodel() {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = "translate(-50%, -50%)";
  div.style.backgroundColor = "white";
  div.style.padding = "20px";
  div.style.borderRadius = "10px";
  div.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  div.innerHTML = `<div id="models">
                    <div>GPT-4o-mini</div>
                    <div>Gemini-2.5-flash</div>
                    <div>llama</div>
                    <div>Auto</div>
                    </div>`;
  document.body.appendChild(div);

  const models = div.querySelectorAll("#models>div");
  models.forEach((element, key) => {
    element.addEventListener("click", () => {
      workingmodel = key;
      const modelselectedscreen2 = document.getElementById("modelselectedscreen2");
      modelselectedscreen2.textContent = element.textContent;
      document.body.removeChild(div);
    });
  });
}