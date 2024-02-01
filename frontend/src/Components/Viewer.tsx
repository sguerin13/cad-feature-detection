import {
  Center,
  OrbitControls,
  Resize,
  useHelper
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  BufferGeometry,
  DirectionalLightHelper,
  SpotLightHelper
} from "three";
import { convertClassToColor } from "../helpers";

export default function Viewer(props: {
  setFaceClassSelected: (faceClass: FaceClass | undefined) => void;
  helperMode?: boolean;
  geo?: BufferGeometry[];
  faceClasses?: FaceClass[];
  showColor?: boolean;
}) {
  const { geo, faceClasses, showColor, helperMode, setFaceClassSelected } =
    props;

  return !geo || !faceClasses ? (
    <LoadingScreen />
  ) : (
    <Canvas
      camera={{
        position: [2, 2, 2],

        fov: 40,
      }}
    >
      <color attach="background" args={["#e0e0e0"]} />
      <ambientLight intensity={0.8} castShadow />
      <DirLight helper={helperMode} position={[0, -1, 0]} intensity={0.3} />
      <DirLight helper={helperMode} position={[0, 1, 0]} intensity={0.3} />
      <SpotLights helper={helperMode} />
      <OrbitControls />
      <Resize>
        <Center top>
          <group>
            {geo.map((g, i) => (
              <Face
                setFaceClassSelected={setFaceClassSelected}
                geo={g}
                isColorByClass={!!showColor}
                faceClass={faceClasses[i]}
              />
            ))}
          </group>
        </Center>
      </Resize>
    </Canvas>
  );
}

function LoadingScreen() {
  const [loadingText, setLoadingText] = useState("Loading");
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((loadingText) => {
        switch (loadingText.length) {
          case 7:
            return "Loading .";
          case 9:
            return "Loading ..";
          case 10:
            return "Loading ...";
          case 11:
            return "Loading";
          default: {
            throw new Error("Invalid loading text");
          }
        }
      });
    }, 500);
    return () => clearInterval(interval);
  });

  return (
    <div className="h-full flex items-center justify-center text-6xl relative">
      <div className="relative min-w-[300px]">
        <div className="text-6xl [text-shadow:_2.0px_1px_0px_rgb(128,140,140)] text-[#d3d7d9] absolute top-0 left-0 z-20">
          {loadingText}
        </div>
        <div className="text-6xl [text-shadow:_4px_2px_0px_rgb(40,57,66)] text-[rgb(40,57,66)] absolute top-0 left-0 z-10">
          {loadingText}
        </div>
      </div>
    </div>
  );
}

export type FaceClass =
  | "stock"
  | "rectangular_through_slot"
  | "chamfer"
  | "triangular_pocket"
  | "6sides_passage"
  | "slanted_through_step"
  | "triangular_through_slot"
  | "rectangular_blind_slot"
  | "triangular_blind_step"
  | "rectangular_blind_step"
  | "rectangular_passage"
  | "2sides_through_step"
  | "6sides_pocket"
  | "triangular_passage"
  | "rectangular_pocket"
  | "rectangular_through_step";

function Face(props: {
  geo: BufferGeometry;
  isColorByClass: boolean;
  faceClass: FaceClass;
  setFaceClassSelected: (faceClass: FaceClass | undefined) => void;
}) {
  const { geo, isColorByClass, faceClass, setFaceClassSelected } = props;

  return (
    <mesh
      geometry={geo}
      rotation-x={-Math.PI / 2}
      onPointerOver={(e) => {
        e.stopPropagation();
        setFaceClassSelected(faceClass);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setFaceClassSelected(undefined);
      }}
    >
      <meshStandardMaterial
        attach="material"
        color={isColorByClass ? convertClassToColor(faceClass) : "#e5e5e5"}
        emissive={isColorByClass ? "#222222" : "#2f434e"}
        roughness={0.5}
        metalness={0.5}
      />
    </mesh>
  );
}

function DirLight(props: {
  position: [number, number, number];
  intensity: number;
  helper?: boolean;
}) {
  const { position, intensity, helper } = props;
  const dirLight = useRef<any>();
  useHelper(dirLight, DirectionalLightHelper, 1, "red");
  return (
    <directionalLight
      shadow-mapSize-height={512}
      shadow-mapSize-width={512}
      castShadow
      visible={true}
      ref={helper ? dirLight : undefined}
      intensity={intensity}
      position={position}
    />
  );
}

function SpotLightWrapper(props: {
  helper?: boolean;
  position: [number, number, number];
  target: [number, number, number];
}) {
  const { position, target, helper } = props;
  const spotLight = useRef<any>();
  useHelper(spotLight, SpotLightHelper, 1);
  return (
    <spotLight
      ref={helper ? spotLight : undefined}
      penumbra={1}
      intensity={1.2}
      decay={1.5}
      angle={0.25}
      shadow-mapSize-height={512}
      shadow-mapSize-width={512}
      castShadow
      visible={true}
      target-position={target}
      position={position}
    />
  );
}

function SpotLights(props: { helper?: boolean }) {
  const { helper } = props;
  return (
    <>
      <SpotLightWrapper
        helper={helper}
        target={[0.33, 0, 0.33]}
        position={[0.75, 2, 0.75]}
      />
      <SpotLightWrapper
        helper={helper}
        target={[-0.33, 0, 0.33]}
        position={[-0.75, 2, 0.75]}
      />
      <SpotLightWrapper
        helper={helper}
        target={[-0.33, 0, -0.33]}
        position={[-0.75, 2, -0.75]}
      />
      <SpotLightWrapper
        helper={helper}
        target={[0.33, 0, 0.33]}
        position={[0.75, -2, 0.75]}
      />
      <SpotLightWrapper
        helper={helper}
        target={[-0.33, 0, 0.33]}
        position={[-0.75, -2, 0.75]}
      />
      <SpotLightWrapper
        helper={helper}
        target={[-0.33, 0, -0.33]}
        position={[-0.75, -2, -0.75]}
      />
    </>
  );
}
