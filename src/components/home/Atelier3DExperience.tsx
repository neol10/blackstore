"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "meshoptimizer";
import { Sparkles, Eye, ShieldCheck, Footprints, Layers } from "lucide-react";
import { Product3DModal } from "@/components/ui/Product3DModal";

export function Atelier3DExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const animFrameIdRef = useRef<number | null>(null);

  const [activeTab, setActiveTab] = useState<"sneaker" | "suit">("sneaker");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  // Inicialização e recarregamento da cena ao alternar activeTab
  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoadingModel(true);

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Câmera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 3.4);
    cameraRef.current = camera;

    // 3. Renderer com transparência e antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Iluminação Cinematográfica com HDRI Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(2.5, 3.5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 2.2);
    rimLight.position.set(-2.5, 2, -2.5);
    scene.add(rimLight);

    const softBlueFill = new THREE.DirectionalLight(0x38bdf8, 0.35);
    softBlueFill.position.set(0, -2, 1.5);
    scene.add(softBlueFill);

    // 5. Grupo do Modelo 3D
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Texturas PBR
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

    if (activeTab === "sneaker") {
      // Carrega o Air Force 1 GLB
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        "/models/air-force-1.glb",
        (gltf) => {
          const model = gltf.scene;

          // Aplicação de materiais PBR de couro branco natural e metal
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              const matName = (mesh.material as any)?.name || "";
              if (matName.includes("Metal") || matName.includes("Degradable")) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: 0xdcdce0,
                  metalness: 0.96,
                  roughness: 0.15,
                });
              } else if (matName.includes("Fabric") || matName.includes("Cloth")) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: 0xffffff,
                  roughness: 0.78,
                  metalness: 0.01,
                  normalMap: canvasNormal,
                  normalScale: new THREE.Vector2(1.2, 1.2),
                });
              } else if (matName.includes("Plane.003") || matName.includes("Material.004") || matName.includes("Material.010")) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: 0xfcfcfd,
                  roughness: 0.65,
                  metalness: 0.02,
                  normalMap: leatherNormal,
                  normalScale: new THREE.Vector2(0.3, 0.3),
                });
              } else {
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

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxAxis = Math.max(size.x, size.y, size.z);

          const scaleFactor = 2.4 / maxAxis;
          model.scale.multiplyScalar(scaleFactor);
          model.position.sub(center.multiplyScalar(scaleFactor));
          model.rotation.y = Math.PI * 0.3;
          model.rotation.x = 0.08;

          modelGroup.add(model);
          setIsLoadingModel(false);
        },
        undefined,
        (err) => {
          console.warn("Falha no modelo sneaker, fallback:", err);
          buildAtelierSuit(modelGroup);
          setIsLoadingModel(false);
        }
      );
    } else {
      // Carrega Alfaiataria contemporânea
      buildAtelierSuit(modelGroup);
      setIsLoadingModel(false);
    }

    // 6. Rastreamento do mouse para parallax elástico
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.75;
      mouseRef.current.targetY = y * 0.35;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // 7. Loop de Animação com flutuação e rotação suave
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Interpolação elástica em direção ao mouse (Lerp)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (modelGroup) {
        // Flutuação orgânica sutil
        modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;

        // Rotação suave baseada no mouse + rotação base contínua
        if (activeTab === "sneaker") {
          modelGroup.rotation.y = Math.PI * 0.3 + mouse.x * 0.9 + Math.sin(elapsedTime * 0.6) * 0.15;
          modelGroup.rotation.x = 0.08 - mouse.y * 0.45;
        } else {
          modelGroup.rotation.y = mouse.x * 0.8 + Math.sin(elapsedTime * 0.5) * 0.15;
          modelGroup.rotation.x = -mouse.y * 0.5;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, [activeTab]);

  return (
    <section id="atelier-3d" className="py-24 bg-brand-surface relative border-t border-brand-border/40 overflow-hidden select-none">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-brand-silver/5 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Lado Esquerdo: Conceito Editorial & Seletor de Categoria */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Tag e Alternador de Demonstração */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[1px] bg-brand-silver"></span>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-silver flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-white" />
                  Black Store Lab • 3D Realtime
                </span>
              </div>

              {/* Botões de Alternância de Modelo */}
              <div className="flex items-center p-1 bg-brand-black/80 border border-white/10 rounded-full">
                <button
                  onClick={() => setActiveTab("sneaker")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "sneaker"
                      ? "bg-brand-white text-brand-black shadow-md"
                      : "text-brand-silver hover:text-white"
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  Sneaker Air Force
                </button>
                <button
                  onClick={() => setActiveTab("suit")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "suit"
                      ? "bg-brand-white text-brand-black shadow-md"
                      : "text-brand-silver hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Alfaiataria Black
                </button>
              </div>
            </div>

            {activeTab === "sneaker" ? (
              <>
                <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-white leading-tight mb-6 text-balance">
                  Streetwear Lab.
                  <br />
                  <span className="text-brand-silver">Sneaker Air Force 3D.</span>
                </h2>

                <p className="text-brand-silver/90 text-sm sm:text-base leading-relaxed mb-8 text-pretty">
                  Inspecione o clássico sneaker em couro nobre all-white sob qualquer perspectiva. Mova o cursor para interagir com a peça em tempo real com renderização física PBR fiel aos detalhes de solado, costuras e dubrae metálico.
                </p>

                {/* Pilares Técnicos do Sneaker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-6 border-t border-brand-border/50">
                  <div className="flex items-start gap-3">
                    <Footprints className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs uppercase font-bold text-brand-white">Couro Nobre All-White</h3>
                      <p className="text-xs text-brand-silver/70 mt-0.5">Estrutura durável, biqueira ventilada e acabamento premium acetinado.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs uppercase font-bold text-brand-white">Solado Air Estruturado</h3>
                      <p className="text-xs text-brand-silver/70 mt-0.5">Amortecimento icônico com tração duradoura para o lifestyle urbano.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-white leading-tight mb-6 text-balance">
                  Engenharia Têxtil.
                  <br />
                  <span className="text-brand-silver">Corte Sob Medida em 3D.</span>
                </h2>

                <p className="text-brand-silver/90 text-sm sm:text-base leading-relaxed mb-8 text-pretty">
                  Conheça a precisão milimétrica da nossa alfaiataria contemporânea. Mova o cursor ou arraste a tela para inspecionar a modelagem, a queda do tecido e a imponência da peça sob todos os ângulos.
                </p>

                {/* Pilares Técnicos da Alfaiataria */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-6 border-t border-brand-border/50">
                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs uppercase font-bold text-brand-white">Ombro Estruturado</h3>
                      <p className="text-xs text-brand-silver/70 mt-0.5">Alinhamento anatômico que valoriza a postura masculina contemporânea.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-brand-white shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs uppercase font-bold text-brand-white">Lã Fria e Fios Nobres</h3>
                      <p className="text-xs text-brand-silver/70 mt-0.5">Toque suave, caimento fluido e alta resistência a vincos indesejados.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Botão de Abertura do Modal 360° Completo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest hover:bg-brand-silver transition-all duration-200 shadow-xl"
              >
                <Eye className="w-4 h-4" />
                Interagir em 360° Completo
              </button>
            </div>
          </div>

          {/* Lado Direito: Canvas 3D Interativo */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square rounded-2xl bg-gradient-to-b from-[#131317] via-[#0d0d10] to-[#08080a] border border-white/10 p-2 shadow-2xl group">
              
              {/* Badge 3D Interativo */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-black/75 border border-white/10 backdrop-blur-md text-[10px] uppercase tracking-widest text-brand-silver pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>3D Interativo • Mova o cursor</span>
              </div>

              {/* Indicador de Carregamento sutil */}
              {isLoadingModel && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-black/50 backdrop-blur-sm rounded-2xl">
                  <div className="w-6 h-6 border-2 border-brand-silver/30 border-t-brand-white rounded-full animate-spin" />
                </div>
              )}

              {/* Elemento de Canvas Three.js */}
              <div
                ref={containerRef}
                className="w-full h-full cursor-pointer flex items-center justify-center"
                onClick={() => setIsModalOpen(true)}
                title="Clique para abrir a inspeção 360° completa"
              />

              {/* Botão sutil de clique para expandir */}
              <div className="absolute bottom-4 right-4 z-20">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-brand-black/80 border border-white/15 hover:border-white text-[10px] uppercase tracking-widest text-brand-white backdrop-blur-md transition-colors"
                >
                  Girar 360° ↗
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal 360° Interativo Aberto */}
      <Product3DModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={
          activeTab === "sneaker"
            ? "Sneaker Air Force Streetwear Branco"
            : "Terno Sob Medida Black Edition"
        }
        categoryLabel={
          activeTab === "sneaker" ? "Tênis & Sneakers" : "Alfaiataria Contemporânea"
        }
        modelUrl={activeTab === "sneaker" ? "/models/air-force-1.glb" : undefined}
      />
    </section>
  );
}

/**
 * Constrói o terno 3D de alta alfaiataria em Three.js
 */
function buildAtelierSuit(parent: THREE.Group) {
  const suitFabric = new THREE.MeshStandardMaterial({
    color: 0x141417,
    roughness: 0.6,
    metalness: 0.15,
  });

  const lapelSatin = new THREE.MeshStandardMaterial({
    color: 0x1e1e24,
    roughness: 0.3,
    metalness: 0.45,
  });

  const shirtWhite = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.45,
    metalness: 0.05,
  });

  const tieNavy = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.25,
    metalness: 0.6,
  });

  const goldPin = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.9,
  });

  // Peitoral do paletó
  const chestGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.05, 32);
  chestGeo.scale(1.22, 1, 0.85);
  const chest = new THREE.Mesh(chestGeo, suitFabric);
  chest.position.y = 0.25;
  parent.add(chest);

  // Colarinho branco puro
  const collarGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.22, 24);
  const collar = new THREE.Mesh(collarGeo, shirtWhite);
  collar.position.y = 0.82;
  parent.add(collar);

  // Gravata de seda
  const tieGeo = new THREE.BoxGeometry(0.11, 0.72, 0.04);
  const tie = new THREE.Mesh(tieGeo, tieNavy);
  tie.position.set(0, 0.45, 0.35);
  tie.rotation.x = 0.08;
  parent.add(tie);

  // Lapela Esquerda
  const lapelLeftGeo = new THREE.BoxGeometry(0.15, 0.8, 0.03);
  const lapelLeft = new THREE.Mesh(lapelLeftGeo, lapelSatin);
  lapelLeft.position.set(0.19, 0.38, 0.35);
  lapelLeft.rotation.z = -0.24;
  lapelLeft.rotation.x = 0.05;
  parent.add(lapelLeft);

  // Broche de ouro na lapela (Black Store Pin)
  const pinGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.01, 16);
  const pin = new THREE.Mesh(pinGeo, goldPin);
  pin.position.set(0.24, 0.6, 0.38);
  pin.rotation.x = Math.PI / 2;
  parent.add(pin);

  // Lapela Direita
  const lapelRightGeo = new THREE.BoxGeometry(0.15, 0.8, 0.03);
  const lapelRight = new THREE.Mesh(lapelRightGeo, lapelSatin);
  lapelRight.position.set(-0.19, 0.38, 0.35);
  lapelRight.rotation.z = 0.24;
  lapelRight.rotation.x = 0.05;
  parent.add(lapelRight);

  // Ombros Estruturados
  const leftShoulderGeo = new THREE.SphereGeometry(0.24, 24, 24);
  leftShoulderGeo.scale(1.2, 0.8, 1);
  const leftShoulder = new THREE.Mesh(leftShoulderGeo, suitFabric);
  leftShoulder.position.set(0.62, 0.65, 0);
  parent.add(leftShoulder);

  const rightShoulder = leftShoulder.clone();
  rightShoulder.position.x = -0.62;
  parent.add(rightShoulder);

  // Base Pedestal
  const standMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.25,
    metalness: 0.85,
  });
  const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.85, 16);
  const pole = new THREE.Mesh(poleGeo, standMat);
  pole.position.y = -0.58;
  parent.add(pole);

  parent.position.y = 0.05;
}
