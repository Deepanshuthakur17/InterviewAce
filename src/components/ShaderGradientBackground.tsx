import React from 'react';
import { ShaderGradient, ShaderGradientCanvas } from 'shadergradient';
import * as reactSpring from '@react-spring/three';

export function ShaderGradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none">
      {/* @ts-ignore - shadergradient types often conflict with their own code generator */}
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          pointerEvents: 'none',
        }}
      >
        <ShaderGradient
          {...({
            animate: "on",
            brightness: 1.2,
            cAzimuthAngle: 180,
            cDistance: 3.6,
            cPolarAngle: 90,
            cameraZoom: 1,
            color1: "#ff5005",
            color2: "#dbba95",
            color3: "#d0bce1",
            destination: "onCanvas",
            embedMode: "off",
            envPreset: "city",
            format: "gif",
            fov: 45,
            frameRate: 10,
            gizmoHelper: "hide",
            grain: "on",
            lightType: "3d",
            pixelDensity: 1,
            positionX: -1.4,
            positionY: 0,
            positionZ: 0,
            range: "disabled",
            rangeEnd: 40,
            rangeStart: 0,
            reflection: 0.1,
            rotationX: 0,
            rotationY: 10,
            rotationZ: 50,
            shader: "defaults",
            type: "plane",
            uAmplitude: 1,
            uDensity: 1.3,
            uFrequency: 5.5,
            uSpeed: 0.4,
            uStrength: 4,
            uTime: 0,
            wireframe: false,
          } as any)}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
