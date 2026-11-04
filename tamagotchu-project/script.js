// --- GAME STATE ---
const gameState = {
    health: 80,
    love: 80,
    isAlive: true
};

// --- DOM ELEMENTS ---
const screenLaunch = document.getElementById('screen-launch');
const screenInstructions = document.getElementById('screen-instructions');
const screenMain = document.getElementById('screen-main');

const btnPlay = document.getElementById('play');
const btnHowToPlay = document.getElementById('how-to-play');

const btnFeed = document.getElementById('btn-feed');
const btnLove = document.getElementById('btn-love');

const healthBarFill = document.getElementById('health-bar-fill');
const loveBarFill = document.getElementById('love-bar-fill');
const liveClock = document.getElementById('live-clock');
const petSprite = document.getElementById('pet-sprite');
const speechBubble = document.getElementById('speech-bubble');

// --- NAVIGATION FLOW ---

// 1. Click PLAY image button to jump straight to the Main Game Screen
btnPlay.addEventListener('click', (e) => {
    e.preventDefault();
    screenLaunch.classList.remove('active');
    screenMain.classList.add('active');
    startGameLoop();
});

// 2. Click HOW TO PLAY image button to open the instructions overlay
btnHowToPlay.addEventListener('click', (e) => {
    e.preventDefault();
    screenInstructions.classList.add('active');
});

// 3. Click OUTSIDE the instruction box (on the backdrop) to close overlay back to launch screen
screenInstructions.addEventListener('click', (e) => {
    if (e.target === screenInstructions) {
        screenInstructions.classList.remove('active');
    }
});

// --- CLOCK & TIME-BASED STATE LOGIC (Matches Device Local Time) ---
function updateClockAndState() {
    const now = new Date();
    
    // Format to local device time (12-hour or 24-hour based on user preference, or standard 24-hr here)
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const timeString = new Intl.DateTimeFormat([], options).format(now);
    
    // If you want it to display "LOCAL" or just the time format instead of "WITA"
    liveClock.textContent = `${timeString}`;

    // Get local hour (0 - 23) based on the device's clock
    const hour = now.getHours();

    // Dynamic Sprite & Speech Adjustments based on Device Time and Status
    if (!gameState.isAlive) {
        petSprite.src = "assets/character_sleep.png";
        speechBubble.textContent = "Zzz... met bobow... 😴";
        return;
    }

    if (hour >= 22 || hour < 6) {
        // Sleeping hours (10 PM - 6 AM)
        petSprite.src = "assets/character_sleep.png";
        speechBubble.textContent = "Night night, sweet dreams... 💤";
    } else if (hour >= 9 && hour < 17) {
        // Working hours
        petSprite.src = "assets/character_work.png";
        speechBubble.textContent = "SMGT! 💼";
    } else if (hour >= 6 && hour < 9) {
        // Morning coffee hours
        petSprite.src = "assets/character_coffee.png";
        speechBubble.textContent = "mpagiee,, smangat hari ni ☕";
    } else {
        // Idle / General hours
        petSprite.src = "assets/character_idle.png";
        speechBubble.textContent = "Helow Jjul!💕";
    }
}

// --- STAT DECAY GAME LOOP ---
function startGameLoop() {
    updateClockAndState();
    setInterval(() => {
        if (!gameState.isAlive) return;

        // Gradual stat decay over time
        gameState.health = Math.max(0, gameState.health - 0.25);
        gameState.love = Math.max(0, gameState.love - 0.25);

        if (gameState.health === 0 || gameState.love === 0) {
            gameState.isAlive = false;
            speechBubble.textContent = "eyoyoyy 😭";
        }

        updateUI();
    }, 4000); // Tick every 4 seconds

    // Update clock every second
    setInterval(updateClockAndState, 1000);
}

// --- UI SYNC ---
function updateUI() {
    healthBarFill.style.width = `${gameState.health}%`;
    loveBarFill.style.width = `${gameState.love}%`;
}

// --- ACTION BUTTON INTERACTIONS (+25% fills) ---
btnFeed.addEventListener('click', () => {
    if (!gameState.isAlive) return;
    gameState.health = Math.min(100, gameState.health + 25);
    updateUI();
    speechYammy("Nyam nyamumumum enyak 🍞✨");
// Switch to Eating/Feeding asset
    petSprite.src = "assets/character_eat.png";
    triggerActionFeedback("Nyam nyamumumum enyak 🍞✨");
});

btnLove.addEventListener('click', () => {
    if (!gameState.isAlive) return;
    gameState.love = Math.min(100, gameState.love + 25);
    updateUI();
    speechYammy("lov yu mamas 💖🥰");
// Switch to Love/Affection asset
    petSprite.src = "assets/character_love.png";
    triggerActionFeedback("lov yu mamas 💖🥰");
});

function triggerActionFeedback(text) {
    speechBubble.textContent = text;
    
    // Lock out the regular clock/time state update momentarily so the action pose stays visible
    isActionTriggered = true;
    
    // After 2.5 seconds, reset back to normal time-based poses and speech
    setTimeout(() => {
        isActionTriggered = false;
        updateClockAndState(); 
    }, 2500);
}

function speechYammy(text) {
    speechBubble.textContent = text;
    setTimeout(() => {
        updateClockAndState(); // Revert back to time-based state speech
    }, 2500);
}

