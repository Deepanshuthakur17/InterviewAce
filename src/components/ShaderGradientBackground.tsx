import React from 'react';

export function ShaderGradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none bg-[#030014]">
      {/* Deep blue/purple blurred circles for the glow effect */}
      <div className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] rounded-full blur-[80px]" style={{ backgroundImage: 'radial-gradient(circle, rgba(29,78,216,0.8), transparent)' }} />
      <div className="absolute top-[15%] right-[-5%] w-[40%] h-[60%] rounded-full blur-[100px]" style={{ backgroundImage: 'radial-gradient(circle, rgba(147,51,234,0.8), transparent)' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full blur-[120px]" style={{ backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.8), transparent)' }} />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full blur-[80px]" style={{ backgroundImage: 'radial-gradient(circle, rgba(56,189,248,0.5), transparent)' }} />

      {/* Grain noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
