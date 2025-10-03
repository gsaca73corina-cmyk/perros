// Función para crear un árbol con ramas realistas
function createRealisticTree(trunkColor, leafColor, trunkHeight, leafRadius) {
    const treeGroup = new THREE.Group();
    
    // Tronco principal
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, trunkHeight, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: trunkColor,
        roughness: 0.9,
        metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = trunkHeight / 2;
    treeGroup.add(trunk);
    
    // Ramas principales
    const branchCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < branchCount; i++) {
        const angle = (i / branchCount) * Math.PI * 2;
        const branchLength = 1.5 + Math.random() * 1.5;
        const branchHeight = trunkHeight * (0.3 + Math.random() * 0.5);
        
        const branchGeometry = new THREE.CylinderGeometry(0.05, 0.12, branchLength, 6);
        const branchMaterial = new THREE.MeshStandardMaterial({ 
            color: trunkColor,
            roughness: 0.9,
            metalness: 0.1
        });
        const branch = new THREE.Mesh(branchGeometry, branchMaterial);
        branch.position.set(
            Math.cos(angle) * 0.8,
            branchHeight,
            Math.sin(angle) * 0.8
        );
        branch.rotation.z = Math.PI / 2;
        branch.rotation.y = angle;
        treeGroup.add(branch);
        
        // Hojas en las ramas
        const leavesGeometry = new THREE.SphereGeometry(leafRadius * 0.7, 6, 4);
        const leavesMaterial = new THREE.MeshStandardMaterial({ 
            color: leafColor,
            roughness: 0.8,
            metalness: 0.1
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(
            Math.cos(angle) * (0.8 + branchLength * 0.5),
            branchHeight + 0.2,
            Math.sin(angle) * (0.8 + branchLength * 0.5)
        );
        treeGroup.add(leaves);
    }
    
    // Copa del árbol (hojas principales)
    const mainLeavesGeometry = new THREE.SphereGeometry(leafRadius, 8, 6);
    const mainLeavesMaterial = new THREE.MeshStandardMaterial({ 
        color: leafColor,
        roughness: 0.8,
        metalness: 0.1
    });
    const mainLeaves = new THREE.Mesh(mainLeavesGeometry, mainLeavesMaterial);
    mainLeaves.position.y = trunkHeight + leafRadius * 0.5;
    treeGroup.add(mainLeaves);
    
    return treeGroup;
}

// Función para crear un perro 3D mejorado con animación de caminata
function createDog() {
    const dog = new THREE.Group();
    
    // Cuerpo con textura marrón y luz suave
    const bodyGeometry = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.8,
        metalness: 0.1,
        emissive: 0x3B2F2F,
        emissiveIntensity: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1.0, 1.0, 1.8);
    dog.add(body);
    
    // Cabeza
    const headGeometry = new THREE.SphereGeometry(0.22, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.8,
        metalness: 0.1,
        emissive: 0x3B2F2F,
        emissiveIntensity: 0.3
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.z = 0.55;
    head.position.y = 0.05;
    dog.add(head);
    
    // Nariz
    const noseGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.z = 0.75;
    nose.position.y = 0.02;
    dog.add(nose);
    
    // Ojos brillantes
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        emissive: 0x00FFFF,
        emissiveIntensity: 0.8
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.08, 0.1, 0.65);
    dog.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.08, 0.1, 0.65);
    dog.add(rightEye);
    
    // Orejas
    const earGeometry = new THREE.ConeGeometry(0.1, 0.12, 8);
    const earMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x3B2F2F,
        emissiveIntensity: 0.2
    });
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(0.1, 0.22, 0.55);
    leftEar.rotation.x = Math.PI / 3;
    dog.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(-0.1, 0.22, 0.55);
    rightEar.rotation.x = Math.PI / 3;
    dog.add(rightEar);
    
    // Cola
    const tailGeometry = new THREE.CylinderGeometry(0.03, 0.06, 0.25, 8);
    const tailMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x3B2F2F,
        emissiveIntensity: 0.2
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.z = -0.45;
    tail.position.y = 0.05;
    tail.rotation.x = Math.PI / 4;
    dog.add(tail);
    
    // Patas
    const legGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.28, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x3B2F2F,
        emissiveIntensity: 0.25
    });
    
    // Patas delanteras
    const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontLeftLeg.position.set(0.14, -0.28, 0.28);
    dog.add(frontLeftLeg);
    
    const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontRightLeg.position.set(-0.14, -0.28, 0.28);
    dog.add(frontRightLeg);
    
    // Patas traseras
    const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    backLeftLeg.position.set(0.14, -0.28, -0.28);
    dog.add(backLeftLeg);
    
    const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    backRightLeg.position.set(-0.14, -0.28, -0.28);
    dog.add(backRightLeg);
    
    return dog;
}

// Función para crear una persona (amo)
function createPerson() {
    const person = new THREE.Group();
    
    // Cuerpo
    const bodyGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1E90FF });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    person.add(body);
    
    // Cabeza
    const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFDBAC });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.9;
    person.add(head);
    
    // Sombrero brillante
    const hatGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16);
    const hatMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF4500,
        emissive: 0xFF4500,
        emissiveIntensity: 0.6
    });
    const hat = new THREE.Mesh(hatGeometry, hatMaterial);
    hat.position.y = 1.05;
    person.add(hat);
    
    // Chaleco reflectante
    const vestGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 8);
    const vestMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFF00,
        emissive: 0xFFFF00,
        emissiveIntensity: 0.5
    });
    const vest = new THREE.Mesh(vestGeometry, vestMaterial);
    vest.position.y = 0.55;
    person.add(vest);
    
    // Brazos
    const armGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.45, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x1E90FF });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(0.25, 0.4, 0);
    leftArm.rotation.z = Math.PI / 6;
    person.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(-0.25, 0.4, 0);
    rightArm.rotation.z = -Math.PI / 6;
    person.add(rightArm);
    
    // Piernas
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0.1, -0.1, 0);
    person.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(-0.1, -0.1, 0);
    person.add(rightLeg);
    
    return person;
}

// Función para crear un perro enemigo (rojo)
function createEnemyDog() {
    const dog = new THREE.Group();
    
    // Cuerpo con color rojo amenazante y resplandor
    const bodyGeometry = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        roughness: 0.6,
        metalness: 0.2,
        emissive: 0xFF0000,
        emissiveIntensity: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1.0, 1.0, 1.8);
    dog.add(body);
    
    // Cabeza
    const headGeometry = new THREE.SphereGeometry(0.22, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        roughness: 0.6,
        metalness: 0.2,
        emissive: 0xFF0000,
        emissiveIntensity: 0.8
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.z = 0.55;
    head.position.y = 0.05;
    dog.add(head);
    
    // Nariz
    const noseGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.z = 0.75;
    nose.position.y = 0.02;
    dog.add(nose);
    
    // Ojos rojos brillantes
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        emissive: 0xFF0000,
        emissiveIntensity: 1.0
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.08, 0.1, 0.65);
    dog.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-0.08, 0.1, 0.65);
    dog.add(rightEye);
    
    // Orejas
    const earGeometry = new THREE.ConeGeometry(0.1, 0.12, 8);
    const earMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x3B0000,
        emissiveIntensity: 0.3
    });
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(0.1, 0.22, 0.55);
    leftEar.rotation.x = Math.PI / 3;
    dog.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(-0.1, 0.22, 0.55);
    rightEar.rotation.x = Math.PI / 3;
    dog.add(rightEar);
    
    // Cola
    const tailGeometry = new THREE.CylinderGeometry(0.03, 0.06, 0.25, 8);
    const tailMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x3B0000,
        emissiveIntensity: 0.3
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.z = -0.45;
    tail.position.y = 0.05;
    tail.rotation.x = Math.PI / 4;
    dog.add(tail);
    
    // Patas
    const legGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.28, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x3B0000,
        emissiveIntensity: 0.3
    });
    
    // Patas delanteras
    const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontLeftLeg.position.set(0.14, -0.28, 0.28);
    dog.add(frontLeftLeg);
    
    const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontRightLeg.position.set(-0.14, -0.28, 0.28);
    dog.add(frontRightLeg);
    
    // Patas traseras
    const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    backLeftLeg.position.set(0.14, -0.28, -0.28);
    dog.add(backLeftLeg);
    
    const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    backRightLeg.position.set(-0.14, -0.28, -0.28);
    dog.add(backRightLeg);
    
    return dog;
}