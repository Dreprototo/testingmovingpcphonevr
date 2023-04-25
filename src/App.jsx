import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useRef} from 'react'
import { Loader, Box, Sky } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import roomModelGlb from './assets/room.glb'
import { FPSControls } from 'react-three-fpscontrols'
import { XR, Hands, Controllers, VRButton } from '@react-three/xr'
import VRTeleport from './VRTeleport'
import * as THREE from 'three'

import './App.css'

function TeleportZone(props) {
	return (
		<mesh {...props}>
			<sphereBufferGeometry args={[0.5, 16, 16]} attach="geometry" />
			<meshStandardMaterial attach="material" color={0xffe600} roughness={0.2} metalness={0.8} opacity={0.5} transparent/>
		</mesh>
	);
}

function Floor(props) {
	return (
		<mesh visible={false} position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} {...props}>
			<planeBufferGeometry args={[30, 25]} attach="geometry" />
			<meshStandardMaterial attach="material" color={0x767ee1} />
		</mesh>
	);
}

const Scene = () => {

  const roomModel = useLoader(GLTFLoader,  roomModelGlb)

  const scene = useRef();
  useFrame(() => {
    scene.current.rotation.y += 0.04;
    scene.current.rotation.x += 0.04;
    scene.current.rotation.z += 0.04;
  });
  return (
    <>
      <group ref={scene}>
      <Box>
        <meshLambertMaterial color="red" />
      </Box>
    </group>
      <Sky/>
      <primitive object={ roomModel.scene } />
    </>
  );
};

function App() {

  return (
    <>
      <VRButton/>
      <Canvas shadows dpr={[1, 2]}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Scene/>
          <FPSControls
            camProps={{
              makeDefault: true,
              fov: 80,
              position: [0, 2.537, 0.7]
            }}
            orbitProps={{
              target: [0, 2.537, 0]
            }}
            enableJoystick
            enableKeyboard
          />
        </Suspense>
        <XR>
          <VRTeleport useNormal={true} Place={TeleportZone}>
            <TeleportZone position={[0, 10, 0]}/>
            <Floor rotation={[-Math.PI / 2, 0, 0]} />
            <mesh position={[0, 5, 0]}>
            <sphereBufferGeometry args={[2, 32, 16]} attach="geometry" />
            <meshBasicMaterial attach="material" color={0xe395bf} />
            </mesh>
          </VRTeleport>
          <Hands/>
          <Controllers/>
        </XR>
        {/* <DefaultXRControllers/> */}
      </Canvas>
      <Loader />
    </>
  )
}

export default App
