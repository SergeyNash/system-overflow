# Visual Generation Prompts

Date: 2026-10-06. Tool: built-in ImageGen. Input A is the pixel café reference already shown in project chat; A2 refines A; the state sheet uses A2 as visual/character reference. Generated PNGs remain outside this GitHub branch; these prompts preserve the intended requirements but do not guarantee identical regeneration.

## A2 composition refinement

```text
Use case: precise-object-edit. Edit the attached pixel art café concept reference into production-direction revision A2. Preserve the warmly lit 16-bit pixel style, palette, characters and same two panel format (wide left, portrait right), same room and camera and order state. Title Russian "А2 — Пиксельное кафе". Preserve "Широкий экран", "Телефон" and three simple controls "Пауза", "Сначала", "Миры".
Requested changes only: Remove about 70 percent of decorative plants, jars, hanging pans, floor and wall texture, rug patterns and extra little objects. Keep at most two plants, plain warm floor, clear broad shapes with a consistent crisp pixel grid. Retain one cook at stove, one server carrying one plate, three seated guests and one arriving guest, exactly three waiting prepared plates on pickup and three order tickets.
Make two actionable objects exceptionally legible: the stove pace dial has three clearly separate notch positions and a single pointer, with a pale cream pixel focus outline (not a giant glowing ring); enlarge the apron on the peg beside pickup, give its peg the same cream focus outline and a small integrated nameplate "Помощник". Put a similarly small dial nameplate "Темп кухни". Physical objects stay in the scene, not an external parameters panel. Limit text to those labels and existing controls.
Clarify why the guest in green is waiting: elbows on table, chin on hand, gaze toward three ready plates, empty tabletop apart from one mug. Server visibly carries one plate toward the blue guest. Other orange guest is eating. Preserve each role and do not add helpers or staff.
Improve portrait readability by allocating larger distinct vertical kitchen, pickup and table areas, ample gaps, and keeping both action objects fully inside the frame. No camera cropping, no tiny sprite clutter.
Crisp pixel contours, no vector smoothing, no 3D, no charts, no arrows, no score, no tutorial text. This is a STATIC design reference, not animation or working UI.
```

## State reference

```text
Use case: stylized-concept. Use the attached A2 pixel cafe image as an art/character reference, not an edit of its panel layout. Create a single clean pixel-art STATE REFERENCE SHEET for this same little cafe, on warm cream backdrop, 3 columns by 2 rows, each cell with spacious separated art and one Russian caption in clean legible sans serif. Title "Кафе — состояния". Authentic same 16-bit sprite style, consistent stepped outlines, teal/terracotta/butter colors. No diagrams, arrows, chart, numbers, or UI dashboard. Each cell is a cropped art vignette, not a full duplicated room.
Six cells:
1 caption "Ожидание": same green-shirt guest elbows on bare table chin on hand, mug, looking toward pickup, empty plate space.
2 caption "Работа": same white-hat cook stirring at stove, exactly one pot and restrained steam.
3 caption "Выдача": same teal-apron brown-haired serving worker walking carrying one dish toward same blue-shirt seated guest. Clear gap between worker and guest.
4 caption "Накопление": isolated same wooden/teal pickup counter with three separate prepared dishes visibly waiting; no person, no red warning overlay. Three dishes distinct and spaced.
5 caption "Действие принято": same wall-mounted physical three-position kitchen pace dial, distinct three notches and a single pointer rotated to fast, subtle cream bracket, concise label "Быстро" beneath. No fireworks.
6 caption "Пауза": same helper apron on its peg, desaturated outline, small pause symbol on the nameplate "Помощник"; scene action unavailable, no additional worker. No locking currency imagery.
Preserve identities and scale across cells, no extra characters, no smooth vector cartoon. These are static pose/state reference illustrations; no sprite-sheet claim, no animation-frame numbering, no implementation code. The overall sheet must be readable with minimal clutter.
```
