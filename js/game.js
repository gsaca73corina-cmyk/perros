// Inicializar el juego
async function initGame() {
    try {
        // Cargar Three.js
        await loadThreeJS();
        
        // Verificar soporte WebGL
        if (!checkWebGLSupport()) {
            document.getElementById('loading').textContent = 'Tu navegador no soporta WebGL. Por favor, usa un navegador moderno.';
            return;
        }
        
        // Limpiar escena anterior si existe
        if (scene) {
            while(scene.children.length > 0) { 
                scene.remove(scene.children[0]); 
            }
            if (renderer) renderer.dispose();
        }
        
        // Ajustar canvas al tamaño de la pantalla
        const canvas = document.getElementById('gameCanvas');
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Inicializar Three.js
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000033);
        
        // Configuración de luces
        const ambientLight = new THREE.AmbientLight(0x444466, 0.5);
        scene.add(ambientLight);
        
        const moonLight = new THREE.DirectionalLight(0x88AAFF, 0.6);
        moonLight.position.set(10, 20, 10).normalize();
        scene.add(moonLight);
        
        masterLight = new THREE.PointLight(0xFFFF88, 2.0, 40);
        masterLight.position.set(0, 2, 0);
        scene.add(masterLight);
        
        // Crear perro
        dog = createDog();
        scene.add(dog);
        
        // Crear terreno
        createTerrain();
        
        // Crear vegetación
        createVegetation();
        
        // Crear el amo
        createMaster();
        
        // Crear perros enemigos
        createEnemyDogs();
        
        // Crear cielo nocturno
        createNightSky();
        
        // Inicializar estado del perro
        initDogState();
        
        // Ocultar mensaje de victoria
        document.getElementById('victoryMessage').style.display = 'none';
        
        // Iniciar bucle principal
        animate();
        
    } catch (error) {
        document.getElementById('loading').textContent = 'Error al cargar la aventura: ' + error.message;
        console.error('Error al inicializar la aventura:', error);
    }
}

// Crear terreno
function createTerrain() {
    const groundSize = 250;
    const groundSegments = 100;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, groundSegments, groundSegments);
    const groundVertices = groundGeometry.attributes.position.array;
    
    for (let i = 0; i < groundVertices.length; i += 3) {
        const x = groundVertices[i];
        const z = groundVertices[i + 1];
        const height = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 0.6 + 
                      Math.sin(x * 0.04) * Math.cos(z * 0.06) * 0.4 +
                      (Math.random() - 0.5) * 0.25;
        groundVertices[i + 2] = height;
    }
    
    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();
    
    // Textura del terreno
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 512;
    groundCanvas.height = 512;
    const groundCtx = groundCanvas.getContext('2d');
    
    groundCtx.fillStyle = '#4B3621';
    groundCtx.fillRect(0, 0, 512, 512);
    
    // Pasto
    for (let i = 0; i < 100; i++) {
        const centerX = Math.random() * 512;
        const centerY = Math.random() * 512;
        const radius = 20 + Math.random() * 35;
        const gradient = groundCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, '#2A522A');
        gradient.addColorStop(1, '#1E3B1E');
        groundCtx.fillStyle = gradient;
        groundCtx.beginPath();
        groundCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        groundCtx.fill();
    }
    
    // Detalles de tierra
    for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 5 + 1;
        const alpha = Math.random() * 0.4 + 0.2;
        groundCtx.fillStyle = `rgba(${Math.floor(75 + Math.random() * 35)}, ${Math.floor(55 + Math.random() * 30)}, ${Math.floor(35 + Math.random() * 25)}, ${alpha})`;
        groundCtx.beginPath();
        groundCtx.arc(x, y, size, 0, Math.PI * 2);
        groundCtx.fill();
    }
    
    const groundTexture = new THREE.CanvasTexture(groundCanvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        map: groundTexture,
        roughness: 0.8,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    scene.add(ground);
    
    // Senderos
    createTrails();
}

// Crear senderos
function createTrails() {
    const trailMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x5D4037,
        roughness: 0.8,
        metalness: 0.1
    });
    
    const trail1Geometry = new THREE.RingGeometry(30, 32, 64);
    const trail1 = new THREE.Mesh(trail1Geometry, trailMaterial);
    trail1.rotation.x = -Math.PI / 2;
    trail1.position.y = -0.49;
    scene.add(trail1);
    
    const trail2Geometry = new THREE.PlaneGeometry(6, 50);
    const trail2 = new THREE.Mesh(trail2Geometry, trailMaterial);
    trail2.rotation.x = -Math.PI / 2;
    trail2.rotation.z = Math.PI / 4;
    trail2.position.set(25, -0.49, 25);
    scene.add(trail2);
    
    const trail3Geometry = new THREE.PlaneGeometry(5, 40);
    const trail3 = new THREE.Mesh(trail3Geometry, trailMaterial);
    trail3.rotation.x = -Math.PI / 2;
    trail3.rotation.z = -Math.PI / 3;
    trail3.position.set(-20, -0.49, -30);
    scene.add(trail3);
}

// Crear vegetación
function createVegetation() {
    // Árboles
    trees = [];
    const treeTypes = [
        { trunkColor: 0x4B3621, leafColor: 0x2A522A, trunkHeight: 3.0, leafRadius: 1.2 },
        { trunkColor: 0x5D4037, leafColor: 0x1E3B1E, trunkHeight: 3.8, leafRadius: 1.5 },
        { trunkColor: 0x3E2723, leafColor: 0x1B3B1B, trunkHeight: 2.5, leafRadius: 1.0 },
        { trunkColor: 0x6D4C41, leafColor: 0x2B4B2B, trunkHeight: 3.5, leafRadius: 1.3 }
    ];
    
    for (let i = 0; i < 200; i++) {
        const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
        const tree = createRealisticTree(
            treeType.trunkColor,
            treeType.leafColor,
            treeType.trunkHeight * (0.8 + Math.random() * 0.4),
            treeType.leafRadius * (0.8 + Math.random() * 0.3)
        );
        
        const position = findValidPosition(220, 15, 3.5);
        if (position) {
            tree.position.set(position.x, 0, position.z);
            trees.push({
                mesh: tree,
                x: position.x,
                z: position.z,
                radius: treeType.leafRadius * 0.7
            });
            scene.add(tree);
        }
    }
    
    // Arbustos
    createBushes();
}

// Crear arbustos
function createBushes() {
    bushes = [];
    const bushColors = [0x2A522A, 0x1E3B1E, 0x2B4B2B, 0x1B3B1B];
    
    for (let i = 0; i < 500; i++) {
        const bushGroup = new THREE.Group();
        const bushSize = 0.15 + Math.random() * 0.25;
        const bushHeight = 0.25 + Math.random() * 0.4;
        
        for (let j = 0; j < 2 + Math.floor(Math.random() * 4); j++) {
            const sphereSize = bushSize * (0.4 + Math.random() * 0.8);
            const sphereGeometry = new THREE.SphereGeometry(sphereSize, 5, 3);
            const sphereMaterial = new THREE.MeshStandardMaterial({ 
                color: bushColors[Math.floor(Math.random() * bushColors.length)],
                roughness: 0.85,
                metalness: 0.05
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(
                (Math.random() - 0.5) * bushSize * 1.3,
                bushHeight * 0.15 + Math.random() * bushHeight * 0.7,
                (Math.random() - 0.5) * bushSize * 1.3
            );
            bushGroup.add(sphere);
        }
        
        const position = findValidPosition(220, 8, 1.2);
        if (position) {
            bushGroup.position.set(position.x, 0, position.z);
            bushes.push({
                mesh: bushGroup,
                x: position.x,
                z: position.z,
                radius: bushSize * 0.8
            });
            scene.add(bushGroup);
        }
    }
}

// Encontrar posición válida para objetos
function findValidPosition(mapSize, minDistance, treeDistance) {
    let attempts = 0;
    while (attempts < 100) {
        const x = (Math.random() - 0.5) * mapSize;
        const z = (Math.random() - 0.5) * mapSize;
        
        const distToCenter = Math.sqrt(x * x + z * z);
        const onCircularTrail = distToCenter > 28 && distToCenter < 34;
        const onTrail2 = Math.abs(x - 25) < 4 && Math.abs(z - 25) < 28;
        const onTrail3 = Math.abs(x + 20) < 3.5 && Math.abs(z + 30) < 22;
        const onTrail4 = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2)) < 25 && z > -10;
        
        let validPosition = !onCircularTrail && !onTrail2 && !onTrail3 && !onTrail4 && distToCenter > minDistance;
        
        if (validPosition && treeDistance) {
            for (const tree of trees) {
                const dx = x - tree.x;
                const dz = z - tree.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance < treeDistance) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        if (validPosition) {
            return { x, z };
        }
        attempts++;
    }
    return null;
}

// Crear el amo
function createMaster() {
    person = createPerson();
    const position = findValidPosition(200, 40, 3.0);
    
    if (position) {
        person.position.set(position.x, 0, position.z);
        masterLight.position.set(position.x, 2, position.z);
        masterPosition = { x: position.x, z: position.z };
        scene.add(person);
    }
}

// Crear perros enemigos según el nivel
function createEnemyDogs() {
    enemyDogs = [];
    const enemyCount = Math.min(gameLevel - 1, 5); // Máximo 5 enemigos
    
    for (let i = 0; i < enemyCount; i++) {
        const enemyDog = createEnemyDog();
        const position = findValidPosition(180, 20, 4.0);
        
        if (position) {
            enemyDog.position.set(position.x, 0.28, position.z);
            
            const enemyState = {
                mesh: enemyDog,
                x: position.x,
                z: position.z,
                angle: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.4,
                radius: 0.5,
                patrolRadius: 15 + Math.random() * 10,
                centerX: position.x,
                centerZ: position.z,
                chaseDistance: 30,
                chasing: false,
                aggressiveDistance: 12,
                lastDirectionChange: 0,
                tiredTime: 0,
                restDuration: 1500
            };
            
            // Agregar luz roja para resplandor
            const redLight = new THREE.PointLight(0xFF0000, 1.5, 8);
            redLight.position.set(0, 0.5, 0);
            enemyDog.add(redLight);
            
            enemyState.light = redLight;
            enemyDogs.push(enemyState);
            scene.add(enemyDog);
        }
    }
}

// Crear cielo nocturno
function createNightSky() {
    // Cielo
    const skyGeometry = new THREE.SphereGeometry(350, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x000033,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Estrellas
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.2,
        transparent: true,
        opacity: 1.0
    });
    
    const starsVertices = [];
    for (let i = 0; i < 2500; i++) {
        const x = (Math.random() - 0.5) * 600;
        const y = (Math.random() - 0.5) * 600;
        const z = (Math.random() - 0.5) * 600;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Luna
    const moonGeometry = new THREE.SphereGeometry(6, 16, 16);
    const moonMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xF0F8FF,
        transparent: true,
        opacity: 0.9
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(100, 50, 100);
    scene.add(moon);
}

// Inicializar estado del perro
function initDogState() {
    dogState = {
        x: 0,
        y: 0,
        z: 0,
        angle: 0,
        speed: 0,
        maxSpeed: 1.0,
        acceleration: 0.06,
        deceleration: 0.08,
        turnSpeed: 0.04,
        radius: 0.3,
        isRunning: false,
        foundMaster: false,
        cinematicMode: false,
        cinematicTime: 0,
        reunionPhase: 0,
        initialJump: true,
        initialJumpTime: 0,
        mood: 'happy', // happy, excited, tired, curious
        lastMoodChange: 0
    };
    
    gameTime = 0;
    startTime = Date.now();
    gameActive = true;
    walkCycle = 0;
}

// Bucle principal
function animate() {
    if (!gameActive) return;
    
    requestAnimationFrame(animate);
    updateDog();
    renderer.render(scene, camera);
}