const files = [
  "sounds/1.mp3","sounds/2.mp3","sounds/3.mp3","sounds/4.mp3",
  "sounds/5.mp3","sounds/6.mp3","sounds/7.mp3","sounds/8.mp3",
  "sounds/9.mp3","sounds/10.mp3","sounds/11.mp3"
];

const durations = [70,69,66,56,77,77,79,84,98,87,119];

let snippetLength = 1.0;
let audio = new Audio();

let correctFileIndex = null;
let correctTime = 0;
let hasPlayed = false;
let hasMovedSlider = false;
let roundInitialized = false;

let round = 1;
let totalScore = 0;

const slider = document.getElementById("timeSlider");
const sliderValue = document.getElementById("sliderValue");
const guessDropdown = document.getElementById("guessFile");
const result = document.getElementById("result");

// --- HOME SCREEN BUTTON HIGHLIGHT ---
function setSnippetLength(len, btn) {
  snippetLength = len;
  // Remove highlight from both
  document.getElementById("nmpzBtn").classList.remove("active");
  document.getElementById("noMoveBtn").classList.remove("active");
  // Highlight the clicked button
  btn.classList.add("active");
}

// --- START GAME ---
function startGame() {
  hideAllScreens();
  document.getElementById("gameScreen").style.display = "block";
  round = 1;
  totalScore = 0;
  document.getElementById("roundNum").textContent = round;
  startNewRound();
}

// --- RETURN HOME BUTTON ---
function returnHome() {
  audio.pause();
  hideAllScreens();
  document.getElementById("homeScreen").style.display = "block";
}

// --- HIDE ALL SCREENS ---
function hideAllScreens() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("finalScreen").style.display = "none";
}

// --- SLIDER ---
slider.oninput = () => {
  sliderValue.textContent = parseFloat(slider.value).toFixed(1);
  if (hasPlayed && !hasMovedSlider) {
    document.getElementById("submitBtn").style.display = "inline";
    hasMovedSlider = true;
  }
};

// --- NEW ROUND ---
function startNewRound() {
  hasPlayed = false;
  hasMovedSlider = false;
  roundInitialized = true;

  result.innerHTML = "";
  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";

  if (round === 5) document.getElementById("nextBtn").textContent = "End Game";
  else document.getElementById("nextBtn").textContent = "Next Round";

  correctFileIndex = Math.floor(Math.random() * files.length);
  audio.src = files[correctFileIndex];

  const selectedIndex = parseInt(guessDropdown.value);
  slider.max = durations[selectedIndex];
  slider.value = 0;
  sliderValue.textContent = "0";

  correctTime = Math.random() * (durations[correctFileIndex] - snippetLength);
  audio.load();
}

// --- PLAY SNIPPET ---
function playSnippet() {
  if (!roundInitialized) startNewRound();
  hasPlayed = true;
  audio.currentTime = correctTime;
  audio.play().then(() => {
    setTimeout(() => audio.pause(), snippetLength * 1000);
  }).catch(err => console.log("Audio play error:", err));
}

// --- CHECK GUESS ---
function checkAnswer() {
  if (!roundInitialized || !hasPlayed) {
    alert("Click 'Play Snippet' first!");
    return;
  }

  const guessedFile = parseInt(guessDropdown.value);
  const guessedTime = parseFloat(slider.value);

  let score = 0;

  if (guessedFile === correctFileIndex) {
    const timeError = Math.abs(guessedTime - correctTime);
    if (timeError <= 2) score = 5;
    else if (timeError <= 2.5) score = 4.9;
    else if (timeError <= 3.0) score = 4.8;
    else if (timeError <= 3.6) score = 4.7;
    else if (timeError <= 4.1) score = 4.6;
    else if (timeError <= 4.6) score = 4.5;
    else if (timeError <= 5.1) score = 4.4;
    else if (timeError <= 5.5) score = 4.3;
    else if (timeError <= 6.0) score = 4.2;
    else if (timeError <= 6.4) score = 4.1;
    else if (timeError <= 7.5) score = 4.0;
    else if (timeError <= 8.0) score = 3.9;
    else if (timeError <= 8.4) score = 3.8;
    else if (timeError <= 8.8) score = 3.7;
    else score = Math.max(0, 3.7 - Math.floor((timeError - 8.8)/3)*0.1);
  }

  totalScore += score;

  let message = guessedFile === correctFileIndex 
      ? `✅ Correct Video!<br>⏱️ You were ${Math.abs(guessedTime - correctTime).toFixed(2)}s off<br>🎯 Points this round: ${score.toFixed(1)} Gay`
      : `❌ Wrong Gooner Video! It was ${correctFileIndex + 1}.mp3<br>🎯0 Gay`;

  result.innerHTML = message;

  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "inline";
}

// --- NEXT ROUND ---
function nextRound() {
  if (round >= 5) {
    hideAllScreens();
    document.getElementById("finalScreen").style.display = "block";
    document.getElementById("totalScoreDisplay").textContent = totalScore.toFixed(1);
    roundInitialized = false;
    return;
  }
  round++;
  document.getElementById("roundNum").textContent = round;
  startNewRound();
}

// --- RESTART ---
function restartGame() {
  totalScore = 0;
  round = 1;
  hideAllScreens();
  document.getElementById("gameScreen").style.display = "block";
  document.getElementById("roundNum").textContent = round;
  startNewRound();
}

// --- SHORTCUTS ---
document.addEventListener("keydown", (e) => {
  if (document.getElementById("gameScreen").style.display === "block") {
    if (e.code === "Space") {
      if (document.getElementById("submitBtn").style.display === "inline") checkAnswer();
      e.preventDefault();
    } else if (e.key === "5") {
      if (document.getElementById("nextBtn").style.display === "inline") nextRound();
    }
  }
});
