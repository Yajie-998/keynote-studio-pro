# Animation Library
## Motion principles
- Motion explains hierarchy, causality, spatial relation or emotional emphasis.
- Use consistent easing; default cubic-bezier equivalent: ease-out for entrances, ease-in for exits, ease-in-out for spatial transitions.
- Avoid excessive bounce, random movement, continuous decorative motion.
- Respect reduced-motion requirements in interactive/web playback.

## Presets
- fade-up: opacity 0→1, y 36→0
- reveal-mask: clip-path / mask reveal
- camera-push: scale 1→1.08 with subtle position shift
- product-orbit: 3D model rotation (requires model asset)
- light-scan: animated gradient beam
- data-count: numeric interpolation
- particle-burst: GPU/canvas particle layer
- morph: SVG path interpolation where paths are compatible
- parallax: layered depth movement
- cinematic-cut: timed scene transition with audio cue

## Timing
Define animation in frames or seconds; renderer converts to frames using project fps.
Use deterministic random seeds for particles so preview and final render match.
