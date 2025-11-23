(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/hero-3d-scene.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Hero3DScene",
    ()=>Hero3DScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Hero3DScene() {
    _s();
    const mountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sceneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mouseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero3DScene.useEffect": ()=>{
            if (!mountRef.current) return;
            // Scene setup
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            scene.background = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](0x0a0a0a);
            scene.fog = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fog"](0x0a0a0a, 10, 50);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebGLRenderer"]({
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            // Mobile optimization
            if (width < 768) {
                // Reduce particle count on mobile
                const particleCount = 500;
            }
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PCFSoftShadowMap"];
            mountRef.current.appendChild(renderer.domElement);
            // Lighting
            const ambientLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0x9fdcc8, 0.3);
            scene.add(ambientLight);
            const pointLight1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](0x9fdcc8, 1, 100);
            pointLight1.position.set(5, 5, 5);
            pointLight1.castShadow = true;
            scene.add(pointLight1);
            const pointLight2 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](0xa3635d, 0.8, 100);
            pointLight2.position.set(-5, -5, 5);
            pointLight2.castShadow = true;
            scene.add(pointLight2);
            // Objects array for animation
            const objects = [];
            // Create rotating gear (college logo representation)
            const createGear = {
                "Hero3DScene.useEffect.createGear": ()=>{
                    const gearGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                    const gearGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.5, 0.5, 0.2, 16);
                    const gearMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                        color: 0x9fdcc8,
                        metalness: 0.7,
                        roughness: 0.3,
                        emissive: 0x9fdcc8,
                        emissiveIntensity: 0.2
                    });
                    const mainGear = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](gearGeometry, gearMaterial);
                    mainGear.castShadow = true;
                    mainGear.receiveShadow = true;
                    gearGroup.add(mainGear);
                    // Add teeth
                    for(let i = 0; i < 8; i++){
                        const tooth = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.15, 0.3, 0.2), gearMaterial);
                        const angle = i / 8 * Math.PI * 2;
                        tooth.position.x = Math.cos(angle) * 0.7;
                        tooth.position.y = Math.sin(angle) * 0.7;
                        tooth.castShadow = true;
                        gearGroup.add(tooth);
                    }
                    gearGroup.position.set(0, 1.5, 0);
                    gearGroup.rotation.x = Math.PI / 2;
                    scene.add(gearGroup);
                    objects.push({
                        mesh: gearGroup,
                        type: 'gear',
                        rotationSpeed: {
                            x: 0,
                            y: 0.01,
                            z: 0
                        }
                    });
                }
            }["Hero3DScene.useEffect.createGear"];
            // Create floating geometric shapes
            const createFloatingShapes = {
                "Hero3DScene.useEffect.createFloatingShapes": ()=>{
                    const shapes = [
                        'hexagon',
                        'sphere',
                        'box'
                    ];
                    const colors = [
                        0x9fdcc8,
                        0xa3635d,
                        0x22112a
                    ];
                    for(let i = 0; i < 12; i++){
                        let geometry;
                        const shapeType = shapes[i % shapes.length];
                        if (shapeType === 'hexagon') {
                            geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.2, 0.2, 0.1, 6);
                        } else if (shapeType === 'sphere') {
                            geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.15, 16, 16);
                        } else {
                            geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.3, 0.3, 0.3);
                        }
                        const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                            color: colors[i % colors.length],
                            metalness: 0.5,
                            roughness: 0.5,
                            transparent: true,
                            opacity: 0.8,
                            emissive: colors[i % colors.length],
                            emissiveIntensity: 0.1
                        });
                        const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        const angle = i / 12 * Math.PI * 2;
                        const radius = 3 + Math.random() * 2;
                        mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3);
                        scene.add(mesh);
                        objects.push({
                            mesh,
                            type: 'floating',
                            rotationSpeed: {
                                x: (Math.random() - 0.5) * 0.02,
                                y: (Math.random() - 0.5) * 0.02,
                                z: (Math.random() - 0.5) * 0.02
                            },
                            floatSpeed: Math.random() * 0.01 + 0.005,
                            initialY: mesh.position.y
                        });
                    }
                }
            }["Hero3DScene.useEffect.createFloatingShapes"];
            // Particle system
            const createParticles = {
                "Hero3DScene.useEffect.createParticles": ()=>{
                    const isMobile = window.innerWidth < 768;
                    const particleCount = isMobile ? 300 : 1000;
                    const particles = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
                    const positions = new Float32Array(particleCount * 3);
                    const colors = new Float32Array(particleCount * 3);
                    for(let i = 0; i < particleCount * 3; i += 3){
                        positions[i] = (Math.random() - 0.5) * 20;
                        positions[i + 1] = (Math.random() - 0.5) * 20;
                        positions[i + 2] = (Math.random() - 0.5) * 20;
                        const color = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]();
                        color.setHSL(0.4 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.3);
                        colors[i] = color.r;
                        colors[i + 1] = color.g;
                        colors[i + 2] = color.b;
                    }
                    particles.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](positions, 3));
                    particles.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](colors, 3));
                    const particleMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointsMaterial"]({
                        size: 0.05,
                        vertexColors: true,
                        transparent: true,
                        opacity: 0.6,
                        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"]
                    });
                    const particleSystem = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Points"](particles, particleMaterial);
                    scene.add(particleSystem);
                    objects.push({
                        mesh: particleSystem,
                        type: 'particles',
                        rotationSpeed: {
                            x: 0,
                            y: 0.0005,
                            z: 0
                        }
                    });
                }
            }["Hero3DScene.useEffect.createParticles"];
            // Create club category icons (3D representations)
            const createClubIcons = {
                "Hero3DScene.useEffect.createClubIcons": ()=>{
                    const iconTypes = [
                        {
                            type: 'robot',
                            color: 0x9fdcc8
                        },
                        {
                            type: 'palette',
                            color: 0xa3635d
                        },
                        {
                            type: 'sports',
                            color: 0x9fdcc8
                        },
                        {
                            type: 'tech',
                            color: 0xa3635d
                        }
                    ];
                    iconTypes.forEach({
                        "Hero3DScene.useEffect.createClubIcons": (icon, index)=>{
                            const iconGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                            let geometry;
                            if (icon.type === 'robot') {
                                geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](0.3, 0.4, 0.3);
                            } else if (icon.type === 'palette') {
                                geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](0.2, 0.4, 8);
                            } else if (icon.type === 'sports') {
                                geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](0.2, 16, 16);
                            } else {
                                geometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OctahedronGeometry"](0.25);
                            }
                            const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                                color: icon.color,
                                metalness: 0.6,
                                roughness: 0.4,
                                emissive: icon.color,
                                emissiveIntensity: 0.3
                            });
                            const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, material);
                            mesh.castShadow = true;
                            iconGroup.add(mesh);
                            const angle = index / iconTypes.length * Math.PI * 2;
                            iconGroup.position.set(Math.cos(angle) * 2.5, -1.5 + index % 2 * 1, Math.sin(angle) * 2.5);
                            scene.add(iconGroup);
                            objects.push({
                                mesh: iconGroup,
                                type: 'icon',
                                rotationSpeed: {
                                    x: 0.01,
                                    y: 0.02,
                                    z: 0.005
                                },
                                floatSpeed: 0.01,
                                initialY: iconGroup.position.y
                            });
                        }
                    }["Hero3DScene.useEffect.createClubIcons"]);
                }
            }["Hero3DScene.useEffect.createClubIcons"];
            // Initialize all objects
            createGear();
            createFloatingShapes();
            createParticles();
            createClubIcons();
            // Mouse movement handler
            const handleMouseMove = {
                "Hero3DScene.useEffect.handleMouseMove": (event)=>{
                    mouseRef.current.x = event.clientX / window.innerWidth * 2 - 1;
                    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
                }
            }["Hero3DScene.useEffect.handleMouseMove"];
            // Click ripple effect
            const handleClick = {
                "Hero3DScene.useEffect.handleClick": (event)=>{
                    const rect = renderer.domElement.getBoundingClientRect();
                    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
                    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                    // Create ripple effect
                    const rippleGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RingGeometry"](0.1, 0.2, 32);
                    const rippleMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                        color: 0x9fdcc8,
                        transparent: true,
                        opacity: 0.6,
                        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                    });
                    const ripple = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](rippleGeometry, rippleMaterial);
                    const worldPosition = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x * 5, y * 5, 0);
                    worldPosition.unproject(camera);
                    const dir = worldPosition.sub(camera.position).normalize();
                    const distance = -camera.position.z / dir.z;
                    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
                    ripple.position.copy(pos);
                    ripple.lookAt(camera.position);
                    scene.add(ripple);
                    // Animate ripple
                    let scale = 1;
                    const animateRipple = {
                        "Hero3DScene.useEffect.handleClick.animateRipple": ()=>{
                            scale += 0.1;
                            ripple.scale.set(scale, scale, 1);
                            rippleMaterial.opacity -= 0.02;
                            if (rippleMaterial.opacity > 0) {
                                requestAnimationFrame(animateRipple);
                            } else {
                                scene.remove(ripple);
                                rippleGeometry.dispose();
                                rippleMaterial.dispose();
                            }
                        }
                    }["Hero3DScene.useEffect.handleClick.animateRipple"];
                    animateRipple();
                }
            }["Hero3DScene.useEffect.handleClick"];
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('click', handleClick);
            // Animation loop
            let time = 0;
            const animate = {
                "Hero3DScene.useEffect.animate": ()=>{
                    animationFrameRef.current = requestAnimationFrame(animate);
                    time += 0.01;
                    // Camera follows mouse with easing
                    camera.position.x += (mouseRef.current.x * 0.5 - camera.position.x) * 0.05;
                    camera.position.y += (mouseRef.current.y * 0.5 - camera.position.y) * 0.05;
                    camera.lookAt(0, 0, 0);
                    // Animate objects
                    objects.forEach({
                        "Hero3DScene.useEffect.animate": (obj)=>{
                            if (obj.type === 'gear') {
                                obj.mesh.rotation.z += obj.rotationSpeed.y;
                            } else if (obj.type === 'floating' || obj.type === 'icon') {
                                obj.mesh.rotation.x += obj.rotationSpeed.x;
                                obj.mesh.rotation.y += obj.rotationSpeed.y;
                                obj.mesh.rotation.z += obj.rotationSpeed.z;
                                if (obj.floatSpeed) {
                                    obj.mesh.position.y = obj.initialY + Math.sin(time * 2 + obj.mesh.position.x) * 0.3;
                                }
                            } else if (obj.type === 'particles') {
                                obj.mesh.rotation.y += obj.rotationSpeed.y;
                                // Move particles based on mouse
                                const positions = obj.mesh.geometry.attributes.position.array;
                                for(let i = 0; i < positions.length; i += 3){
                                    positions[i] += mouseRef.current.x * 0.0001;
                                    positions[i + 1] += mouseRef.current.y * 0.0001;
                                }
                                obj.mesh.geometry.attributes.position.needsUpdate = true;
                            }
                        }
                    }["Hero3DScene.useEffect.animate"]);
                    // Update lights based on mouse
                    pointLight1.position.x = 5 + mouseRef.current.x * 2;
                    pointLight1.position.y = 5 + mouseRef.current.y * 2;
                    pointLight2.position.x = -5 - mouseRef.current.x * 2;
                    pointLight2.position.y = -5 - mouseRef.current.y * 2;
                    renderer.render(scene, camera);
                }
            }["Hero3DScene.useEffect.animate"];
            animate();
            setIsLoaded(true);
            sceneRef.current = scene;
            // Handle resize
            const handleResize = {
                "Hero3DScene.useEffect.handleResize": ()=>{
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
            }["Hero3DScene.useEffect.handleResize"];
            window.addEventListener('resize', handleResize);
            // Cleanup
            return ({
                "Hero3DScene.useEffect": ()=>{
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('click', handleClick);
                    window.removeEventListener('resize', handleResize);
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    // Dispose of all geometries and materials
                    scene.traverse({
                        "Hero3DScene.useEffect": (object)=>{
                            if (object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"]) {
                                object.geometry?.dispose();
                                if (Array.isArray(object.material)) {
                                    object.material.forEach({
                                        "Hero3DScene.useEffect": (mat)=>mat.dispose()
                                    }["Hero3DScene.useEffect"]);
                                } else {
                                    object.material?.dispose();
                                }
                            }
                        }
                    }["Hero3DScene.useEffect"]);
                    renderer.dispose();
                    if (mountRef.current && renderer.domElement) {
                        mountRef.current.removeChild(renderer.domElement);
                    }
                }
            })["Hero3DScene.useEffect"];
        }
    }["Hero3DScene.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: mountRef,
        className: "fixed inset-0 z-0 pointer-events-none",
        style: {
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in'
        }
    }, void 0, false, {
        fileName: "[project]/components/hero-3d-scene.jsx",
        lineNumber: 402,
        columnNumber: 5
    }, this);
}
_s(Hero3DScene, "6xfO1CK4m9PNj+rbW6kWiTlKzok=");
_c = Hero3DScene;
var _c;
__turbopack_context__.k.register(_c, "Hero3DScene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/hero-3d-content.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Hero3DContent",
    ()=>Hero3DContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const quotes = [
    "Join a community, find your passion.",
    "Be part of something bigger than yourself.",
    "Discover new talents, make lasting friendships.",
    "Your journey to leadership starts here.",
    "Transform ideas into action with like-minded peers."
];
function Hero3DContent() {
    _s();
    const [randomQuote, setRandomQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mousePosition, setMousePosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero3DContent.useEffect": ()=>{
            setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            setIsClient(true);
        }
    }["Hero3DContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero3DContent.useEffect": ()=>{
            const handleMouseMove = {
                "Hero3DContent.useEffect.handleMouseMove": (e)=>{
                    if (contentRef.current) {
                        const rect = contentRef.current.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                        setMousePosition({
                            x,
                            y
                        });
                    }
                }
            }["Hero3DContent.useEffect.handleMouseMove"];
            window.addEventListener('mousemove', handleMouseMove);
            return ({
                "Hero3DContent.useEffect": ()=>window.removeEventListener('mousemove', handleMouseMove)
            })["Hero3DContent.useEffect"];
        }
    }["Hero3DContent.useEffect"], []);
    if (!isClient) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: contentRef,
        className: "relative z-20 mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20",
        style: {
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            transition: 'transform 0.1s ease-out'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-10 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-block animate-fade-in",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border-2 backdrop-blur-md",
                        style: {
                            backgroundColor: 'rgba(159, 220, 200, 0.2)',
                            color: 'var(--foreground)',
                            borderColor: 'rgba(159, 220, 200, 0.5)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-2 rounded-full animate-pulse",
                                style: {
                                    backgroundColor: 'var(--primary)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/hero-3d-content.jsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            "Welcome to Student Life"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/hero-3d-content.jsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/hero-3d-content.jsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-balance text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground animate-slide-in",
                    style: {
                        textShadow: `
              0 0 10px rgba(159, 220, 200, 0.3),
              0 0 20px rgba(159, 220, 200, 0.2),
              2px 2px 4px rgba(0, 0, 0, 0.3)
            `,
                        transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
                        transformStyle: 'preserve-3d'
                    },
                    children: [
                        "Explore",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-float",
                            style: {
                                backgroundSize: '200% auto',
                                WebkitTextStroke: '1px rgba(159, 220, 200, 0.3)',
                                filter: 'drop-shadow(0 0 8px rgba(159, 220, 200, 0.5))'
                            },
                            children: "Student Clubs"
                        }, void 0, false, {
                            fileName: "[project]/components/hero-3d-content.jsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/hero-3d-content.jsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-pretty text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed text-muted-foreground animate-fade-in",
                    style: {
                        animationDelay: '0.2s'
                    },
                    children: "Discover communities of passionate students. Find your tribe, develop skills, and create memories that last a lifetime."
                }, void 0, false, {
                    fileName: "[project]/components/hero-3d-content.jsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-3xl p-8 md:p-12 backdrop-blur-md border-2 mx-auto max-w-3xl animate-scale-in",
                    style: {
                        backgroundColor: 'rgba(159, 220, 200, 0.1)',
                        borderColor: 'rgba(159, 220, 200, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        animationDelay: '0.3s'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl md:text-2xl font-semibold italic text-foreground",
                        style: {
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        },
                        children: [
                            '"',
                            randomQuote,
                            '"'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/hero-3d-content.jsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/hero-3d-content.jsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in",
                    style: {
                        animationDelay: '0.4s'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/clubs",
                            className: "group inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden",
                            style: {
                                transform: 'translateZ(20px)',
                                transformStyle: 'preserve-3d'
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.transform = 'translateZ(30px) translateY(-4px) scale(1.05)';
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.transform = 'translateZ(20px) translateY(0) scale(1)';
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative z-10",
                                    children: "Start Exploring"
                                }, void 0, false, {
                                    fileName: "[project]/components/hero-3d-content.jsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "ml-2 w-5 h-5 relative z-10",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M13 7l5 5m0 0l-5 5m5-5H6"
                                    }, void 0, false, {
                                        fileName: "[project]/components/hero-3d-content.jsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/hero-3d-content.jsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                    style: {
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/hero-3d-content.jsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/hero-3d-content.jsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/about",
                            className: "group inline-flex items-center justify-center px-8 py-4 border-2 rounded-xl font-semibold border-secondary text-secondary transition-all duration-300 backdrop-blur-sm relative overflow-hidden",
                            style: {
                                backgroundColor: 'rgba(163, 99, 93, 0.1)',
                                transform: 'translateZ(20px)',
                                transformStyle: 'preserve-3d'
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.transform = 'translateZ(30px) translateY(-4px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(163, 99, 93, 0.3)';
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.transform = 'translateZ(20px) translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative z-10",
                                    children: "Learn More"
                                }, void 0, false, {
                                    fileName: "[project]/components/hero-3d-content.jsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                    style: {
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/hero-3d-content.jsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/hero-3d-content.jsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/hero-3d-content.jsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/hero-3d-content.jsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/hero-3d-content.jsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(Hero3DContent, "atF4Ehmv0jHbOF8cEoomjdIAxJI=");
_c = Hero3DContent;
var _c;
__turbopack_context__.k.register(_c, "Hero3DContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$3d$2d$scene$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-3d-scene.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$3d$2d$content$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/hero-3d-content.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function LandingPage() {
    _s();
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LandingPage.useEffect": ()=>{
            setIsClient(true);
        }
    }["LandingPage.useEffect"], []);
    if (!isClient) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-background transition-colors duration-300 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$3d$2d$scene$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Hero3DScene"], {}, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative min-h-screen flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$hero$2d$3d$2d$content$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Hero3DContent"], {}, void 0, false, {
                    fileName: "[project]/app/page.jsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-20 mx-auto max-w-6xl px-6 md:px-12 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "inline-block",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border-2",
                                style: {
                                    backgroundColor: '#9fdcc8',
                                    color: '#22112a',
                                    borderColor: '#9fdcc8'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "h-2 w-2 rounded-full",
                                        style: {
                                            backgroundColor: '#22112a'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 38,
                                        columnNumber: 15
                                    }, this),
                                    "Welcome to Student Life"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.jsx",
                                lineNumber: 30,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-balance text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground animate-slide-in",
                            children: [
                                "Explore",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-float",
                                    children: "Student Clubs"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-pretty text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed text-muted-foreground animate-fade-in",
                            style: {
                                animationDelay: '0.2s'
                            },
                            children: "Discover communities of passionate students. Find your tribe, develop skills, and create memories that last a lifetime."
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-3xl p-8 md:p-12 backdrop-blur-sm border-2",
                            style: {
                                backgroundColor: 'rgba(159, 220, 200, 0.15)',
                                borderColor: '#9fdcc8'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl md:text-2xl font-semibold italic",
                                style: {
                                    color: '#22112a'
                                },
                                children: [
                                    '"',
                                    randomQuote,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.jsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in",
                            style: {
                                animationDelay: '0.4s'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                                    href: "/clubs",
                                    className: "inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover-lift hover:scale-105 active:scale-95",
                                    children: [
                                        "Start Exploring",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "ml-2 w-5 h-5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M13 7l5 5m0 0l-5 5m5-5H6"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 91,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Link, {
                                    href: "/about",
                                    className: "inline-flex items-center justify-center px-8 py-4 border-2 rounded-xl font-semibold border-secondary text-secondary transition-all duration-300 hover:shadow-md hover-lift hover:scale-105 active:scale-95",
                                    children: "Learn More"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.jsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-10 mx-auto max-w-6xl px-6 md:px-12 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center p-6 rounded-2xl backdrop-blur-md border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl",
                            style: {
                                backgroundColor: 'rgba(159, 220, 200, 0.15)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-4xl md:text-5xl font-bold text-primary",
                                    style: {
                                        textShadow: '0 0 20px rgba(159, 220, 200, 0.5)'
                                    },
                                    children: "50+"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm md:text-base mt-2 font-medium text-muted-foreground",
                                    children: "Active Clubs"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center p-6 rounded-2xl backdrop-blur-md border border-secondary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl",
                            style: {
                                backgroundColor: 'rgba(163, 99, 93, 0.15)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-4xl md:text-5xl font-bold text-secondary",
                                    style: {
                                        textShadow: '0 0 20px rgba(163, 99, 93, 0.5)'
                                    },
                                    children: "2000+"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm md:text-base mt-2 font-medium text-muted-foreground",
                                    children: "Active Members"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center p-6 rounded-2xl col-span-2 md:col-span-1 backdrop-blur-md border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl",
                            style: {
                                backgroundColor: 'rgba(159, 220, 200, 0.15)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-4xl md:text-5xl font-bold text-primary",
                                    style: {
                                        textShadow: '0 0 20px rgba(159, 220, 200, 0.5)'
                                    },
                                    children: "100%"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm md:text-base mt-2 font-medium text-muted-foreground",
                                    children: "Free to Join"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.jsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-20 mx-auto max-w-6xl px-6 md:px-12 py-12 mb-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-3xl p-8 md:p-12 border-2 backdrop-blur-md",
                    style: {
                        backgroundColor: 'rgba(34, 17, 42, 0.8)',
                        borderColor: 'rgba(159, 220, 200, 0.5)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4 mb-6",
                            children: [
                                ...Array(5)
                            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    style: {
                                        color: '#a3635d'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 179,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg mb-6",
                            style: {
                                color: '#fdfceb'
                            },
                            children: '"Joining clubs transformed my college experience. I made lifelong friends, developed new skills, and discovered passions I never knew I had. It\'s been incredible!"'
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-semibold",
                            style: {
                                color: '#9fdcc8'
                            },
                            children: "Sarah Sharma"
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm",
                            style: {
                                color: '#a3635d'
                            },
                            children: "Electronics Engineering, 3rd Year"
                        }, void 0, false, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.jsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-0 pointer-events-none overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20",
                        style: {
                            backgroundColor: '#9fdcc8'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/page.jsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-15",
                        style: {
                            backgroundColor: '#a3635d'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/page.jsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 213,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(LandingPage, "k460N28PNzD7zo1YW47Q9UigQis=");
_c = LandingPage;
var _c;
__turbopack_context__.k.register(_c, "LandingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_878f4754._.js.map