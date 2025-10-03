// Sistema de controles con puntitos
const keys = {};
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;
let isDownPressed = false;

// Eventos de teclado para PC
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Configurar controles con puntitos
function setupTouchControls() {
    // Eventos para cada puntito
    setupDotEvents('leftDot', () => isLeftPressed = true, () => isLeftPressed = false);
    setupDotEvents('rightDot', () => isRightPressed = true, () => isRightPressed = false);
    setupDotEvents('upDot', () => isUpPressed = true, () => isUpPressed = false);
    setupDotEvents('downDot', () => isDownPressed = true, () => isDownPressed = false);
}

function setupDotEvents(dotId, onStart, onEnd) {
    const dot = document.getElementById(dotId);
    
    // Touch events
    dot.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onStart();
    });
    
    dot.addEventListener('touchend', (e) => {
        e.preventDefault();
        onEnd();
    });
    
    // Mouse events para PC
    dot.addEventListener('mousedown', (e) => {
        e.preventDefault();
        onStart();
    });
    
    dot.addEventListener('mouseup', (e) => {
        e.preventDefault();
        onEnd();
    });
    
    dot.addEventListener('mouseleave', (e) => {
        onEnd();
    });
}

// Obtener input del jugador
function getPlayerInput() {
    let moveLeft = false;
    let moveRight = false;
    let accelerate = false;
    let brake = false;
    
    // Controles de teclado (PC)
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) moveLeft = true;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) moveRight = true;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) accelerate = true;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) brake = true;
    
    // Controles de puntitos (Móvil)
    if (isLeftPressed) moveLeft = true;
    if (isRightPressed) moveRight = true;
    if (isUpPressed) accelerate = true;
    if (isDownPressed) brake = true;
    
    return { moveLeft, moveRight, accelerate, brake };
}

// Manejar redimensionamiento
window.addEventListener('resize', () => {
    if (!renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    document.getElementById('gameCanvas').width = width;
    document.getElementById('gameCanvas').height = height;
});