// Variables globales del juego
let scene, camera, renderer, dog, person, masterLight;
let trees = [], bushes = [];
let enemyDogs = [];
let dogState = {};
let masterPosition = {};
let gameTime = 0;
let startTime = 0;
let gameActive = true;
let walkCycle = 0;
let victoryTimeout = null;
let backgroundMusic = null;
let lyricsData = [];
let currentLyricIndex = 0;
let lyricsStartTime = 0;
let syncOffset = 0;
let syncMode = false;
let markingMode = false;
let markedTimes = [];
let currentMarkIndex = 0;
let dogAnimationState = 'idle';
let lastAnimationChange = 0;
let sniffTimer = 0;
let playTimer = 0;

// Sistema de dificultad progresiva
let gameLevel = 1;
let gamesCompleted = 0;

// Sistema de puntuación y logros
let totalScore = 0;
let bestTime = null;
let totalReunions = 0;
let perfectRuns = 0;
let survivalStreak = 0;
let maxSurvivalStreak = 0;

// Función para verificar colisión entre dos círculos
function checkCollision(x1, z1, r1, x2, z2, r2) {
    const dx = x1 - x2;
    const dz = z1 - z2;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < (r1 + r2);
}

// Verificar si el navegador soporta WebGL
function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl && gl instanceof WebGLRenderingContext;
    } catch (e) {
        return false;
    }
}

// Cargar Three.js dinámicamente
function loadThreeJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Error al cargar Three.js'));
        document.head.appendChild(script);
    });
}