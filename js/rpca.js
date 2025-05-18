let hasilPlayer = 10;
let hasilComputer = 10;
const winAudio = new Audio("sound/win.mp3");
const loseAudio = new Audio("sound/lose.mp3");
const drawAudio = new Audio("sound/draw.mp3");
const bgm = document.getElementById("bgm");
const gameWinAudio = document.getElementById("gameWin");
const gameLoseAudio = document.getElementById("gameLose");


function updateHealthBars(prevPlayer, prevComputer) {
  const healthPlayer = document.getElementById("healthPlayer");
  const healthComputer = document.getElementById("healthComputer");

  healthPlayer.style.width = `${hasilPlayer * 10}%`;
  healthComputer.style.width = `${hasilComputer * 10}%`;

  if (hasilPlayer < prevPlayer) {
    healthPlayer.classList.add("health-hit");
    setTimeout(() => {
      healthPlayer.classList.remove("health-hit");
    }, 400);
  }

  if (hasilComputer < prevComputer) {
    healthComputer.classList.add("health-hit");
    setTimeout(() => {
      healthComputer.classList.remove("health-hit");
    }, 400);
  }

  const info = document.querySelector(".info");
  if (hasilPlayer === 0 || hasilComputer === 0) {
    document.getElementById("resetGame").classList.remove("hidden");
    bgm.pause();
    bgm.currentTime = 0;
    if (hasilPlayer === 0) {
      gameLoseAudio.play();
      info.innerHTML = "SPACE DEMON DEFEATS YOU!";
      info.classList.add("text-red-500", "text-2xl");
    } else {
      gameWinAudio.play();
      info.innerHTML = "YOU DEFEATED THE SPACE DEMON!";
      info.classList.add("text-green-500", "text-2xl");
    }

    const pilihan = document.querySelectorAll(".player img");
    pilihan.forEach(img => img.style.pointerEvents = "none");
  }
}

let isHealthBarShown = false;
function showHealthBar() {
  if (!isHealthBarShown) {
    const healthWrapper = document.getElementById("healthWrapper");
    gsap.to(healthWrapper, {
      duration: 1,
      opacity: 1,
      scale: 1,
      ease: "power3.out"
    });
    isHealthBarShown = true;
  }
}

function animateInfo(result) {
  const info = document.querySelector(".info");
  info.classList.remove("text-green-400", "text-red-600", "text-yellow-300");

  if (result === "DEMON HURT!") info.classList.add("text-green-400");
  else if (result === "YOU'RE HURT!") info.classList.add("text-red-600");
  else info.classList.add("text-yellow-300");

  info.style.transform = "scale(1.2)";
  info.style.opacity = "0.6";

  setTimeout(() => {
    info.style.transform = "scale(1)";
    info.style.opacity = "1";
  }, 300);

  info.classList.add("boom-result-animate", "glow-border");
  setTimeout(() => {
    info.classList.remove("boom-result-animate", "glow-border");
  }, 700);
}

function getPilComputer() {
  const comp = Math.random();
  if (comp <= 0.19) return "rock";
  if (comp <= 0.39) return "paper";
  if (comp <= 0.59) return "scissor";
  if (comp <= 0.79) return "lizard";
  return "spock";
}

function getHasil(comp, player) {
    const labelMap = { rock: "Saber", paper: "Raygun", scissor: "Artillery", lizard: "Space Magic", spock: "Space Monster" };
    const compLabelMap = { rock: "Demon Rock", paper: "Gravitational Pull", scissor: "Physical Form", lizard: "Poison", spock: "Mindfield" };
   
    const rules = {
      rock: { scissor: "Saber cuts through Physical Form", lizard: "Saber cuts through Poison" },
      paper: { rock: "Raygun disintegrates Demon Rock", spock: "Raygun destabilizes Mindfield" },
      scissor: { paper: "Artillery blasts through Gravitational Pull", lizard: "Artillery obliterates Poison" },
      lizard: { paper: "Space Magic bends Gravitational Pull", spock: "Space Magic disables Mindfield" },
      spock: { rock: "Space Monster obliterates Demon Rock", scissor: "Space Monster crushes Physical Form" }
    };
  
    const reverseRules = {
      rock: { paper: "Gravitational Pull overwhelms Saber", spock: "Mindfield neutralizes Saber" },
      paper: { scissor: "Physical Form disables Raygun", lizard: "Poison corrodes Raygun" },
      scissor: { rock: "Demon Rock shatters Artillery", spock: "Mindfield melts Artillery circuits" },
      lizard: { rock: "Demon Rock resists Space Magic", scissor: "Physical Form absorbs Space Magic" },
      spock: { paper: "Gravitational Pull entraps Space Monster", lizard: "Poison infects Space Monster" }
    };
  
    if (player === comp) {
      return { result: "NO EFFECT!", reason: `${labelMap[player]} and ${compLabelMap[comp]} cancel each other out.`
      };
    }
  
    if (rules[player] && rules[player][comp]) {
      return { result: "DEMON HURT!", reason: rules[player][comp] };
    }
  
    if (reverseRules[player] && reverseRules[player][comp]) {
      return { result: "YOU'RE HURT!", reason: reverseRules[player][comp]
      };
    }
  
    return { result: "NO EFFECT!", reason: "Unknown interaction."
    };
}
  
function putar() {
  const imgComputer = document.querySelector('.img-computer');
  const gambar = ["devil", "devil1", "devil2", "devil3", "devil4"];
  let i = 0;
  const waktuMulai = new Date().getTime();
  const interval = setInterval(function () {
    if (new Date().getTime() - waktuMulai > 1000) {
      clearInterval(interval);
      return;
    }
    imgComputer.setAttribute("src", "img/" + gambar[i++] + ".jpeg");
    if (i == gambar.length) i = 0;
  }, 100);
}

const soundMap = {
    rock: new Audio("sound/saber.mp3"),
    paper: new Audio("sound/raygun.mp3"),
    scissor: new Audio("sound/artillery.mp3"),
    lizard: new Audio("sound/space-magic.mp3"),
    spock: new Audio("sound/space-monster.mp3")
};

const pilihan = document.querySelectorAll(".player img");
pilihan.forEach(function (pil) {
  pil.addEventListener("click", function () {
    if (bgm.paused) {
        bgm.volume = 0.7;
        bgm.play();
    }
    showHealthBar();
    if (hasilPlayer === 0 || hasilComputer === 0) return; 
    const prevPlayer = hasilPlayer;
    const prevComputer = hasilComputer;
    const pilComputer = getPilComputer();
    const pilPlayer = pil.alt;
    const hasilData = getHasil(pilComputer, pilPlayer);
    const hasil = hasilData.result;
    const reason = hasilData.reason;
    soundMap[pilPlayer].play();
    putar();

    setTimeout(function () {
      const imgComputer = document.querySelector(".img-computer");
      imgComputer.setAttribute("src", "img/" + pilComputer + ".jpeg");

      const info = document.querySelector(".info");
      info.innerHTML = `
            <div class="result-text text-xl font-bold tracking-tight leading-snug">${hasil}</div>
            <div class="reason-text text-xs text-white italic opacity-0 transition-all duration-500">${reason}</div>
        `;
      animateInfo(hasil);
        
      setTimeout(() => {
        const reasonText = document.querySelector(".reason-text");
        reasonText.classList.remove("opacity-0", "translate-y-2");
      }, 400);


      if (hasil === "DEMON HURT!") {
        hasilComputer--;
        winAudio.play();
      } else if (hasil === "YOU'RE HURT!") {
        hasilPlayer--;
        loseAudio.play();
      } else {
        drawAudio.play();
      }

      updateHealthBars(prevPlayer, prevComputer);
    }, 1000);
  });
});

const resetBtn = document.getElementById("resetGame");

resetBtn.addEventListener("click", () => {
  hasilPlayer = 10;
  hasilComputer = 10;

  updateHealthBars(0, 0);

  const info = document.querySelector(".info");
  info.innerHTML = "Choose your weapon!";
  info.classList.remove("text-red-500", "text-green-500", "text-2xl", "scale-125", "text-red-400", "text-green-400");

  const pilihan = document.querySelectorAll(".player img");
  pilihan.forEach(img => img.style.pointerEvents = "auto");

  const imgComputer = document.querySelector(".img-computer");
  imgComputer.setAttribute("src", "img/devil.jpeg");

  resetBtn.classList.add("hidden");

  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
});
