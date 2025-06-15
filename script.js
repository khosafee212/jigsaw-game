let draggedId = null;
let score = 0;
let timer = 60; // เปลี่ยนจากนับขึ้น → นับถอยหลัง
let interval;
let currentLevel = 1;
const maxLevel = 3;

const correctSound = document.getElementById("correct");
const wrongSound = document.getElementById("wrong");
const bgm = document.getElementById("bgm");
const resultBox = document.getElementById("result");
const timerBox = document.getElementById("timer");
const scoreBox = document.getElementById("score");

bgm.play();

function startTimer() {
  timerBox.textContent = `เวลา: ${timer} วินาที`;
  interval = setInterval(() => {
    timer--;
    timerBox.textContent = `เวลา: ${timer} วินาที`;
    if (timer <= 0) {
      clearInterval(interval);
      showLose();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function showWin() {
  stopTimer();
  resultBox.innerHTML = `<h2>✅ เสร็จแล้วใน ${60 - timer} วินาที!</h2>`;
  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("targetGrid").style.display = "none";
  document.getElementById("piecesArea").style.display = "none";

  const completedImage = document.createElement("img");
  completedImage.src = `img/complete${currentLevel}.jpg`;
  completedImage.alt = "ภาพสมบูรณ์";
  completedImage.style.maxWidth = "320px";
  completedImage.style.borderRadius = "12px";
  completedImage.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
  completedImage.id = "completedImage";
  resultBox.appendChild(completedImage);

  launchBalloons();
}

function showLose() {
  resultBox.innerHTML = `<h2>หมดเวลาแล้วนะ! 😢</h2>`;
  document.getElementById("restartBtn").style.display = "inline-block";
}

function setupLevel(level) {
  document.getElementById("targetGrid").innerHTML = "";
  document.getElementById("targetGrid").style.display = "grid";
  document.getElementById("piecesArea").innerHTML = "";
  document.getElementById("piecesArea").style.display = "flex";
  resultBox.textContent = "";
  score = 0;
  timer = 60;
  scoreBox.textContent = `คะแนน: ${score}`;

  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";

  const oldComplete = document.getElementById("completedImage");
  if (oldComplete) oldComplete.remove();

  for (let i = 1; i <= 9; i++) {
    const box = document.createElement("div");
    box.dataset.correct = `puzzle${level}_${i}`;
    box.ondragover = e => e.preventDefault();
    box.ondrop = dropPiece;
    document.getElementById("targetGrid").appendChild(box);
  }

  const indices = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
  for (let i of indices) {
    const piece = document.createElement("img");
    piece.src = `img/puzzle${level}_${i}.jpg`;
    piece.draggable = true;
    piece.id = `puzzle${level}_${i}`;
    piece.ondragstart = dragStart;
    document.getElementById("piecesArea").appendChild(piece);
  }

  startTimer();
}

function dragStart(e) {
  draggedId = e.target.id;
}

function dropPiece(e) {
  if (e.target.tagName !== "DIV" || e.target.children.length > 0) return;
  if (e.target.dataset.correct === draggedId) {
    const piece = document.getElementById(draggedId);
    e.target.appendChild(piece);
    correctSound.play();
    score++;
    scoreBox.textContent = `คะแนน: ${score}`;
    if (score === 9) {
      showWin();
    }
  } else {
    wrongSound.play();
  }
}

function restartGame() {
  stopTimer();
  setupLevel(currentLevel);
}

function nextLevel() {
  if (currentLevel < maxLevel) {
    currentLevel++;
    restartGame();
  } else {
    resultBox.innerHTML = "<h2>🏁 ด่านทั้งหมดเสร็จแล้ว!</h2>";
  }
}

// ปรับปุ่มให้ใช้ id เพื่อควบคุมการแสดงผล
const nextBtn = document.querySelector("button[onclick='nextLevel()']");
nextBtn.id = "nextBtn";
const restartBtn = document.querySelector("button[onclick='restartGame()']");
restartBtn.id = "restartBtn";

setupLevel(currentLevel);

// 🎈 เพิ่มลูกโป่งตอนชนะ
function launchBalloons() {
  for (let i = 0; i < 20; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.left = `${Math.random() * 100}%`;
    document.body.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, 4000);
  }
}

// เพิ่มสไตล์ของลูกโป่งใน <style> หรือ css ไฟล์แยกก็ได้
const balloonStyle = document.createElement("style");
balloonStyle.innerHTML = `
.balloon {
  position: absolute;
  bottom: -50px;
  width: 30px;
  height: 40px;
  background: hsl(${Math.random()*360}, 70%, 60%);
  border-radius: 50% 50% 50% 50%;
  animation: floatUp 4s ease-in infinite;
  opacity: 0.7;
}
@keyframes floatUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-120vh); }
}`;
document.head.appendChild(balloonStyle);
