import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Suspense, useRef} from 'react'
import { Loader, Box, Sky } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useControls } from 'leva'
import gamingRoomModelGlb from './assets/gaming_room.glb'
import roomModelGlb from './assets/room.glb'
import smallModelGlb from './assets/tiny_room.glb'
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
		<mesh visible={false} position={[0, -1.5, 20]} rotation={[-Math.PI / 2, 0, 0]} {...props}>
			<planeBufferGeometry args={[30, 50]} attach="geometry" />
			<meshStandardMaterial attach="material" color={0x767ee1} />
		</mesh>
	);
}

const Scene = () => {

  

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
      
    </>
  );
};

function App() {

  const gamingRoomModel = useLoader(GLTFLoader, gamingRoomModelGlb)
  const roomModel = useLoader(GLTFLoader,  roomModelGlb)
  const smallModel = useLoader(GLTFLoader, smallModelGlb)

  const rotationModelA = useControls('RotationRoomA', {
    x: { value: 0, min: 0, max: 360, step: 1 },
    y: { value: 0, min: 0, max: 360, step: 1 },
    z: { value: 0, min: 0, max: 360, step: 1 }
  })

  const rotationModelB = useControls('RotationRoomB', {
    x: { value: 0, min: 0, max: 360, step: 1 },
    y: { value: 190, min: 0, max: 360, step: 1 },
    z: { value: 0, min: 0, max: 360, step: 1 }
  })

  const rotationModelC = useControls('RotationRoomC', {
    x: { value: 0, min: 0, max: 360, step: 1 },
    y: { value: 0, min: 0, max: 360, step: 1 },
    z: { value: 0, min: 0, max: 360, step: 1 }
  })

  const cameraHeight = useControls('CameraHeight', {
    y: { value: 2.537, min: 0, max: 360, step: 0.5 }
  })

  return (
    <>
      <VRButton/>
      <Canvas shadows dpr={[1, 2]} >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
        <mesh position={[0,0,5]} scale={[1,1,1]} rotation={[rotationModelA.x, rotationModelA.y, rotationModelA.z]}>
        <primitive object={ roomModel.scene } />
        </mesh>
        <mesh position={[0,-1.5,35]} scale={[0.05, 0.04, 0.05]} rotation={[rotationModelB.x, rotationModelB.y, rotationModelB.z]}>
          <primitive object={ smallModel.scene } />
        </mesh>
        {/* <mesh position={[40,-2.5,30]} scale={[1,1,1]} rotation={[rotationModelC.x, rotationModelC.y, rotationModelC.z]}>
          <primitive object={ gamingRoomModel.scene } />
        </mesh> */}
          <Scene/>
          <FPSControls 
            camProps={{
              makeDefault: true,
              fov: 80,
              position: [0, cameraHeight.y, 0.7]
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