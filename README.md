# System Overflow — Little Worlds

Текущий прототип маленьких миров открывается прямо на `/`: пиксельное кафе и растение с постепенной реакцией на полив. Настройки Canvas/Pixi и компоновки находятся в раскрывающемся блоке. Полный цикл гостей пока не подключён.

Старый графовый эксперимент больше не публикуется. Его исходники и тесты сохранены для справки; старый адрес `/worlds/motion/` перенаправляет на главную. `/worlds/rendering/` открывает ту же актуальную пробу.

## Development

Use Node from `.nvmrc`. Run `npm ci`, then `npm run dev`. Run `npm run check` for type checks, tests, asset checks and production build. Use `npm run preview` to inspect the built site. Opening `index.html` directly is unsupported: the new entry uses compiled TypeScript modules.

## Project plan

- [Roadmap](docs/little-worlds-roadmap.md)
- [Technical implementation plan](docs/little-worlds/technical-implementation-plan.md)
- [Work status](docs/little-worlds/work-status.md)
- [Rendering comparison](docs/little-worlds/renderer-spike.md)
- [Architecture](docs/little-worlds/architecture.md)
