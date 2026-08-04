# PetOS official pets

`manifest.json` is the lightweight catalog consumed by PetOS. Keep preview images small; the desktop app loads the full spritesheet only after the user selects **Adopt**.

Recommended layout:

```text
official-pets/
  manifest.json
  mint-summer/
    preview.png
    pet.json
    spritesheet.webp
```

Example entry:

```json
{
  "id": "mint-summer",
  "displayName": "Mint · Summer",
  "description": "A sunny seasonal look for Mint.",
  "species": "cat",
  "version": "1.0.0",
  "previewUrl": "https://raw.githubusercontent.com/omlovelife/PetOS-Agent/main/official-pets/mint-summer/preview.png",
  "spritesheetUrl": "https://raw.githubusercontent.com/omlovelife/PetOS-Agent/main/official-pets/mint-summer/spritesheet.webp",
  "petJsonUrl": "https://raw.githubusercontent.com/omlovelife/PetOS-Agent/main/official-pets/mint-summer/pet.json",
  "atlas": {
    "cols": 8,
    "rows": 11,
    "cellWidth": 192,
    "cellHeight": 208,
    "framesPerState": [6, 8, 8, 4, 5, 8, 6, 6, 6, 8, 8]
  }
}
```

Rules:

- `id` is permanent and uses lowercase letters, numbers, and hyphens.
- Assets must use HTTPS URLs inside `omlovelife/PetOS-Agent`.
- `preview.png` should be a small square avatar and should not contain the full animation atlas.
- A spritesheet may be at most 30 MB; `pet.json` may be at most 512 KB.
- Update `updatedAt` whenever the catalog changes.
