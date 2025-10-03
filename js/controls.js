// Sistema de controles intuitivo
const keys = {};
let touchActive = false;
let touchX = 0;
let touchY = 0;
let touchStartTime = 0;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Eventos de teclado para PC
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Configurar controles táctiles intuitivos
function setupTouchControls() {
    const canvas = document.getElementById('gameCanvas');
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse events para PC
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
}

function handleTouchStart(e) {
    e.preventDefault();
    if (!gameActive) return;
    
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    touchX = touch.clientX - rect.left;
    touchY = touch.clientY - rect.top;
    touchActive = true;
    touchStartTime = Date.now();
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!gameActive || !touchActive) return;
    
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    touchX = touch.clientX - rect.left;
    touchY = touch.clientY - rect.top;
}

function handleTouchEnd(e) {
    e.preventDefault();
    touchActive = false;
}

function handleMouseDown(e) {
    if (!gameActive || isMobile) return;
    
    const rect = e.target.getBoundingClientRect();
    touchX = e.clientX - rect.left;
    touchY = e.clientY - rect.top;
    touchActive = true;
    touchStartTime = Date.now();
}

function handleMouseMove(e) {
    if (!gameActive || !touchActive || isMobile) return;
    
    const rect = e.target.getBoundingClientRect();
    touchX = e.clientX - rect.left;
    touchY = e.clientY - rect.top;
}

function handleMouseUp(e) {
    if (isMobile) return;
    touchActive = false;
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
    
    // Controles táctiles intuitivos
    if (touchActive && gameActive) {
        const canvas = document.getElementById('gameCanvas');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Calcular dirección hacia donde tocó
        const deltaX = touchX - centerX;
        const deltaY = touchY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 50) { // Zona muerta
            const targetAngle = Math.atan2(deltaX, -deltaY);
            const currentAngle = dogState.angle;
            
            // Calcular diferencia de ángulo
            let angleDiff = targetAngle - currentAngle;
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            // Girar hacia el objetivo
            if (angleDiff > 0.1) moveRight = true;
            if (angleDiff < -0.1) moveLeft = true;
            
            // Acelerar automáticamente
            accelerate = true;
            
            // Correr más rápido si mantiene presionado
            const holdTime = Date.now() - touchStartTime;
            if (holdTime > 500) {
                // Velocidad extra por mantener presionado
                accelerate = true;
            }
        }
    }
    
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