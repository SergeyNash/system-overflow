# Motion Art Prompts

## Generation prompts

### Empty environment

```text
Use case: precise-object-edit. Use the attached A2 pixel cafe as visual reference. Create an EMPTY environment export for an animation study, one single landscape 3:2 scene (NOT reference sheet, no title, no phone panel). Warm crisp 16-bit pixel cafe cutaway, open front orthographic elevated camera. Kitchen along rear, clear stove left at about 25% width and 25% height, empty teal pickup counter centered about 50% width and 45% height, THREE small distinct EMPTY wooden guest tables at foreground positions about (28%,70%), (52%,83%), (76%,70%). Open entrance front-left, broad uncluttered walkable floor. Retain cream butter walls, teal cabinets, terracotta floors, stepped dark outlines, restrained environment from A2. IMPORTANT remove ALL human figures, ALL dishes/food, ALL apron hanging on peg, ALL pace dial, ALL labels/UI/header/buttons and all character shadows. Empty stove surface and empty counter. Maximum one decorative plant and no patterned rug. Leave bare warm wall area above rear stove and beside right pickup edge for separately implemented controls. Tables and furniture naturally rendered with same pixel aesthetic as chosen A2. No smooth illustration, no 3D, no text, no diagrams, no watermark. Preserve highly readable large shapes; do not embed animated objects in background.
```

### Working and carrying poses

```text
Use case: stylized-concept. Asset type: transparent sprite reference atlas for a pixel cafe animation study.
Use the provided selected A2 cafe for style and identities. Create ONE transparent PNG with exactly 8 isolated sprites in a STRICT 4 columns x 2 rows equal-size grid. Each cell has one full figure centered, entire figure inside its cell with generous transparent gutters. NO backgrounds, floor, chairs, tables, text, borders, labels or shadows outside the character.
True transparent alpha background, not a checkerboard drawing. Crisp 16-bit pixel shapes, same source pixel density for all figures, no smooth vector art. Characters face to the right/front-three-quarter camera and have consistent scale and foot baseline.
Row1 left to right:
1 the white-hat male cook with white jacket and teal apron, stirring pose A holding a skillet;
2 EXACT SAME cook and scale, stirring pose B with arm slightly changed;
3 the brown-haired ponytail female server in white blouse and teal apron, carrying exactly one prepared plate, walking pose A with left foot forward;
4 EXACT SAME server and scale and held plate, walking pose B with right foot forward.
Row2 left to right:
5 same green-shirt brown-haired waiting guest, seated upper-body and legs bent, elbows raised chin on hand (chair/table will be rendered separately, do not include either);
6 same blue-shirt orange-haired guest seated waiting, hands resting forward (no furniture);
7 same orange-shirt dark-haired guest seated eating, hands holding fork and ONE plate (no furniture);
8 distinct red-haired short-haired serving helper in white shirt and mustard apron carrying ONE plate, walking pose.
Bodies and faces expressive, friendly understated. Do not duplicate or omit cells. No extra objects, no modern vector polish, no text. This is an initial atlas for a motion proof, production frame registration will be validated separately.
```

### Empty-hand return poses

```text
Use case: stylized-concept. A transparent 2x2 equal-cell sprite atlas for the SAME pixel cafe. Reference A2 style and character identities. Exactly four isolated full-body walking figures, no background, NO plates or objects in hands, no shadows, no text. Transparent alpha, generous gaps.
Top-left: brown ponytail female server, white blouse, teal apron, walking right with EMPTY hands, left foot forward.
Top-right: same server same scale, right foot forward.
Bottom-left: short red-haired helper in white shirt and mustard apron walking right with EMPTY hands, left foot forward.
Bottom-right: same helper, right foot forward.
Consistent crisp stepped 16-bit pixels, expressive small faces, same foot baseline within each row. Keep each entire character strictly inside its own cell with at least 40-pixel padding, all figures same scale. Do not include plates, food, cookware or furniture.
```
