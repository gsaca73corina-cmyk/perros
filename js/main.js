// Actualizar estado del perro
function updateDog() {
    if (!gameActive) return;
    
    // Animación inicial de salto de alegría
    if (dogState.initialJump) {
        dogState.initialJumpTime += 0.016;
        const jumpPhase = dogState.initialJumpTime;
        
        if (jumpPhase < 0.5) {
            const jumpHeight = Math.sin(jumpPhase * Math.PI * 2) * 0.3;
            dog.position.y = 0.28 + jumpHeight;
            
            const tailWag = Math.sin(jumpPhase * 20) * 0.6;
            dog.children[4].rotation.x = Math.PI / 4 + tailWag;
            
            const earWiggle = Math.sin(jumpPhase * 15) * 0.2;
            dog.children[2].rotation.x = Math.PI / 3 + earWiggle;
            dog.children[3].rotation.x = Math.PI / 3 - earWiggle;
        } else if (jumpPhase < 1.0) {
            const circleAngle = (jumpPhase - 0.5) * Math.PI * 4;
            const circleRadius = 0.8;
            dog.position.x = Math.cos(circleAngle) * circleRadius;
            dog.position.z = Math.sin(circleAngle) * circleRadius;
            dog.rotation.y = circleAngle + Math.PI;
            
            const bodyBob = Math.sin(circleAngle * 3) * 0.05;
            dog.children[0].position.y = bodyBob;
        } else if (jumpPhase < 1.5) {
            dog.position.x = 0;
            dog.position.z = 0;
            dog.position.y = 0.28 + Math.sin((jumpPhase - 1.0) * Math.PI) * 0.1;
            dog.rotation.y = 0;
        } else {
            dogState.initialJump = false;
            dog.position.y = 0.28;
        }
    }
    
    // Actualizar temporizador
    gameTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.getElementById('timer').textContent = `Tiempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (dogState.cinematicMode) {
        updateCinematicMode();
        return;
    }
    
    if (dogState.foundMaster) return;
    
    const prevX = dogState.x;
    const prevZ = dogState.z;
    
    // Obtener input del jugador
    const input = getPlayerInput();
    
    // Control de velocidad
    if (input.accelerate) {
        dogState.speed = Math.min(dogState.speed + dogState.acceleration, dogState.maxSpeed);
        dogState.isRunning = true;
    } else if (input.brake) {
        dogState.speed = Math.max(dogState.speed - dogState.acceleration * 2, -dogState.maxSpeed * 0.5);
        dogState.isRunning = false;
    } else {
        if (dogState.speed > 0) {
            dogState.speed = Math.max(dogState.speed - dogState.deceleration, 0);
        } else if (dogState.speed < 0) {
            dogState.speed = Math.min(dogState.speed + dogState.deceleration, 0);
        }
        dogState.isRunning = false;
    }
    
    // Control de giro
    if (input.moveLeft) {
        dogState.angle += dogState.turnSpeed * (dogState.speed > 0.1 ? 1.0 : 0.6);
    }
    if (input.moveRight) {
        dogState.angle -= dogState.turnSpeed * (dogState.speed > 0.1 ? 1.0 : 0.6);
    }
    
    // Mover perro
    dogState.x += Math.sin(dogState.angle) * dogState.speed;
    dogState.z += Math.cos(dogState.angle) * dogState.speed;
    
    // Limitar posición
    const mapLimit = 110;
    dogState.x = Math.max(-mapLimit, Math.min(mapLimit, dogState.x));
    dogState.z = Math.max(-mapLimit, Math.min(mapLimit, dogState.z));
    
    // Ajustar altura al terreno
    const terrainHeight = -0.5 + Math.sin(dogState.x * 0.08) * Math.cos(dogState.z * 0.08) * 0.6 + 
                         Math.sin(dogState.x * 0.04) * Math.cos(dogState.z * 0.06) * 0.4;
    dogState.y = terrainHeight + 0.28;
    
    // Actualizar perros enemigos
    updateEnemyDogs();
    
    // Verificar colisiones
    let collisionDetected = false;
    
    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        if (checkCollision(dogState.x, dogState.z, dogState.radius, tree.x, tree.z, tree.radius)) {
            collisionDetected = true;
            break;
        }
    }
    
    if (!collisionDetected) {
        for (let i = 0; i < bushes.length; i++) {
            const bush = bushes[i];
            if (checkCollision(dogState.x, dogState.z, dogState.radius, bush.x, bush.z, bush.radius)) {
                collisionDetected = true;
                break;
            }
        }
    }
    
    // Verificar colisiones con perros enemigos
    if (!collisionDetected) {
        for (let i = 0; i < enemyDogs.length; i++) {
            const enemy = enemyDogs[i];
            if (checkCollision(dogState.x, dogState.z, dogState.radius, enemy.x, enemy.z, enemy.radius)) {
                gameOver();
                return;
            }
        }
    }
    
    if (collisionDetected) {
        dogState.x = prevX;
        dogState.z = prevZ;
        dogState.speed = 0;
        showImpactEffect();
    }
    
    // Verificar si encontró al amo
    const dxToMaster = dogState.x - masterPosition.x;
    const dzToMaster = dogState.z - masterPosition.z;
    const distanceToMaster = Math.sqrt(dxToMaster * dxToMaster + dzToMaster * dzToMaster);
    
    if (distanceToMaster < 1.8) {
        animateReunion();
    }
    
    // Actualizar posición del perro
    dog.position.x = dogState.x;
    dog.position.y = dogState.y;
    dog.position.z = dogState.z;
    dog.rotation.y = dogState.angle;
    
    // Cambiar estado de ánimo ocasionalmente
    if (Date.now() - dogState.lastMoodChange > 10000) { // Cada 10 segundos
        const moods = ['happy', 'excited', 'curious', 'playful'];
        dogState.mood = moods[Math.floor(Math.random() * moods.length)];
        dogState.lastMoodChange = Date.now();
    }
    
    // Animaciones especiales según distancia al amo
    if (distanceToMaster < 30 && dogState.mood !== 'excited') {
        dogState.mood = 'excited';
        dogAnimationState = 'alert';
    } else if (distanceToMaster > 60 && dogState.mood !== 'curious') {
        dogState.mood = 'curious';
        dogAnimationState = 'sniffing';
    }
    
    // Animar perro
    animateDog();
    
    // Actualizar cámara
    updateCamera();
    
    // Actualizar HUD
    updateHUD(distanceToMaster);
}

// Actualizar modo cinemático con múltiples animaciones aleatorias
function updateCinematicMode() {
    dogState.cinematicTime += 0.016;
    
    switch(dogState.animationType) {
        case 0:
            updateClassicReunion();
            break;
        case 1:
            updatePlayfulReunion();
            break;
        case 2:
            updateEmotionalReunion();
            break;
        case 3:
            updateEnergeticReunion();
            break;
    }
}

// Animación clásica (original)
function updateClassicReunion() {
    if (dogState.cinematicTime < 0.8) {
        const t = dogState.cinematicTime / 0.8;
        dog.position.x = dogState.x * (1 - t) + (masterPosition.x - 1.5) * t;
        dog.position.z = dogState.z * (1 - t) + masterPosition.z * t;
        
        const jumpHeight = Math.sin(dogState.cinematicTime * 15) * 0.2;
        dog.position.y = 0.28 + jumpHeight;
        
        const tailWag = Math.sin(dogState.cinematicTime * 40) * 0.9;
        dog.children[4].rotation.x = Math.PI / 4 + tailWag;
        
        camera.position.x = dog.position.x - Math.sin(dogState.angle) * 4;
        camera.position.z = dog.position.z - Math.cos(dogState.angle) * 4;
        camera.position.y = dog.position.y + 2;
        camera.lookAt(dog.position.x, dog.position.y, dog.position.z);
    } else {
        dog.position.x = masterPosition.x - 0.3;
        dog.position.z = masterPosition.z;
        dog.position.y = 0.5;
        person.rotation.x = 0.5;
        
        camera.position.x = masterPosition.x - 0.8;
        camera.position.y = 1;
        camera.position.z = masterPosition.z + 1;
        camera.lookAt(masterPosition.x, 0.7, masterPosition.z);
    }
}

// Animación juguetona
function updatePlayfulReunion() {
    if (dogState.cinematicTime < 1.0) {
        // Zigzag hacia el amo
        const t = dogState.cinematicTime;
        const zigzag = Math.sin(t * 12) * 2;
        dog.position.x = dogState.x * (1 - t) + (masterPosition.x + zigzag) * t;
        dog.position.z = dogState.z * (1 - t) + masterPosition.z * t;
        
        // Saltos locos
        const jumpHeight = Math.abs(Math.sin(t * 20)) * 0.4;
        dog.position.y = 0.28 + jumpHeight;
        
        // Rotaciones en el aire
        dog.rotation.z = Math.sin(t * 15) * 0.3;
        
        camera.position.x = dog.position.x - 3;
        camera.position.y = 2;
        camera.position.z = dog.position.z + 2;
        camera.lookAt(dog.position.x, dog.position.y, dog.position.z);
    } else {
        // Rodando en el suelo de felicidad
        dog.position.x = masterPosition.x - 1;
        dog.position.z = masterPosition.z;
        dog.position.y = 0.1;
        dog.rotation.z = dogState.cinematicTime * 3;
        
        camera.position.x = masterPosition.x - 2;
        camera.position.y = 1.5;
        camera.position.z = masterPosition.z + 1;
        camera.lookAt(dog.position.x, dog.position.y, dog.position.z);
    }
}

// Animación emocional
function updateEmotionalReunion() {
    if (dogState.cinematicTime < 1.2) {
        // Acercamiento lento y cauteloso
        const t = dogState.cinematicTime / 1.2;
        dog.position.x = dogState.x * (1 - t) + (masterPosition.x - 2) * t;
        dog.position.z = dogState.z * (1 - t) + masterPosition.z * t;
        dog.position.y = 0.28;
        
        // Cabeza baja, inseguro
        dog.children[1].rotation.x = 0.2;
        
        // Cola baja pero moviéndose
        const tailWag = Math.sin(dogState.cinematicTime * 8) * 0.3;
        dog.children[4].rotation.x = Math.PI / 6 + tailWag;
        
        camera.position.x = dog.position.x - 2;
        camera.position.y = 1;
        camera.position.z = dog.position.z + 2;
        camera.lookAt(dog.position.x, dog.position.y, dog.position.z);
    } else {
        // Explosión de felicidad
        dog.position.x = masterPosition.x - 0.2;
        dog.position.z = masterPosition.z;
        
        const jumpHeight = Math.abs(Math.sin((dogState.cinematicTime - 1.2) * 10)) * 0.5;
        dog.position.y = 0.28 + jumpHeight;
        
        // Cola frenética
        const tailWag = Math.sin(dogState.cinematicTime * 50) * 1.2;
        dog.children[4].rotation.x = Math.PI / 4 + tailWag;
        
        person.rotation.x = 0.4;
        
        camera.position.x = masterPosition.x - 1;
        camera.position.y = 1.2;
        camera.position.z = masterPosition.z + 1;
        camera.lookAt(masterPosition.x, 0.8, masterPosition.z);
    }
}

// Animación energética
function updateEnergeticReunion() {
    if (dogState.cinematicTime < 0.6) {
        // Sprint directo
        const t = dogState.cinematicTime / 0.6;
        dog.position.x = dogState.x * (1 - t) + (masterPosition.x - 1) * t;
        dog.position.z = dogState.z * (1 - t) + masterPosition.z * t;
        
        // Cuerpo bajo, corriendo rápido
        dog.position.y = 0.2;
        dog.children[0].scale.y = 0.8;
        
        camera.position.x = dog.position.x - Math.sin(dogState.angle) * 5;
        camera.position.z = dog.position.z - Math.cos(dogState.angle) * 5;
        camera.position.y = dog.position.y + 1.5;
        camera.lookAt(dog.position.x, dog.position.y, dog.position.z);
    } else if (dogState.cinematicTime < 2.0) {
        // Círculos rápidos alrededor del amo
        const circleTime = (dogState.cinematicTime - 0.6) / 1.4;
        const angle = circleTime * Math.PI * 8;
        const radius = 1.5;
        
        dog.position.x = masterPosition.x + Math.cos(angle) * radius;
        dog.position.z = masterPosition.z + Math.sin(angle) * radius;
        dog.rotation.y = angle + Math.PI / 2;
        
        const jumpHeight = Math.abs(Math.sin(angle * 3)) * 0.3;
        dog.position.y = 0.28 + jumpHeight;
        
        camera.position.x = masterPosition.x;
        camera.position.y = 3;
        camera.position.z = masterPosition.z + 3;
        camera.lookAt(masterPosition.x, 1, masterPosition.z);
    } else {
        // Salto final al amo
        dog.position.x = masterPosition.x - 0.1;
        dog.position.z = masterPosition.z;
        dog.position.y = 0.6;
        
        person.rotation.x = 0.6;
        
        camera.position.x = masterPosition.x - 0.5;
        camera.position.y = 0.8;
        camera.position.z = masterPosition.z + 0.5;
        camera.lookAt(masterPosition.x, 0.5, masterPosition.z);
    }
}

// Actualizar cámara
function updateCamera() {
    const cameraDistance = 3.8;
    const cameraHeight = 2.0;
    
    camera.position.x = dogState.x - Math.sin(dogState.angle) * cameraDistance;
    camera.position.z = dogState.z - Math.cos(dogState.angle) * cameraDistance;
    camera.position.y = dogState.y + cameraHeight;
    
    camera.lookAt(dogState.x, dogState.y + 0.3, dogState.z);
}

// Actualizar HUD
function updateHUD(distanceToMaster) {
    document.getElementById('speedValue').textContent = Math.abs(Math.round(dogState.speed * 20)) + ' km/h';
    document.getElementById('directionValue').textContent = Math.round((dogState.angle * 180 / Math.PI + 360) % 360) + '°';
    document.getElementById('distanceValue').textContent = Math.round(distanceToMaster) + ' m';
    document.getElementById('scoreValue').textContent = totalScore;
    document.getElementById('streakValue').textContent = survivalStreak;
    
    // Actualizar indicador de dirección
    const directionIndicator = document.getElementById('directionIndicator');
    if (distanceToMaster > 70) {
        directionIndicator.textContent = "¡Tu amo está muy lejos! Explora todo el bosque";
    } else if (distanceToMaster > 40) {
        directionIndicator.textContent = "¡Tu amo está lejos! Sigue las pistas";
    } else if (distanceToMaster > 20) {
        directionIndicator.textContent = "¡Tu amo está cerca! ¡No te rindas!";
    } else if (distanceToMaster > 10) {
        directionIndicator.textContent = "¡Muy cerca! ¡Tu amo está aquí!";
    } else {
        directionIndicator.textContent = "¡Casi lo encuentras!";
    }
    
    // Actualizar flecha indicadora
    updateDirectionArrow(distanceToMaster);
}

// Actualizar flecha de dirección
function updateDirectionArrow(distanceToMaster) {
    const masterArrow = document.getElementById('masterArrow');
    const masterAngle = Math.atan2(masterPosition.x - dogState.x, masterPosition.z - dogState.z);
    const angleDiff = masterAngle - dogState.angle;
    const normalizedAngle = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
    
    if (Math.abs(normalizedAngle) < Math.PI / 8) {
        masterArrow.textContent = "↑";
    } else if (normalizedAngle > Math.PI / 8 && normalizedAngle <= 3 * Math.PI / 8) {
        masterArrow.textContent = "↗";
    } else if (normalizedAngle > 3 * Math.PI / 8 && normalizedAngle <= 5 * Math.PI / 8) {
        masterArrow.textContent = "→";
    } else if (normalizedAngle > 5 * Math.PI / 8 && normalizedAngle <= 7 * Math.PI / 8) {
        masterArrow.textContent = "↘";
    } else if (normalizedAngle > 7 * Math.PI / 8 || normalizedAngle <= -7 * Math.PI / 8) {
        masterArrow.textContent = "↓";
    } else if (normalizedAngle > -7 * Math.PI / 8 && normalizedAngle <= -5 * Math.PI / 8) {
        masterArrow.textContent = "↙";
    } else if (normalizedAngle > -5 * Math.PI / 8 && normalizedAngle <= -3 * Math.PI / 8) {
        masterArrow.textContent = "←";
    } else if (normalizedAngle > -3 * Math.PI / 8 && normalizedAngle <= -Math.PI / 8) {
        masterArrow.textContent = "↖";
    } else {
        masterArrow.textContent = "↑";
    }
}

// Función para iniciar música
function startBackgroundMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(e => console.log('No se pudo reproducir la música automáticamente'));
    

}

// Mostrar pantalla de bienvenida después de la marca
function showWelcome() {
    document.getElementById('brandScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'flex';
    playGhostFragment();
}

// Mostrar pantalla de controles
function showControls() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('controlsScreen').style.display = 'flex';
    playGhostFragment();
}

// Mostrar pantalla de mecánicas de juego
function showGameplay() {
    document.getElementById('controlsScreen').style.display = 'none';
    document.getElementById('gameplayScreen').style.display = 'flex';
    playGhostFragment();
}

// Mostrar pantalla de consejos
function showTips() {
    document.getElementById('gameplayScreen').style.display = 'none';
    document.getElementById('tipsScreen').style.display = 'flex';
    playGhostFragment();
}

// Iniciar el juego
function startGame() {
    stopGhostMusic();
    document.getElementById('tipsScreen').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    startBackgroundMusic();
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        initGame();
    }, 1500);
}

// Reproducir sonido DING
function playBrandDing() {
    const dingSound = document.getElementById('dingSound');
    dingSound.volume = 0.5;
    dingSound.play().catch(e => console.log('No se pudo reproducir el sonido DING'));
}

// Variable para controlar si ya se inició la música fantasma
let ghostMusicStarted = false;
let ghostStartTime = 0;

// Reproducir fragmento fantasma aleatorio
function playGhostFragment() {
    const ghostMusic = document.getElementById('ghostMusic');
    
    if (!ghostMusicStarted) {
        const duration = ghostMusic.duration || 180;
        ghostStartTime = Math.random() * (duration - 30);
        ghostMusic.currentTime = ghostStartTime;
        ghostMusicStarted = true;
    }
    
    ghostMusic.volume = 0.15;
    ghostMusic.playbackRate = 0.8;
    
    ghostMusic.play().catch(e => console.log('No se pudo reproducir fragmento fantasma'));
}

// Detener música fantasma
function stopGhostMusic() {
    const ghostMusic = document.getElementById('ghostMusic');
    ghostMusic.pause();
    ghostMusic.currentTime = 0;
    ghostMusicStarted = false;
}

// Función de game over cuando te atrapan
function gameOver() {
    gameActive = false;
    dogState.speed = 0;
    
    // Resetear racha
    survivalStreak = 0;
    
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverTime = document.getElementById('gameOverTime');
    const gameOverLevel = document.getElementById('gameOverLevel');
    const audio = document.getElementById('backgroundMusic');
    
    // Fade out suave del audio
    const originalVolume = audio.volume;
    const fadeSteps = 30;
    const fadeInterval = 1000 / fadeSteps;
    let currentStep = 0;
    
    const fadeOutEffect = setInterval(() => {
        currentStep++;
        audio.volume = originalVolume * (1 - (currentStep / fadeSteps));
        
        if (currentStep >= fadeSteps) {
            clearInterval(fadeOutEffect);
            audio.volume = 0;
        }
    }, fadeInterval);
    
    // Mostrar tiempo y nivel
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    gameOverTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    gameOverLevel.textContent = gameLevel;
    
    // Mostrar pantalla de game over con fade in
    setTimeout(() => {
        gameOverScreen.style.display = 'flex';
        gameOverScreen.style.opacity = '0';
        
        // Fade in de la pantalla
        let opacity = 0;
        const fadeInScreen = setInterval(() => {
            opacity += 0.05;
            gameOverScreen.style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(fadeInScreen);
            }
        }, 50);
        
        // Reiniciar automáticamente después de 5 segundos
        setTimeout(() => {
            // Fade out de la pantalla
            let fadeOpacity = 1;
            const fadeOutScreen = setInterval(() => {
                fadeOpacity -= 0.05;
                gameOverScreen.style.opacity = fadeOpacity;
                if (fadeOpacity <= 0) {
                    clearInterval(fadeOutScreen);
                    gameOverScreen.style.display = 'none';
                    
                    // Fade in suave del audio al reiniciar
                    audio.volume = 0;
                    const fadeInSteps = 40;
                    const fadeInInterval = 2000 / fadeInSteps;
                    let fadeInStep = 0;
                    
                    const fadeInEffect = setInterval(() => {
                        fadeInStep++;
                        audio.volume = originalVolume * (fadeInStep / fadeInSteps);
                        
                        if (fadeInStep >= fadeInSteps) {
                            clearInterval(fadeInEffect);
                            audio.volume = originalVolume;
                        }
                    }, fadeInInterval);
                    
                    // Mantener el nivel actual, no reiniciar desde 0
                    initGame();
                }
            }, 50);
        }, 5000);
    }, 1000);
}

// Mostrar notificación de logro
function showAchievement(message) {
    const notification = document.getElementById('achievementNotification');
    notification.textContent = `🏆 ${message}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Verificar logros
function checkAchievements() {
    if (totalReunions === 5) {
        showAchievement('Reencuentros Múltiples: 5 reuniones');
    }
    if (totalReunions === 10) {
        showAchievement('Maestro del Reencuentro: 10 reuniones');
    }
    if (survivalStreak === 3) {
        showAchievement('Racha Perfecta: 3 seguidas');
    }
    if (survivalStreak === 5) {
        showAchievement('Imparable: 5 seguidas');
    }
    if (gameLevel === 6) {
        showAchievement('Nivel Máximo Alcanzado');
    }
    if (gameTime < 60) {
        showAchievement('Velocista: Menos de 1 minuto');
    }
    if (totalScore >= 1000) {
        showAchievement('Mil Puntos Alcanzados');
    }
}

// Actualizar perros enemigos
function updateEnemyDogs() {
    const currentTime = Date.now();
    
    for (let i = 0; i < enemyDogs.length; i++) {
        const enemy = enemyDogs[i];
        const distanceToPlayer = Math.sqrt(
            Math.pow(enemy.x - dogState.x, 2) + Math.pow(enemy.z - dogState.z, 2)
        );
        
        // Sistema de cansancio
        const isTired = currentTime - enemy.tiredTime < enemy.restDuration;
        
        // Decidir si perseguir al jugador
        if (distanceToPlayer < enemy.chaseDistance && !enemy.chasing && !isTired) {
            enemy.chasing = true;
        } else if (distanceToPlayer > enemy.chaseDistance * 1.3 && enemy.chasing) {
            enemy.chasing = false;
            enemy.tiredTime = currentTime; // Iniciar tiempo de descanso
        }
        
        if (enemy.chasing) {
            // Perseguir al jugador de forma desafiante pero escapable
            const angleToPlayer = Math.atan2(dogState.x - enemy.x, dogState.z - enemy.z);
            enemy.angle = angleToPlayer;
            
            // Velocidad agresiva pero escapable
            if (distanceToPlayer < enemy.aggressiveDistance) {
                enemy.speed = 0.75; // Muy rápido cuando está cerca
            } else {
                enemy.speed = 0.55; // Rápido cuando persigue
            }
        } else {
            // Patrullar alrededor del punto central
            if (currentTime - enemy.lastDirectionChange > 3000) {
                const distanceToCenter = Math.sqrt(
                    Math.pow(enemy.x - enemy.centerX, 2) + Math.pow(enemy.z - enemy.centerZ, 2)
                );
                
                if (distanceToCenter > enemy.patrolRadius) {
                    // Regresar al centro
                    enemy.angle = Math.atan2(enemy.centerX - enemy.x, enemy.centerZ - enemy.z);
                } else {
                    // Cambiar dirección aleatoriamente
                    enemy.angle += (Math.random() - 0.5) * Math.PI;
                }
                
                enemy.lastDirectionChange = currentTime;
                enemy.speed = 0.3 + Math.random() * 0.2;
            }
        }
        
        // Mover enemigo
        const prevX = enemy.x;
        const prevZ = enemy.z;
        enemy.x += Math.sin(enemy.angle) * enemy.speed;
        enemy.z += Math.cos(enemy.angle) * enemy.speed;
        
        // Verificar colisiones con árboles y arbustos
        let enemyCollision = false;
        for (const tree of trees) {
            if (checkCollision(enemy.x, enemy.z, enemy.radius, tree.x, tree.z, tree.radius)) {
                enemyCollision = true;
                break;
            }
        }
        
        if (!enemyCollision) {
            for (const bush of bushes) {
                if (checkCollision(enemy.x, enemy.z, enemy.radius, bush.x, bush.z, bush.radius)) {
                    enemyCollision = true;
                    break;
                }
            }
        }
        
        if (enemyCollision) {
            enemy.x = prevX;
            enemy.z = prevZ;
            enemy.angle += Math.PI; // Dar la vuelta
        }
        
        // Actualizar posición del mesh
        enemy.mesh.position.x = enemy.x;
        enemy.mesh.position.z = enemy.z;
        enemy.mesh.rotation.y = enemy.angle;
        
        // Animación de cola y orejas agresivas
        const aggressiveTail = Math.sin(currentTime * 0.02) * 0.3;
        enemy.mesh.children[4].rotation.x = Math.PI / 6 + aggressiveTail;
    }
}

// Iniciar el juego cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', () => {
    setupTouchControls();
    
    // Reproducir sonido DING sintético después de un delay
    setTimeout(() => {
        playBrandDing();
    }, 500);
    
    // Auto-avanzar desde la pantalla de marca después de 2.5 segundos
    setTimeout(() => {
        showWelcome();
    }, 2500);
});