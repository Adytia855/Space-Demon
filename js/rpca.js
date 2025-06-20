// Global variables to store player and computer health.
let hasilPlayer = 10;
let hasilComputer = 10;

// Audio elements for round win, lose, and draw sound effects.
const winAudio = new Audio("sound/win.mp3");
const loseAudio = new Audio("sound/lose.mp3");
const drawAudio = new Audio("sound/draw.mp3");

// DOM elements for background music and game win/lose sounds.
const bgm = document.getElementById("bgm");
const gameWinAudio = document.getElementById("gameWin");
const gameLoseAudio = document.getElementById("gameLose");

/**
 * Updates the visual health bars for both the player and the computer.
 * Also handles hit animations and game over conditions.
 * @param {number} prevPlayer - The player's health before the current round.
 * @param {number} prevComputer - The computer's health before the current round.
 */
function updateHealthBars(prevPlayer, prevComputer) {
  const healthPlayer = document.getElementById("healthPlayer");
  const healthComputer = document.getElementById("healthComputer");

  // Update health bar widths based on current health scores.
  healthPlayer.style.width = `${hasilPlayer * 10}%`;
  healthComputer.style.width = `${hasilComputer * 10}%`;

  // Apply a "health-hit" animation if player's health decreased.
  if (hasilPlayer < prevPlayer) {
    healthPlayer.classList.add("health-hit");
    setTimeout(() => {
      healthPlayer.classList.remove("health-hit");
    }, 400);
  }

  // Apply a "health-hit" animation if computer's health decreased.
  if (hasilComputer < prevComputer) {
    healthComputer.classList.add("health-hit");
    setTimeout(() => {
      healthComputer.classList.remove("health-hit");
    }, 400);
  }

  const info = document.querySelector(".info");
  // Check for game over conditions.
  if (hasilPlayer === 0 || hasilComputer === 0) {
    document.getElementById("resetGame").classList.remove("hidden"); // Show reset button
    bgm.pause();
    bgm.currentTime = 0; // Reset BGM
    if (hasilPlayer === 0) {
      gameLoseAudio.play();
      info.innerHTML = "SPACE DEMON DEFEATS YOU!";
      info.classList.add("text-red-500", "text-2xl");
    } else {
      gameWinAudio.play();
      info.innerHTML = "YOU DEFEATED THE SPACE DEMON!";
      info.classList.add("text-green-500", "text-2xl");
    }

    // Disable player choices after game over.
    const pilihan = document.querySelectorAll(".player img");
    pilihan.forEach(img => img.style.pointerEvents = "none");
  }
}

// Flag to track if health bars have been shown.
let isHealthBarShown = false;
/**
 * Animates the health bars into view if they haven't been shown yet.
 * Uses GSAP for the animation.
 */
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

/**
 * Animates the round result information display.
 * @param {string} result - The result of the round (e.g., "DEMON HURT!", "YOU'RE HURT!").
 */
function animateInfo(result) {
  const info = document.querySelector(".info");
  // Reset previous result text colors.
  info.classList.remove("text-green-400", "text-red-600", "text-yellow-300");

  // Apply color based on the result.
  if (result === "DEMON HURT!") info.classList.add("text-green-400");
  else if (result === "YOU'RE HURT!") info.classList.add("text-red-600");
  else info.classList.add("text-yellow-300");

  // Initial state for animation.
  info.style.transform = "scale(1.2)";
  info.style.opacity = "0.6";

  // Animate to final state.
  setTimeout(() => {
    info.style.transform = "scale(1)";
    info.style.opacity = "1";
  }, 300);

  // Add CSS animation classes and remove them after the animation.
  info.classList.add("boom-result-animate", "glow-border");
  setTimeout(() => {
    info.classList.remove("boom-result-animate", "glow-border");
  }, 700);
}

/**
 * Determines the computer's choice randomly.
 * The probabilities are slightly skewed.
 * @returns {string} The computer's choice ("rock", "paper", "scissor", "lizard", or "spock").
 */
function getPilComputer() {
  const comp = Math.random();
  if (comp <= 0.19) return "rock"; // Saber
  if (comp <= 0.39) return "paper"; // Raygun
  if (comp <= 0.59) return "scissor"; // Artillery
  if (comp <= 0.79) return "lizard"; // Space Magic
  return "spock"; // Space Monster
}

/**
 * Determines the outcome of a round based on player and computer choices.
 * Implements the rules for Rock Paper Scissors Lizard Spock with themed interactions.
 * @param {string} comp - The computer's choice.
 * @param {string} player - The player's choice.
 * @returns {object} An object containing the `result` (e.g., "DEMON HURT!") and `reason` (description of the interaction).
 */
function getHasil(comp, player) {
    // Mapping of internal choice names to display names for the player.
    const labelMap = { rock: "Saber", paper: "Raygun", scissor: "Artillery", lizard: "Space Magic", spock: "Space Monster" };
    // Mapping of internal choice names to display names for the computer (Space Demon).
    const compLabelMap = { rock: "Demon Rock", paper: "Gravitational Pull", scissor: "Physical Form", lizard: "Poison", spock: "Mindfield" };
   
    // Rules where the player wins.
    const rules = {
      rock: { scissor: "Saber cuts through Physical Form", lizard: "Saber cuts through Poison" },
      paper: { rock: "Raygun disintegrates Demon Rock", spock: "Raygun destabilizes Mindfield" },
      scissor: { paper: "Artillery blasts through Gravitational Pull", lizard: "Artillery obliterates Poison" },
      lizard: { paper: "Space Magic bends Gravitational Pull", spock: "Space Magic disables Mindfield" },
      spock: { rock: "Space Monster obliterates Demon Rock", scissor: "Space Monster crushes Physical Form" }
    };
  
    // Rules where the computer wins (player loses).
    const reverseRules = {
      rock: { paper: "Gravitational Pull overwhelms Saber", spock: "Mindfield neutralizes Saber" },
      paper: { scissor: "Physical Form disables Raygun", lizard: "Poison corrodes Raygun" },
      scissor: { rock: "Demon Rock shatters Artillery", spock: "Mindfield melts Artillery circuits" },
      lizard: { rock: "Demon Rock resists Space Magic", scissor: "Physical Form absorbs Space Magic" },
      spock: { paper: "Gravitational Pull entraps Space Monster", lizard: "Poison infects Space Monster" }
    };
  
    // Handle a draw.
    if (player === comp) {
      return { result: "NO EFFECT!", reason: `${labelMap[player]} and ${compLabelMap[comp]} cancel each other out.`
      };
    }
  
    // Check if player wins.
    if (rules[player] && rules[player][comp]) {
      return { result: "DEMON HURT!", reason: rules[player][comp] };
    }
  
    // Check if computer wins.
    if (reverseRules[player] && reverseRules[player][comp]) {
      return { result: "YOU'RE HURT!", reason: reverseRules[player][comp]
      };
    }
  
    // Default for unknown interactions (should not happen with defined rules).
    return { result: "NO EFFECT!", reason: "Unknown interaction."
    };
}
  
/**
 * Animates the computer's choice image by cycling through a set of images.
 */
function putar() {
  const imgComputer = document.querySelector('.img-computer');
  const gambar = ["devil", "devil1", "devil2", "devil3", "devil4"]; // Array of image names (without .jpeg)
  let i = 0;
  const waktuMulai = new Date().getTime();
  const interval = setInterval(function () {
    // Stop animation after 1 second.
    if (new Date().getTime() - waktuMulai > 1000) {
      clearInterval(interval);
      return;
    }
    imgComputer.setAttribute("src", "img/" + gambar[i++] + ".jpeg");
    if (i == gambar.length) i = 0; // Loop through images
  }, 100); // Change image every 100ms
}

// Map of player choices to their corresponding sound effects.
const soundMap = {
    rock: new Audio("sound/saber.mp3"),
    paper: new Audio("sound/raygun.mp3"),
    scissor: new Audio("sound/artillery.mp3"),
    lizard: new Audio("sound/space-magic.mp3"),
    spock: new Audio("sound/space-monster.mp3")
};

// Get all player choice image elements.
const pilihan = document.querySelectorAll(".player img");
// Add click event listeners to each player choice.
pilihan.forEach(function (pil) {
  pil.addEventListener("click", function () {
    // Start background music if it's paused.
    if (bgm.paused) {
        bgm.volume = 0.7;
        bgm.play();
    }
    showHealthBar(); // Ensure health bars are visible.
    // If game is over, do nothing.
    if (hasilPlayer === 0 || hasilComputer === 0) return; 
    
    const prevPlayer = hasilPlayer; // Store health before the round.
    const prevComputer = hasilComputer;
    
    const pilComputer = getPilComputer(); // Get computer's choice.
    const pilPlayer = pil.alt; // Get player's choice from the image's alt attribute.
    const hasilData = getHasil(pilComputer, pilPlayer); // Determine round outcome.
    const hasil = hasilData.result;
    const reason = hasilData.reason;
    
    soundMap[pilPlayer].play(); // Play sound for player's choice.
    putar(); // Animate computer's choice reveal.

    // After 1 second (to allow `putar` animation to finish):
    setTimeout(function () {
      const imgComputer = document.querySelector(".img-computer");
      imgComputer.setAttribute("src", "img/" + pilComputer + ".jpeg"); // Show computer's actual choice.

      const info = document.querySelector(".info");
      // Update info display with round result and reason.
      info.innerHTML = `
            <div class="result-text text-xl font-bold tracking-tight leading-snug">${hasil}</div>
            <div class="reason-text text-xs text-white italic opacity-0 transition-all duration-500">${reason}</div>
        `;
      animateInfo(hasil); // Animate the info display.
        
      // Make the reason text visible after a short delay.
      setTimeout(() => {
        const reasonText = document.querySelector(".reason-text");
        reasonText.classList.remove("opacity-0", "translate-y-2");
      }, 400);

      // Update health scores and play round win/lose/draw sounds.
      if (hasil === "DEMON HURT!") {
        hasilComputer--;
        winAudio.play();
      } else if (hasil === "YOU'RE HURT!") {
        hasilPlayer--;
        loseAudio.play();
      } else {
        drawAudio.play();
      }

      updateHealthBars(prevPlayer, prevComputer); // Update health bars visually.
    }, 1000);
  });
});

// Get the reset game button element.
const resetBtn = document.getElementById("resetGame");

// Add click event listener to the reset button.
resetBtn.addEventListener("click", () => {
  // Reset health scores.
  hasilPlayer = 10;
  hasilComputer = 10;

  updateHealthBars(0, 0); // Update health bars to full.

  // Reset info display.
  const info = document.querySelector(".info");
  info.innerHTML = "Choose your weapon!";
  info.classList.remove("text-red-500", "text-green-500", "text-2xl", "scale-125", "text-red-400", "text-green-400");

  // Re-enable player choices.
  const pilihan = document.querySelectorAll(".player img");
  pilihan.forEach(img => img.style.pointerEvents = "auto");

  // Reset computer's image.
  const imgComputer = document.querySelector(".img-computer");
  imgComputer.setAttribute("src", "img/devil.jpeg");

  resetBtn.classList.add("hidden"); // Hide reset button.

  // Restart background music.
  // Note: There's a typo here, `backgroundMusic` should likely be `bgm`.
  // Assuming it's a typo and `bgm` is intended:
  bgm.currentTime = 0;
  bgm.play();
});
