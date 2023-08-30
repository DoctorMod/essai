// Get document element
const textDisplay = document.querySelector('#text-display');
const inputField = document.querySelector('#input-field');
const confettiContainer = document.body;
const WarnToggle = document.querySelector("#toggleWarn");

// Initialize dynamic variables
let wordList = [];
let currentWord = 0;
let correctKeys = 0;
let timer;
let start;

if (localStorage.wordList) {
  setWordList(localStorage.wordList);
  textInput.value = localStorage.wordList;
}
if (localStorage.toggleWarn) {
  document.querySelector("#toggleWarn").checked = localStorage.toggleWarn;
}

//from https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

// Find a list of words and display it to textDisplay
function setText(e) {
  e = e || window.event;

  inputField.disabled = false;
  inputField.value = '';
  textDisplay.style.display = 'block';
  inputField.className = '';
  textDisplay.style.height = 'auto';
  textDisplay.innerHTML = '';

  if (WarnToggle.checked) {
    textDisplay.parentElement.className = "warn";
    localStorage.toggleWarn = true;
  } else {
    textDisplay.parentElement.className = "";
    localStorage.toggleWarn = false;
  }

  if (!timer) {
    start = Date.now()
    timer = setInterval(function() {
      document.getElementById("sec").innerText = pad(Math.floor((Date.now() - start)/1000) % 60,2);
      document.getElementById("min").innerText = pad(Math.floor((Date.now() - start)/60000) % 60,2);
      document.getElementById("hour").innerText = pad(Math.floor((Date.now() - start)/3600000),2);
    },1000);
  }
  showText();
  inputField.focus();
}

// Display text to textDisplay
function showText() {
  wordList.forEach(word => {
    let span = document.createElement('span');
    span.innerHTML = word + ' ';
    span.style.display = 'none';
    textDisplay.appendChild(span);
  });
  textDisplay.firstChild.classList.add('highlight');
}

// Key is pressed in input field
inputField.addEventListener('keydown', e => {
  // Add wrong class to input field
  if (e.key >= 'a' && e.key <= 'z' || (e.key === `'` || e.key === ',' || e.key === '.' || e.key === ';')) {
    let inputWordSlice = inputField.value + e.key;
    let currentWordSlice = wordList[currentWord].slice(0, inputWordSlice.length);
    console.log(inputWordSlice);
    inputField.className = inputWordSlice === currentWordSlice ? '' : 'wrong';
  } else if (e.key === 'Backspace') {
    let inputWordSlice = e.ctrlKey ? '' : inputField.value.slice(0, inputField.value.length - 1);
    let currentWordSlice = wordList[currentWord].slice(0, inputWordSlice.length);
    inputField.className = inputWordSlice === currentWordSlice ? '' : 'wrong';
  } else if (e.key === ' ') {
    inputField.className = '';
  }

  // If it is the first character entered
  if (currentWord === 0 && inputField.value === '') {
    //START CODE
  }

  // If it is the space key check the word and add correct/wrong class
  if (e.key === ' ' || e.key === "Enter") {
    e.preventDefault();

    if (inputField.value !== '') {
      
      textDisplay.childNodes[currentWord].style.display = 'inline';
      const currentWordPosition = textDisplay.childNodes[currentWord].getBoundingClientRect();
      const nextWordPosition = textDisplay.childNodes[currentWord + 1].getBoundingClientRect();
      if (currentWordPosition.top < nextWordPosition.top) {
        for (i = 0; i < currentWord + 1; i++) textDisplay.childNodes[i].style.display = 'none';
      }

      // If it is not the last word increment currentWord,
      if (currentWord < wordList.length - 2) {
        if (inputField.value === wordList[currentWord]) {
          textDisplay.childNodes[currentWord].classList.add('correct');
          correctKeys += wordList[currentWord].length + 1;
        } else {
          textDisplay.childNodes[currentWord].classList.add('wrong');
          endRound();
        }
        textDisplay.childNodes[currentWord + 1].classList.add('highlight');
      } else if (currentWord === wordList.length - 2) {
        if (inputField.value === wordList[currentWord]) {
          showResult();
        } else {
          textDisplay.childNodes[currentWord].classList.add('wrong');
          endRound();
        }
      }

      inputField.value = '';
      currentWord++;
    }

    // Else if it is the last word and input word is correct show the result
  } else if (currentWord === wordList.length - 1) {
    if (inputField.value + e.key === wordList[currentWord]) {
      textDisplay.childNodes[currentWord].classList.add('correct');
      correctKeys += wordList[currentWord].length;
      currentWord++;
      showResult();
    }
  }
});

function endRound() {
  // FAILURE
  console.log("FAILURE");
  inputField.disabled = true;

  //wordList = [];
  currentWord = -1;
  correctKeys = 0;

  setTimeout(setText,1000);

}

function showResult() {
  textDisplay.style.color = "green";
  console.log("SUCCESS");
  showConfetti(500);
  inputField.disabled = true;
  currentWord = -1;
  correctKeys = 0;
  clearInterval(timer);
}

function setWordList(text) {
  localStorage.wordList = text;
  wordList = (text + " SPACERWORD").split(/[ \t\n]+/);
  hideTextChange();
  setText(0);
}

// Command actions
document.addEventListener('keydown', e => {
  if (!document.querySelector('#wordList-center').classList.contains('hidden')) {
    if (e.key === 'Escape'){
      hideTextChange();
      inputField.focus();
    }
  } else if (e.key === 'Escape') {
    setText(e);
  }
});

function showTextChange() {
  document.getElementById('wordList-center').classList.remove('hidden');
  document.getElementById('command-center').classList.add('hidden');
}

function hideTextChange() {
  document.getElementById('wordList-center').classList.add('hidden');
  document.getElementById('command-center').classList.remove('hidden');
}

const showConfetti = (n) => {
  for (let i = 0; i < n; i++) {
    setTimeout(function () {
      const confetti = document.createElement('div');
    confetti.textContent = ['🎉','🎊','🥳','💸','🪅','🤪','👻'][Math.round(Math.random()*7.5)];
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * innerWidth + 'px';
    confetti.style.animationDuration = Math.round(Math.random()*3+3)+ "s";
    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 8000);
    }, Math.random()*4000);
  }
};