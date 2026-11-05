// --- GAME STATE ---
const gameState = {
    health: 80,
    love: 80,
    isAlive: true
};
let isGameRunning = false;
let isActionTriggered = false;

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
    
    // Guard check: only allow the game to start once
    if (isGameRunning) return;
    isGameRunning = true;

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

// --- STAT DECAY GAME LOOP ---
function startGameLoop() {
    updateUI();
    updateClockAndState();
    
    // Decay stats every 4 seconds
    setInterval(() => {
        if (!gameState.isAlive) return;

        // decrease health and love every 4 seconds
        gameState.health = Math.max(0, gameState.health - 5);
        gameState.love = Math.max(0, gameState.love - 5);

        if (gameState.health === 0 || gameState.love === 0) {
            gameState.isAlive = false;
            speechBubble.textContent = "eyoyoyy 😭";
            petSprite.src = "assets/character_sleep.png";
        }

        updateUI();
    }, 4000); 
    
    // Update clock every second (kept outside the decay interval so it only registers once)
    setInterval(updateClockAndState, 1000);
}

// --- CLOCK & TIME-BASED STATE LOGIC (Matches Device Local Time) ---
function updateClockAndState() {
    if (isActionTriggered) retuern;
    const now = new Date();
    
    // Format to local device time (12-hour or 24-hour based on user preference, or standard 24-hr here)
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const timeString = new Intl.DateTimeFormat([], options).format(now);
    
    liveClock.textContent = `${timeString}`;

    // Get local hour (0 - 23) based on the device's clock
    const hour = now.getHours();

    // Dynamic Sprite & Speech Adjustments based on Device Time and Status
    if (!gameState.isAlive) {
        petSprite.src = "assets/character_sleep.png";
        speechBubble.textContent = "eyoyoyyy 😭";
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
    

    petSprite.src = "assets/character_eat.png";
    speechYammy("Nyam nyamumumum enyak 🍞✨");
});

btnLove.addEventListener('click', () => {
    if (!gameState.isAlive) return;
    gameState.love = Math.min(100, gameState.love + 25);
    updateUI();
    
    petSprite.src = "assets/character_love.png";
    speechYammy("lov yu mamas 💖🥰");
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
    isActionTriggered = true;
    
    setTimeout(() => {
        isActionTriggered = false;
        updateClockAndState(); // Revert back to time-based state speech
    }, 2500);
}

