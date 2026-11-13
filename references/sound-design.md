# Sound Design
## Tracks
- BGM: music bed
- VO: narration / TTS
- SFX: transitions, impacts, whooshes, UI cues
- AMB: environmental atmosphere

## Mix guidance
- VO is primary when present; lower BGM under speech.
- Keep headroom; avoid clipping and abrupt starts/stops.
- Use short fades at track boundaries.
- Place impact sounds on visual reveal frames, not arbitrarily.
- Confirm music and SFX license for commercial public performance.
- Provide a silent fallback render.

## Audio event schema
Each event: `time`, `asset`, `volume`, `fadeIn`, `fadeOut`, `role`, optional `duckBgm`.
