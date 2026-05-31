'use client';

import React, { useEffect } from 'react';
import { ShaderGradient, ShaderGradientCanvas } from 'shadergradient';
import * as reactSpring from '@react-spring/three';

export function ShaderGradientBackground() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (
          args[0] &&
          typeof args[0] === 'string' &&
          (args[0].includes('THREE.Clock') || 
           args[0].includes('dampingFactor') || 
           args[0].includes('orbit-controls'))
        ) {
          return;
        }
        originalWarn(...args);
      };
      return () => {
        console.warn = originalWarn;
      };
    }
  }, []);
  const canvasProps = {
    importedFiber: reactSpring,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }
  } as any;

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden bg-[#0a0a14]">
      <ShaderGradientCanvas {...canvasProps}>
        <ShaderGradient
          {...({
            animate: "on",
            axesHelper: "on",
            bgColor1: "#000000",
            bgColor2: "#000000",
            brightness: 1.1,
            cAzimuthAngle: 180,
            cDistance: 3.9,
            cPolarAngle: 115,
            cameraZoom: 1,
            color1: "#6366f1",
            color2: "#a855f7",
            color3: "#0a0a14",
            destination: "onCanvas",
            embedMode: "off",
            envPreset: "city",
            format: "gif",
            fov: 45,
            frameRate: 10,
            gizmoHelper: "hide",
            grain: "off",
            lightType: "3d",
            pixelDensity: 1,
            positionX: -0.5,
            positionY: 0.1,
            positionZ: 0,
            range: "disabled",
            rangeEnd: 40,
            rangeStart: 0,
            reflection: 0.1,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 235,
            shader: "defaults",
            type: "waterPlane",
            uAmplitude: 0.3,
            uDensity: 1.1,
            uFrequency: 5.5,
            uSpeed: 0.1,
            uStrength: 2.4,
            uTime: 0.2,
            wireframe: false,
          } as any)}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
