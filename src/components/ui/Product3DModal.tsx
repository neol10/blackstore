"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "meshoptimizer";
import { X, RotateCcw, Play, Pause, MessageCircle, Sparkles } from "lucide-react";
import { createProductWhatsAppLink } from "@/lib/whatsapp";

interface Product3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  categoryLabel?: string;
  modelUrl?: string; // Caminho opcional para arquivo .glb
}

export function Product3DModal({
  isOpen,
  onClose,
  productName,
  categoryLabel = "Alfaiataria Premium",
  modelUrl,
}: Product3DModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    setIsLoading(true);

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Câmera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 3.2);
    cameraRef.current = camera;

    // 3. Renderer com Antialias e ToneMapping cinematográfico
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controles Orbit (Rotação suave e zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.minDistance = 1.5;
    controls.maxDistance = 5.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Não deixa ir muito abaixo do chão
    controlsRef.current = controls;

    // 5. Iluminação de Estúdio Profissional com HDRI Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Luz Principal Superior (Realça os ombros e colarinho)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Luz de Preenchimento Suave (Evita sombras pretas duras)
    const fillLight = new THREE.DirectionalLight(0xd1d5db, 1.0);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // Luz de Contra-luz / Rim Light (Realça a silhueta da peça no fundo escuro)
    const rimLight = new THREE.DirectionalLight(0xe5e7eb, 2.0);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Luz Inferior Suave
    const bottomLight = new THREE.DirectionalLight(0x38bdf8, 0.3);
    bottomLight.position.set(0, -2, 1);
    scene.add(bottomLight);

    // 6. Grupo Principal do Modelo
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 7. Carregamento de Texturas Fotográficas PBR
    const textureLoader = new THREE.TextureLoader();
    const leatherNormal = textureLoader.load("/textures/leather/normal.webp");
    leatherNormal.wrapS = THREE.RepeatWrapping;
    leatherNormal.wrapT = THREE.RepeatWrapping;
    leatherNormal.repeat.set(3.5, 3.5);

    const leatherRoughness = textureLoader.load("/textures/leather/roughness.webp");
    leatherRoughness.wrapS = THREE.RepeatWrapping;
    leatherRoughness.wrapT = THREE.RepeatWrapping;
    leatherRoughness.repeat.set(3.5, 3.5);

    const canvasNormal = textureLoader.load("/textures/canvas/normal.webp");
    canvasNormal.wrapS = THREE.RepeatWrapping;
    canvasNormal.wrapT = THREE.RepeatWrapping;
    canvasNormal.repeat.set(5.0, 5.0);

    // 8. Carregamento do Modelo (.glb) ou Manequim de Alfaiataria Esculpido
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;

          // Se for calçado / sneaker, aplica materiais PBR de couro branco e metal
          const isSneaker =
            modelUrl.includes("air-force") ||
            modelUrl.includes("shoe") ||
            modelUrl.includes("sneaker") ||
            categoryLabel.toLowerCase().includes("tênis") ||
            categoryLabel.toLowerCase().includes("tenis");

          if (isSneaker) {
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                const matName = (mesh.material as any)?.name || "";
                if (matName.includes("Metal") || matName.includes("Degradable")) {
                  // Plaqueta metálica Dubrae frontal cromada
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: 0xdcdce0,
                    metalness: 0.96,
                    roughness: 0.15,
                  });
                } else if (matName.includes("Fabric") || matName.includes("Cloth")) {
                  // Cadarços de algodão com trama visível e interior do cano
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.78,
                    metalness: 0.01,
                    normalMap: canvasNormal,
                    normalScale: new THREE.Vector2(1.2, 1.2),
                  });
                } else if (matName.includes("Plane.003") || matName.includes("Material.004") || matName.includes("Material.010")) {
                  // Solado de borracha estruturado
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: 0xfcfcfd,
                    roughness: 0.65,
                    metalness: 0.02,
                    normalMap: leatherNormal,
                    normalScale: new THREE.Vector2(0.3, 0.3),
                  });
                } else {
                  // Cabedal em couro legítimo texturizado com microporos e acabamento acetinado
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: 0xf6f6f8,
                    roughness: 0.44,
                    metalness: 0.05,
                    normalMap: leatherNormal,
                    normalScale: new THREE.Vector2(0.85, 0.85),
                    roughnessMap: leatherRoughness,
                  });
                }
              }
            });
          } else {
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
          }

          // Centraliza e ajusta escala automaticamente
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxAxis = Math.max(size.x, size.y, size.z);

          const scaleFactor = isSneaker ? 2.3 / maxAxis : 2.0 / maxAxis;
          model.scale.multiplyScalar(scaleFactor);
          model.position.sub(center.multiplyScalar(scaleFactor));

          if (isSneaker) {
            model.position.y += 0.05;
            model.rotation.y = Math.PI * 0.28;
            model.rotation.x = 0.06;
          } else {
            model.position.y += 0.1;
          }

          modelGroup.add(model);
          setIsLoading(false);
        },
        undefined,
        (err) => {
          console.warn("Fallback para manequim procedural:", err);
          createLuxuryMannequin(modelGroup);
          setIsLoading(false);
        }
      );
    } else {
      createLuxuryMannequin(modelGroup);
      setIsLoading(false);
    }

    // 8. Chão com reflexo suave sutil
    const floorGeo = new THREE.CircleGeometry(1.6, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.0;
    floor.receiveShadow = true;
    scene.add(floor);

    // 9. Loop de Animação 60 FPS
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 10. Redimensionamento responsivo
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
      controls.dispose();
    };
  }, [isOpen, modelUrl]);

  // Atualiza autoRotate no OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Reseta a visão para a frente
  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 0.5, 3.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-black/85 backdrop-blur-2xl transition-all duration-300 select-none animate-fadeIn">
      {/* Container Principal do Modal de Luxo */}
      <div className="relative w-full max-w-4xl bg-brand-surface border border-brand-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Lado Esquerdo: Área do Canvas 3D */}
        <div className="relative w-full md:w-3/5 h-[340px] sm:h-[420px] md:h-[540px] bg-gradient-to-b from-[#111115] via-[#0b0b0e] to-[#070708] flex items-center justify-center overflow-hidden">
          {/* Indicador de Loading */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-brand-black/70">
              <div className="w-8 h-8 border-2 border-brand-silver/20 border-t-brand-white rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-widest text-brand-silver">
                Renderizando em 3D...
              </span>
            </div>
          )}

          {/* Canvas Three.js */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Dica de interação sutil */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-black/60 border border-white/10 backdrop-blur-md text-[10px] uppercase tracking-widest text-brand-silver pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Arraste para girar 360° • Scroll para zoom</span>
          </div>

          {/* Controles Flutuantes do 3D */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              title={isAutoRotate ? "Pausar rotação" : "Girar automaticamente"}
              className="p-2 rounded-full bg-brand-black/70 border border-white/10 hover:border-brand-white text-brand-silver hover:text-white transition-colors duration-200 backdrop-blur-md"
            >
              {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleResetView}
              title="Resetar câmera"
              className="p-2 rounded-full bg-brand-black/70 border border-white/10 hover:border-brand-white text-brand-silver hover:text-white transition-colors duration-200 backdrop-blur-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lado Direito: Informações Editoriais da Peça */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-brand-card/60 border-t md:border-t-0 md:border-l border-brand-border/60">
          <div>
            {/* Botão Fechar */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-silver px-2.5 py-1 bg-brand-black/80 border border-white/10">
                <Sparkles className="w-3 h-3 text-brand-white" />
                Experiência 3D
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-brand-silver hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <span className="text-xs uppercase tracking-widest text-brand-muted">
              {categoryLabel}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-brand-white mt-1 mb-4 text-balance">
              {productName}
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-brand-silver/90 leading-relaxed pt-3 border-t border-brand-border/40">
              {categoryLabel.toLowerCase().includes("tênis") ||
              categoryLabel.toLowerCase().includes("tenis") ||
              productName.toLowerCase().includes("sneaker") ||
              productName.toLowerCase().includes("air force") ? (
                <>
                  <p>
                    Inspeção tridimensional de alta definição. Gire o sneaker em 360°, dê zoom e analise o acabamento do couro legítimo all-white, o relevo do solado e cada detalhe estrutural.
                  </p>
                  <ul className="space-y-1.5 pt-2 text-[11px] uppercase tracking-wider text-brand-muted">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-white rounded-full" />
                      Cabedal em couro nobre texturizado e costuras reforçadas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-white rounded-full" />
                      Solado clássico com câmara de ar e absorção de impacto
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-white rounded-full" />
                      Dubrae metálico frontal e biqueira microperfurada
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    Visualização tridimensional de alta precisão. Inspecione o caimento, as proporções e a estrutura geométrica da peça sob qualquer perspectiva.
                  </p>
                  <ul className="space-y-1.5 pt-2 text-[11px] uppercase tracking-wider text-brand-muted">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-white rounded-full" />
                      Corte e alfaiataria estruturada
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-white rounded-full" />
                      Textura e simulação têxtil contemporânea
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-white rounded-full" />
                      Caimento sob medida exclusivo
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Ação de Compra Direta */}
          <div className="mt-8 pt-6 border-t border-brand-border/60 flex flex-col gap-2.5">
            <a
              href={createProductWhatsAppLink(productName)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver transition-all duration-200 shadow-xl"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Pedir Peça no WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest text-brand-silver hover:text-white transition-colors text-center"
            >
              Voltar ao Catálogo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Manequim de Alfaiataria Esculpido em Three.js
 * Oferece renderização de luxo imediata com terno, lapelas e gravata
 */
function createLuxuryMannequin(parent: THREE.Group) {
  const mannequinGroup = new THREE.Group();

  // Material de Alfaiataria Lã Fria Negra Acetina (PBR)
  const suitFabricMaterial = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.65,
    metalness: 0.15,
  });

  // Material de Lapela e Cetim Escuro
  const lapelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f1f23,
    roughness: 0.35,
    metalness: 0.4,
  });

  // Material da Camisa Social Branca Pura
  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.5,
    metalness: 0.05,
  });

  // Material da Gravata de Seda Azul Marinho Listrada
  const tieMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.3,
    metalness: 0.6,
  });

  // Material da Base do Manequim em Metal Escovado
  const standMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.25,
    metalness: 0.85,
  });

  // 1. Torso do Paletó (Peito e Cintura Estruturada)
  const chestGeo = new THREE.CylinderGeometry(0.48, 0.38, 0.95, 32);
  chestGeo.scale(1.25, 1, 0.85); // Modelagem atlética masculina
  const chest = new THREE.Mesh(chestGeo, suitFabricMaterial);
  chest.position.y = 0.25;
  chest.castShadow = true;
  mannequinGroup.add(chest);

  // 2. Colarinho da Camisa
  const collarGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.22, 24);
  const collar = new THREE.Mesh(collarGeo, shirtMaterial);
  collar.position.y = 0.78;
  mannequinGroup.add(collar);

  // 3. Decote em V e Gravata
  const tieGeo = new THREE.BoxGeometry(0.1, 0.65, 0.04);
  const tie = new THREE.Mesh(tieGeo, tieMaterial);
  tie.position.set(0, 0.45, 0.33);
  tie.rotation.x = 0.08;
  mannequinGroup.add(tie);

  // 4. Lapela Esquerda (Cetim)
  const lapelLeftGeo = new THREE.BoxGeometry(0.14, 0.75, 0.03);
  const lapelLeft = new THREE.Mesh(lapelLeftGeo, lapelMaterial);
  lapelLeft.position.set(0.18, 0.36, 0.33);
  lapelLeft.rotation.z = -0.25;
  lapelLeft.rotation.x = 0.05;
  mannequinGroup.add(lapelLeft);

  // 5. Lapela Direita (Cetim)
  const lapelRightGeo = new THREE.BoxGeometry(0.14, 0.75, 0.03);
  const lapelRight = new THREE.Mesh(lapelRightGeo, lapelMaterial);
  lapelRight.position.set(-0.18, 0.36, 0.33);
  lapelRight.rotation.z = 0.25;
  lapelRight.rotation.x = 0.05;
  mannequinGroup.add(lapelRight);

  // 6. Ombros Estruturados
  const leftShoulderGeo = new THREE.SphereGeometry(0.22, 24, 24);
  leftShoulderGeo.scale(1.2, 0.8, 1);
  const leftShoulder = new THREE.Mesh(leftShoulderGeo, suitFabricMaterial);
  leftShoulder.position.set(0.58, 0.62, 0);
  mannequinGroup.add(leftShoulder);

  const rightShoulder = leftShoulder.clone();
  rightShoulder.position.x = -0.58;
  mannequinGroup.add(rightShoulder);

  // 7. Base do Manequim (Pedestal em Metal Escovado)
  const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.9, 16);
  const pole = new THREE.Mesh(poleGeo, standMaterial);
  pole.position.y = -0.55;
  mannequinGroup.add(pole);

  const baseGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.04, 32);
  const base = new THREE.Mesh(baseGeo, standMaterial);
  base.position.y = -0.98;
  base.receiveShadow = true;
  mannequinGroup.add(base);

  // Ajusta altura geral
  mannequinGroup.position.y = 0.05;
  parent.add(mannequinGroup);
}
