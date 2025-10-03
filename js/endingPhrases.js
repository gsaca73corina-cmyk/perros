// Colección de frases profundas y emotivas para el final del juego
const endingPhrases = [
    "En el silencio de la noche, dos almas se reconocen sin necesidad de palabras. El amor trasciende la oscuridad.",
    "Hay vínculos que ni el tiempo ni la distancia pueden romper. Son los hilos invisibles que conectan corazones destinados a encontrarse.",
    "Cuando todo parece perdido, el amor se convierte en la brújula que nos guía de vuelta a casa.",
    "No existe soledad más profunda que la de un corazón que busca a quien ama. Ni reencuentro más dulce que el de dos almas que se pertenecen.",
    "En cada paso dado en la búsqueda del amor, llevamos la esperanza de que alguien, en algún lugar, también nos está buscando.",
    "El amor verdadero no es solo encontrar a alguien que te complete, sino ser la razón por la que alguien más se siente completo.",
    "Hay momentos en la vida donde el universo conspira para reunir lo que nunca debió separarse.",
    "La lealtad no es una palabra, es una promesa silenciosa que se renueva cada día, cada respiración, cada latido.",
    "En la vastedad del mundo, dos corazones pueden reconocerse como si fueran las únicas estrellas en el cielo nocturno.",
    "El amor incondicional es el único idioma que no necesita traducción. Se entiende con el alma.",
    "Cuando alguien te ama de verdad, nunca estás realmente perdido. Siempre hay un camino de regreso a casa.",
    "Los lazos más fuertes no se ven con los ojos, se sienten con el corazón y se viven con cada fibra del ser.",
    "En un mundo lleno de ruido, el amor verdadero es el silencio que calma el alma y la voz que la despierta.",
    "No hay distancia que pueda medir el amor, ni tiempo que pueda borrarlo. Algunos vínculos son eternos.",
    "El reencuentro de dos almas que se aman es la prueba de que los milagros no son solo historias, sino realidades que esperan suceder.",
    "Amar es elegir a alguien una y otra vez, en cada amanecer, en cada dificultad, en cada momento de duda.",
    "En la oscuridad más profunda, el amor es la única luz que nunca se apaga, la única esperanza que nunca muere.",
    "Hay personas que llegan a tu vida para enseñarte que el hogar no es un lugar, sino un sentimiento.",
    "El amor verdadero no busca ser correspondido, busca ser entregado. Y en esa entrega, encuentra su propia recompensa.",
    "Cuando dos corazones están destinados a estar juntos, el universo entero conspira para que se encuentren.",
    "La lealtad es el arte de amar sin condiciones, de esperar sin garantías, de creer sin evidencias.",
    "En cada búsqueda hay una fe inquebrantable: la certeza de que el amor siempre encuentra su camino de regreso.",
    "No hay nada más poderoso que un corazón que ama sin reservas, que da sin esperar, que perdona sin recordar.",
    "El amor incondicional es la única fuerza en el universo capaz de transformar la desesperanza en esperanza.",
    "Cuando alguien te ama de verdad, su presencia se convierte en tu refugio y su ausencia en tu motivación para seguir adelante.",
    "Los corazones que se aman de verdad nunca se despiden, solo se dicen 'hasta pronto' con la certeza del reencuentro.",
    "En la sinfonía de la vida, el amor verdadero es la melodía que nunca se olvida, la nota que siempre resuena.",
    "Amar es ser vulnerable y valiente al mismo tiempo. Es entregar el corazón sabiendo que puede romperse, pero confiando en que será cuidado.",
    "No hay mapa que pueda guiarte hacia el amor verdadero. Solo el corazón conoce el camino.",
    "El amor incondicional es la única riqueza que se multiplica cuando se comparte y se fortalece cuando se entrega.",
    "En un mundo de conexiones temporales, el amor verdadero es la única constante, el único refugio permanente.",
    "Cuando dos almas se reconocen, el tiempo se detiene y la eternidad comienza en ese instante.",
    "El amor verdadero no es perfecto, pero es auténtico. No es fácil, pero es real. No es temporal, es eterno.",
    "Hay encuentros que cambian el curso de una vida, y reencuentros que la devuelven a su verdadero propósito.",
    "En la búsqueda del amor, cada paso es un acto de fe, cada día es una nueva esperanza, cada momento es una oportunidad.",
    "El amor incondicional es el único regalo que se hace más valioso cada vez que se da.",
    "No hay soledad que pueda resistir la llegada del amor verdadero, ni oscuridad que no se ilumine con su presencia.",
    "Cuando alguien te ama incondicionalmente, su amor se convierte en el espejo donde descubres tu verdadero valor.",
    "El amor verdadero no necesita palabras para expresarse, ni promesas para confirmarse. Se vive, se siente, se es.",
    "En cada acto de amor incondicional, el mundo se vuelve un poco más luminoso, un poco más esperanzador.",
    "Los corazones que se aman de verdad están conectados por hilos invisibles que ni la muerte puede cortar.",
    "El amor incondicional es la única fuerza capaz de sanar heridas que parecían incurables.",
    "Cuando encuentras a alguien que te ama sin condiciones, descubres que el paraíso no es un lugar, sino una persona.",
    "En la vastedad del universo, el amor verdadero es la única certeza, la única verdad absoluta.",
    "Amar incondicionalmente es el acto más valiente que puede realizar un corazón, y el más transformador que puede recibir.",
    "No hay distancia física que pueda separar dos corazones unidos por el amor verdadero. Están conectados más allá del espacio y el tiempo.",
    "El amor incondicional es la única luz que nunca se apaga, la única esperanza que nunca muere, la única verdad que nunca cambia.",
    "Cuando alguien te ama de verdad, su amor se convierte en tu fortaleza en la debilidad, tu luz en la oscuridad, tu paz en la tormenta.",
    "En cada gesto de amor incondicional, se escribe una página de la historia más hermosa jamás contada.",
    "El amor verdadero no es solo un sentimiento, es una decisión que se toma cada día, una promesa que se renueva cada momento."
];

// Mostrar pantalla de frases finales
function showEndingScreen() {
    const endingScreen = document.getElementById('endingScreen');
    const endingPhrase = document.getElementById('endingPhrase');
    const finalTime = document.getElementById('finalTime');
    const currentLevel = document.getElementById('currentLevel');
    const enemyCount = document.getElementById('enemyCount');
    
    // Seleccionar frase aleatoria
    const randomPhrase = endingPhrases[Math.floor(Math.random() * endingPhrases.length)];
    endingPhrase.textContent = randomPhrase;
    
    // Mostrar tiempo final
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    finalTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Mostrar información del nivel
    currentLevel.textContent = gameLevel - 1; // Nivel completado
    enemyCount.textContent = enemyDogs.length;
    
    // Mostrar estadísticas completas
    document.getElementById('totalScoreDisplay').textContent = totalScore;
    document.getElementById('totalReunionsDisplay').textContent = totalReunions;
    document.getElementById('bestTimeDisplay').textContent = bestTime ? `${Math.floor(bestTime / 60)}:${(bestTime % 60).toString().padStart(2, '0')}` : 'N/A';
    document.getElementById('maxStreakDisplay').textContent = maxSurvivalStreak;
    
    // Mostrar pantalla con efecto
    setTimeout(() => {
        endingScreen.style.display = 'flex';
        
        // Efecto de ahogamiento del audio
        const audio = document.getElementById('backgroundMusic');
        const originalVolume = audio.volume;
        const fadeSteps = 50;
        const fadeInterval = 8000 / fadeSteps;
        
        let currentStep = 0;
        const fadeEffect = setInterval(() => {
            currentStep++;
            audio.volume = originalVolume * (1 - (currentStep / fadeSteps) * 0.7);
            
            if (currentStep >= fadeSteps) {
                clearInterval(fadeEffect);
                audio.volume = originalVolume * 0.3;
            }
        }, fadeInterval);
        
        // Reinicio automático después de 8 segundos
        setTimeout(() => {
            endingScreen.style.display = 'none';
            gameActive = false;
            
            // Restaurar volumen del audio y reiniciar
            const audio = document.getElementById('backgroundMusic');
            audio.volume = 0.3;
            
            setTimeout(() => {
                initGame();
            }, 1000);
        }, 8000);
        
    }, 3000);
}