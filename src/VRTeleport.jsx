import { Raycaster, Vector3 } from "three";
import { useCallback, useRef, useState } from "react";
import { useXR, Interactive } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'

export function TeleportZone(props){
    return(
        <>
            <pointLight position={[0, 0.5, 0]} args={[0xff00ff, 2, 0.6]}/>
            <mesh position={[0, 0.5, 0]}>
                <coneBufferGeometry args={[0.1, 0.5, 6]} attach="geometry" />
                <meshBasicMaterial attach="material" color={0xff00ff} />
            </mesh>
        </>
    )
}

export default function VRTeleport(props){
    const {
        Place = TeleportZone,
        useNormal = true,
        ControllerIndex = 0
    } =  props;

    const [IsHovered, setIsHovered] = useState(false);
    const target = useRef();
    const targetLoc = useRef();
    const ray = useRef(new Raycaster());

    const rayPositionDirection = useRef({
        position: new Vector3(),
        direction: new Vector3()
    });

    const { controllers, player } = useXR()

    useFrame(() => {
        if(IsHovered && controllers.length > 0 && ray.current && target.current && targetLoc.current){

            controllers[ControllerIndex].controller.getWorldDirection(rayPositionDirection.current.direction);
            controllers[ControllerIndex].controller.getWorldPosition(rayPositionDirection.current.position);

            rayPositionDirection.current.direction.multiplyScalar(-1);
            ray.current.set(rayPositionDirection.current.position, rayPositionDirection.current.direction);

            const [intersaction] = ray.current.intersectObject(target.current);

            if (intersaction) {
                if (useNormal) {

                    const p = intersaction.point;

                    targetLoc.current.position.set(0,0,0);

                    const n = intersaction.face.normal.clone();
                    n.transformDirection(intersaction.object.matrixWorld);

                    targetLoc.current.lookAt(n);
                    targetLoc.current.rotateOnAxis(new Vector3(1,0,0), Math.PI / 2);
                    targetLoc.current.position.copy(p);
                } else {
                    targetLoc.current.position.copy(intersaction.point);
                }
            }
        }
    })

    const click = useCallback(() => {

        if(IsHovered){
            player.position.copy(new THREE.Vector3(
                targetLoc.current.position.x,
                targetLoc.current.position.y+5,
                targetLoc.current.position.z));
            if(useNormal){
                player.rotation.copy(targetLoc.current.rotation);
            }
        }
    },[IsHovered, useNormal]);

    return(
        <>
         {IsHovered && (<group ref={targetLoc}> 
         <Place/>
         </group>)}
         <Interactive
            onSelect={click}
            onHover={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}>
            <group ref={target}>{props.children}</group>
         </Interactive>  
        </>
    )
}