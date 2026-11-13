import React from "react";
import { Composition } from "remotion";
import { Keynote } from "./scene";
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Keynote"
    component={Keynote}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
    calculateMetadata={({ props }) => {
      const p = (props as any).project;
      const fps = p?.fps || 30;
      const duration = (p?.scenes || []).reduce((sum: number, s: any) => sum + s.duration, 0);
      return { durationInFrames: Math.max(1, Math.ceil(duration * fps)), fps, width: p.canvas.width, height: p.canvas.height };
    }}
  />
);
