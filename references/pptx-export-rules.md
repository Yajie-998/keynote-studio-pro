# PPTX Export Rules
## Editable mode
Native PowerPoint objects for text, simple shapes, images, and charts whenever possible.
Use native slide transitions only when supported by the target PowerPoint version and validated.

## High-fidelity mode
Render each scene as MP4 and embed it as a video object. Add a poster frame underneath or behind it.
Playback behavior varies by PowerPoint version, OS and media codec. Test on the actual show computer.
For maximum reliability, deliver the master MP4 separately.

## Limitations
- WebGL, Three.js, CSS filters, complex particle simulations and frame-accurate audio timelines cannot be represented as equivalent native PPT objects.
- Embedded video is not individually editable.
- PptxGenJS API support changes; pin dependency versions and run integration tests.
