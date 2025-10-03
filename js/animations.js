// Sistema de animación avanzado para el perro
function animateDog() {
    if (!dog) return;
    
    const currentTime = Date.now() * 0.001;
    
    if (dogState.speed === 0) {
        // Cambiar estado de animación cada cierto tiempo
        if (currentTime - lastAnimationChange > 3) {
            dogAnimationState = getRandomIdleAnimation();
            lastAnimationChange = currentTime;
        }
        
        // Ejecutar animación según estado
        switch(dogAnimationState) {
            case 'breathing':
                animateBreathing(currentTime);
                break;
            case 'sniffing':
                animateSniffing(currentTime);
                break;
            case 'looking':
                animateLookingAround(currentTime);
                break;
            case 'scratching':
                animateScratching(currentTime);
                break;
            case 'sitting':
                animateSitting(currentTime);
                break;
            case 'playing':
                animatePlaying(currentTime);
                break;
            case 'alert':
                animateAlert(currentTime);
                break;
            default:
                animateBreathing(currentTime);
        }
        
        return;
    }
    
    // Resetear estado idle cuando se mueve
    dogAnimationState = 'moving';
    
    // Actualizar ciclo de caminata
    walkCycle += dogState.speed * 0.8;
    
    // Determinar tipo de animación según la velocidad
    if (dogState.speed < 0.3) {
        animateWalkSlow(walkCycle);
    } else if (dogState.speed < 0.7) {
        animateWalkNormal(walkCycle);
    } else {
        animateRunFast(walkCycle, currentTime);
    }
    
    // Animaciones secundarias que siempre ocurren
    animateSecondary(currentTime);
}

// Obtener animación idle aleatoria
function getRandomIdleAnimation() {
    const animations = ['breathing', 'sniffing', 'looking', 'scratching', 'sitting', 'playing', 'alert'];
    return animations[Math.floor(Math.random() * animations.length)];
}

// Animación de respiración
function animateBreathing(currentTime) {
    const breath = Math.sin(currentTime * 2) * 0.02;
    dog.children[0].scale.y = 1.0 + breath;
    
    // Cola relajada
    const tailSway = Math.sin(currentTime * 1.5) * 0.1;
    dog.children[4].rotation.x = Math.PI / 4 + tailSway;
}

// Animación de olfateo
function animateSniffing(currentTime) {
    sniffTimer += 0.016;
    
    // Cabeza hacia abajo
    dog.children[1].rotation.x = -0.3 + Math.sin(sniffTimer * 8) * 0.1;
    
    // Nariz moviéndose
    const sniff = Math.sin(sniffTimer * 12) * 0.02;
    dog.children[2].position.z = 0.75 + sniff;
    
    // Orejas atentas
    dog.children[5].rotation.x = Math.PI / 4;
    dog.children[6].rotation.x = Math.PI / 4;
    
    // Cola curiosa
    const tailWag = Math.sin(sniffTimer * 4) * 0.2;
    dog.children[4].rotation.x = Math.PI / 4 + tailWag;
}

// Animación mirando alrededor
function animateLookingAround(currentTime) {
    // Cabeza girando
    const lookDirection = Math.sin(currentTime * 0.8) * 0.4;
    dog.children[1].rotation.y = lookDirection;
    
    // Orejas siguiendo la dirección
    const earTilt = lookDirection * 0.3;
    dog.children[5].rotation.z = earTilt;
    dog.children[6].rotation.z = -earTilt;
    
    // Cola alerta
    dog.children[4].rotation.x = Math.PI / 3;
}

// Animación de rascado
function animateScratching(currentTime) {
    const scratchCycle = Math.sin(currentTime * 8);
    
    // Pata trasera rascando
    if (scratchCycle > 0) {
        dog.children[10].rotation.x = Math.sin(currentTime * 15) * 0.5;
        dog.children[10].position.y = -0.28 + Math.abs(Math.sin(currentTime * 15)) * 0.1;
    }
    
    // Cabeza inclinada
    dog.children[1].rotation.z = 0.2;
    
    // Cola moviéndose por el esfuerzo
    const tailWag = Math.sin(currentTime * 6) * 0.3;
    dog.children[4].rotation.x = Math.PI / 4 + tailWag;
}

// Animación sentado
function animateSitting(currentTime) {
    // Cuerpo más bajo
    dog.position.y = dogState.y - 0.1;
    
    // Patas traseras dobladas
    dog.children[9].rotation.x = -0.5;
    dog.children[10].rotation.x = -0.5;
    
    // Cola envuelta
    dog.children[4].rotation.x = Math.PI / 6;
    dog.children[4].rotation.z = 0.3;
    
    // Respiración tranquila
    const breath = Math.sin(currentTime * 1.5) * 0.015;
    dog.children[0].scale.y = 1.0 + breath;
}

// Animación jugando
function animatePlaying(currentTime) {
    playTimer += 0.016;
    
    // Posición de juego (agachado adelante)
    dog.children[1].position.y = 0.0; // Cabeza baja
    dog.children[0].rotation.x = -0.2; // Cuerpo inclinado
    
    // Patas delanteras extendidas
    dog.children[7].rotation.x = -0.3;
    dog.children[8].rotation.x = -0.3;
    
    // Cola muy activa
    const tailWag = Math.sin(playTimer * 12) * 0.8;
    dog.children[4].rotation.x = Math.PI / 4 + tailWag;
    
    // Pequeños saltos
    const bounce = Math.abs(Math.sin(playTimer * 3)) * 0.05;
    dog.position.y = dogState.y + bounce;
}

// Animación alerta
function animateAlert(currentTime) {
    // Postura erécta
    dog.children[1].position.y = 0.1; // Cabeza alta
    
    // Orejas muy eréctas
    dog.children[5].rotation.x = Math.PI / 6;
    dog.children[6].rotation.x = Math.PI / 6;
    
    // Cola rígida
    dog.children[4].rotation.x = Math.PI / 3;
    
    // Ligero temblor de alerta
    const alertTremor = Math.sin(currentTime * 20) * 0.005;
    dog.children[0].position.x = alertTremor;
    
    // Ojos muy abiertos
    dog.children[3].scale.set(1.2, 1.2, 1.2);
    dog.children[4].scale.set(1.2, 1.2, 1.2);
}

// Animación de caminata lenta
function animateWalkSlow(cycle) {
    const frontLegOffset = Math.sin(cycle) * 0.05;
    const backLegOffset = Math.sin(cycle + Math.PI) * 0.05;
    
    // Patas
    dog.children[5].position.y = -0.28 + frontLegOffset;
    dog.children[6].position.y = -0.28 - frontLegOffset;
    dog.children[7].position.y = -0.28 + backLegOffset;
    dog.children[8].position.y = -0.28 - backLegOffset;
    
    // Cuerpo balanceándose suavemente
    const bodyBob = Math.sin(cycle * 2) * 0.02;
    dog.children[0].position.y = bodyBob;
    
    // Cabeza asintiendo ligeramente
    const headNod = Math.sin(cycle * 2) * 0.03;
    dog.children[1].position.y = 0.05 + headNod;
}

// Animación de caminata normal
function animateWalkNormal(cycle) {
    const frontLegOffset = Math.sin(cycle) * 0.08;
    const backLegOffset = Math.sin(cycle + Math.PI) * 0.08;
    
    // Patas con mayor amplitud
    dog.children[5].position.y = -0.28 + frontLegOffset;
    dog.children[6].position.y = -0.28 - frontLegOffset;
    dog.children[7].position.y = -0.28 + backLegOffset;
    dog.children[8].position.y = -0.28 - backLegOffset;
    
    // Cuerpo con más movimiento
    const bodyBob = Math.sin(cycle * 2) * 0.04;
    dog.children[0].position.y = bodyBob;
    
    // Cabeza con más movimiento
    const headNod = Math.sin(cycle * 2) * 0.06;
    dog.children[1].position.y = 0.05 + headNod;
    
    // Cola moviéndose con energía
    const tailWag = Math.sin(cycle * 3) * 0.4;
    dog.children[4].rotation.x = Math.PI / 4 + tailWag;
}

// Animación de carrera rápida
function animateRunFast(cycle, currentTime) {
    const frontLegOffset = Math.sin(cycle * 1.5) * 0.12;
    const backLegOffset = Math.sin(cycle * 1.5 + Math.PI) * 0.12;
    
    // Patas con gran amplitud y velocidad
    dog.children[5].position.y = -0.28 + frontLegOffset;
    dog.children[6].position.y = -0.28 - frontLegOffset;
    dog.children[7].position.y = -0.28 + backLegOffset;
    dog.children[8].position.y = -0.28 - backLegOffset;
    
    // Cuerpo bajo y aerodinámico
    dog.children[0].position.y = -0.05;
    dog.children[0].scale.y = 0.9;
    
    // Cabeza extendida hacia adelante
    dog.children[1].position.z = 0.6;
    dog.children[1].position.y = 0.0;
    
    // Orejas hacia atrás por la velocidad
    const speedFactor = (dogState.speed - 0.7) * 0.8;
    dog.children[2].rotation.x = Math.PI / 3 - speedFactor;
    dog.children[3].rotation.x = Math.PI / 3 - speedFactor;
    
    // Cola rígida y extendida
    dog.children[4].rotation.x = Math.PI / 6;
    
    // Ojos más abiertos (simulado con escala)
    dog.children[9].scale.set(1.2, 1.2, 1.2);
    dog.children[10].scale.set(1.2, 1.2, 1.2);
}

// Animaciones secundarias que ocurren independientemente
function animateSecondary(currentTime) {
    // Parpadeo ocasional
    const blinkChance = Math.sin(currentTime * 5) > 0.95;
    if (blinkChance) {
        dog.children[9].scale.y = 0.1;
        dog.children[10].scale.y = 0.1;
    } else if (dog.children[9].scale.y < 1.0) {
        dog.children[9].scale.y = 1.0;
        dog.children[10].scale.y = 1.0;
    }
    
    // Movimiento de nariz (olfateando)
    const sniff = Math.sin(currentTime * 8) * 0.01;
    dog.children[7].position.z = 0.75 + sniff;
    
    // Movimiento de cola ocasional (cuando no está corriendo)
    if (dogState.speed < 0.7) {
        const tailWag = Math.sin(currentTime * 4 + Math.sin(currentTime * 2) * 2) * 0.2;
        dog.children[4].rotation.x = Math.PI / 4 + tailWag;
    }
}

// Función para animación de reencuentro mejorada con más animaciones
function animateReunion() {
    dogState.foundMaster = true;
    dogState.cinematicMode = true;
    dogState.cinematicTime = 0;
    dogState.reunionPhase = 0;
    
    // Seleccionar animación aleatoria
    dogState.animationType = Math.floor(Math.random() * 4); // 0-3 diferentes animaciones
    
    // Calcular puntuación
    const timeBonus = Math.max(0, 300 - gameTime); // Bonus por velocidad
    const levelBonus = gameLevel * 100; // Bonus por nivel
    const enemyBonus = enemyDogs.length * 50; // Bonus por enemigos evitados
    const currentScore = timeBonus + levelBonus + enemyBonus;
    
    totalScore += currentScore;
    totalReunions++;
    survivalStreak++;
    maxSurvivalStreak = Math.max(maxSurvivalStreak, survivalStreak);
    
    // Verificar mejor tiempo
    if (!bestTime || gameTime < bestTime) {
        bestTime = gameTime;
        showAchievement('¡Nuevo Récord de Tiempo!');
    }
    
    // Verificar logros
    checkAchievements();
    
    // Incrementar dificultad
    gamesCompleted++;
    gameLevel = Math.min(gamesCompleted + 1, 6); // Máximo nivel 6
    
    const victoryMessage = document.getElementById('victoryMessage');
    const directionIndicator = document.getElementById('directionIndicator');
    
    victoryMessage.innerHTML = `¡Encontraste a tu amo! 🐕❤️<br><small>+${currentScore} puntos | Nivel ${gameLevel}</small>`;
    victoryMessage.style.display = 'block';
    
    // Ocultar mensajes durante la animación final
    setTimeout(() => {
        victoryMessage.style.display = 'none';
        directionIndicator.style.display = 'none';
    }, 2000);
    
    // Mostrar pantalla de frases después de las animaciones
    if (victoryTimeout) clearTimeout(victoryTimeout);
    showEndingScreen();
}

// Función para mostrar efecto de impacto
function showImpactEffect() {
    const impactEffect = document.getElementById('impactEffect');
    impactEffect.style.opacity = '0.6';
    impactEffect.style.transition = 'opacity 0.8s ease-out';
    
    setTimeout(() => {
        impactEffect.style.opacity = '0';
    }, 100);
}