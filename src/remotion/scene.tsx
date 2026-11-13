import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig, staticFile } from "remotion";

const hex = (v = "#080D1C") => v.startsWith("#") ? v : `#${v}`;
const resolveAsset = (src: string) => /^https?:\/\//.test(src) ? src : staticFile(src);

const Element: React.FC<{el:any; localFrame:number; fps:number}> = ({el, localFrame, fps}) => {
  const t = localFrame / fps;
  const delay = el.delay || 0;
  const d = el.enterDuration || 0.7;
  const progress = Math.max(0, Math.min(1, (t - delay) / d));
  const opacity = interpolate(progress, [0, 1], [0, el.opacity ?? 1], { extrapolateRight: "clamp" });
  const y = interpolate(progress, [0, 1], [el.y + 34, el.y], { extrapolateRight: "clamp" });
  const scale = interpolate(progress, [0, 1], [el.type === "image" ? 0.96 : 1, 1], { extrapolateRight: "clamp" });
  const common:any = { position:"absolute", left:el.x||0, top:y, width:el.w||0, height:el.h||0, opacity, transform:`scale(${scale})` };
  if (el.type === "text") return <div style={{...common,color:hex(el.color||"#FFFFFF"),fontSize:el.fontSize||48,fontWeight:el.bold?700:400,fontFamily:el.fontFace||"Arial, sans-serif",textAlign:el.align||"left",lineHeight:1.15,whiteSpace:"pre-wrap",display:"flex",alignItems:"center",justifyContent:el.align==="center"?"center":"flex-start"}}>{el.text}</div>;
  if (el.type === "image") return <Img src={resolveAsset(el.src)} style={{...common,objectFit:el.fit||"contain"}} />;
  if (el.type === "video") return <OffthreadVideo src={resolveAsset(el.src)} style={{...common,objectFit:el.fit||"cover"}} />;
  if (el.type === "shape") return <div style={{...common,background:hex(el.fill||el.color||"#FFFFFF"),borderRadius:el.shape==="ellipse"?"50%":el.radius||0,border:el.border||"none"}} />;
  return null;
};

const SceneView: React.FC<{scene:any; duration:number; project:any}> = ({scene,duration,project}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bg = hex(scene.background || project.themeTokens?.background || "#080D1C");
  return <AbsoluteFill style={{background:bg,overflow:"hidden"}}>
    {scene.backgroundImage && <Img src={resolveAsset(scene.backgroundImage)} style={{position:"absolute",width:"100%",height:"100%",objectFit:"cover"}} />}
    <AbsoluteFill style={{background:scene.overlay || "transparent"}} />
    {(scene.elements||[]).map((el:any,i:number)=><Element key={`${scene.id}-${i}`} el={el} localFrame={frame} fps={fps}/>)}
    {(scene.audio||[]).map((a:any,i:number)=><Audio key={`${scene.id}-audio-${i}`} src={resolveAsset(a.src)} volume={a.volume ?? 1} startFrom={Math.round((a.trimStart||0)*fps)} />)}
  </AbsoluteFill>;
};

export const Keynote: React.FC<any> = ({project}) => {
  const fps = project?.fps || 30;
  let from = 0;
  const scenes = (project?.scenes || []).map((scene:any) => {
    const durationInFrames = Math.max(1,Math.round(scene.duration*fps));
    const entry = {scene,from,durationInFrames};
    from += durationInFrames;
    return entry;
  });
  return <AbsoluteFill>
    {scenes.map(({scene,from,durationInFrames}:any)=><Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
      <SceneView scene={scene} duration={durationInFrames/fps} project={project}/>
    </Sequence>)}
  </AbsoluteFill>;
};
