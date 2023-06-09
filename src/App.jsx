import { Canvas, useLoader } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Loader, Sky, Stats } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useControls } from 'leva'

import annotations from './annotation.json'

import gamingRoomModelGlb from './assets/gaming_room.glb'
import roomModelGlb from './assets/room.glb'
import one_pieceGlb from './assets/one_piece.glb'

import { FPSControls } from 'react-three-fpscontrols'
import { XR, Hands, Controllers, VRButton } from '@react-three/xr'
import VRTeleport from './VRTeleport'
import * as THREE from 'three'

import './App.css'
import { useMemo } from 'react'

function TeleportZone(props) {
	return (
    <>
    <mesh {...props}>
			<sphereBufferGeometry args={[0.5, 16, 16]} attach="geometry" />
			<meshStandardMaterial attach="material" color={0xffe600} roughness={0.2} metalness={0.8} opacity={0.5} transparent/>
		</mesh>
    </>
	);
}

function Floor(props) {
	return (
		<mesh visible={false} position={[0, -1.5, 30]} rotation={[-Math.PI / 2, 0, 0]} {...props}>
			<planeBufferGeometry args={[50, 75]} attach="geometry" />
			<meshStandardMaterial attach="material" color={0x767ee1} />
		</mesh>
	);
}

const Scene = () => {

  return (
    <>
      <Sky/>
    </>
  );
};

function Buttons({ gotoAnnotation }) {
  return (
    <div id="annotationsPanel">
      <ul>
        {annotations.map((a, i) => {
          return (
            <li key={i}>
              <button key={i} className="annotationButton" onClick={() => gotoAnnotation(i)}>
                {a.title}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function App() {

  const gamingRoomModel = useLoader(GLTFLoader, gamingRoomModelGlb)
  const roomModel = useLoader(GLTFLoader,  roomModelGlb)
  const one_pieceModel = useLoader(GLTFLoader, one_pieceGlb)

  const options = useMemo(() => {
    return {
      x: { value: 0, min: 0, max: 360, step: 1 },
      y: { value: 0, min: 0, max: 360, step: 1 },
      z: { value: 0, min: 0, max: 360, step: 1 }
    }
  } , [])

  const roomModelRotation = useControls('Rotate Living_ room', options)

  const gamingRoomRotation = useControls('Rotate Gaming_room', options)

  const [to, setTo] = useState({
    x: 0,
    y: 5,
    z: 0
  });

  const cameraHeight = useControls('CameraHeight', {
    // x: { value: 0, min: -100, max: 100, step: 0.5 },
    y: { value: 2.537, min: 0, max: 100, step: 0.5 },
    // z: { value: 0, min: -100, max: 100, step: 0.5 }
  })

  function gotoAnnotation(idx) {
    setTo(annotations[idx].camPos)
  }

  return (
    <>
      <VRButton/>
      <Buttons gotoAnnotation={gotoAnnotation} />
      <Canvas shadows dpr={[1, 2]}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>

        <mesh position={[-5,0,-20]} scale={[5,5,5]}>
          <primitive object={ one_pieceModel.scene } />
        </mesh>

        <mesh position={[-5,0,5]} scale={[1.3,1,1]} 
        rotation={[roomModelRotation.x, roomModelRotation.y, roomModelRotation.z]}
        >
        <primitive object={ roomModel.scene } />
        </mesh>

        <mesh position={[0,-2.5,43]} scale={[1,1,1]} 
        rotation={[gamingRoomRotation.x, gamingRoomRotation.y, gamingRoomRotation.z]}>
          <primitive object={ gamingRoomModel.scene } />
        </mesh>

          <Scene/>
          <FPSControls
            camProps={{
              makeDefault: true,
              fov: 80,
              position: [0, cameraHeight.y, 0.7]
            }}
            orbitProps={{
              target: [0, cameraHeight.y, 0]
            }}
            enableJoystick
            enableKeyboard
          
          />
        </Suspense>
        <XR>
          <VRTeleport useNormal={true} Place={TeleportZone}>
            <TeleportZone position={[0, 10, 0]}/>
            <Floor rotation={[-Math.PI / 2, 0, 0]} />
            {/* <mesh position={[0, 5, 0]}>
            <sphereBufferGeometry args={[2, 32, 16]} attach="geometry" />
            <meshBasicMaterial attach="material" color={0xe395bf} />
            </mesh> */}
          </VRTeleport>
          <Hands/>
          <Controllers/>
        </XR>
        <Stats/>
      </Canvas>
      <Loader />
    </>
  )
}

export default App