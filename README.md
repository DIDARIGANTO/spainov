# SPAINOV® — Ilyas Spainov · Mobilegraphy / SMM / Web

Премиальный брендинговый сайт-портфолио. Vite + Three.js + GSAP ScrollTrigger + Lenis.
Один непрерывный «фильм»: объектив → кадр → смартфон → social feed → browser → контакт.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production → dist/
npm run preview    # просмотр сборки
```

## Структура

```
index.html                 — все сцены (семантическая разметка)
src/main.js                — прелоадер, Lenis, запуск модулей
src/modules/lens.js        — 3D-объектив (Three.js), морф LENS → PHONE CAMERA → WINDOW
src/modules/scenes.js      — все scroll-сцены (GSAP ScrollTrigger)
src/modules/ui.js          — навигация, магнитные кнопки, контактный лист, портфолио, модалка проекта
src/modules/media.js       — медиа-плейсхолдеры + загрузка реальных видео
src/modules/data.js        — РЕЕСТР МЕДИА и ПРОЕКТЫ (здесь меняются данные)
src/modules/cursor.js      — кастомный курсор (VIEW / OPEN / EXPLORE / DRAG)
src/modules/sound.js       — синтезированный sound design (по умолчанию OFF)
src/styles/                — base / ui / scenes
public/media/              — сюда кладутся реальные видео и фото
```

## Медиа из Instagram

В `public/media/ig/` лежат реальные обложки 12 reels и аватар из @spainov.ilyas.
Реестр `REELS` в `src/modules/data.js` хранит для каждого reel: обложку, код публикации,
название, тип, лайки, комментарии и ссылку. Из него собираются блок «LATEST ON INSTAGRAM»,
портфолио, лента в сцене SOCIAL, смартфон в сцене 01 и film strips в сцене 4000+.
`PROFILE` — подписчики, био и highlights.

Сами видео Instagram без входа не отдаёт, поэтому фото показываются как «живые кадры»
(медленный наезд камеры). Чтобы заменить обложку на видео, добавьте `src` рядом с `img`.

## Как заменить плейсхолдеры на реальные материалы

Все медиа на сайте — элементы `.media[data-media="id"]`. Для id с `img` показывается фото
с движением, с `src` — видео, без того и другого — процедурный плейсхолдер.
Чтобы подставить реальное видео, откройте `src/modules/data.js` и добавьте `src`:

```js
export const MEDIA = {
  'hero-reel': { src: '/media/hero.mp4', poster: '/media/hero.jpg' },   // видео внутри объектива
  portrait:    { src: '/media/portrait.jpg' },                           // портрет (см. ниже)
  r01: { src: '/media/reels/r01.mp4' },                                  // вертикальные reels в смартфоне (r01–r06)
  s01: { src: '/media/strips/s01.mp4' },                                 // film strips в блоке 4000+ (s01–s16)
  w01: { src: '/media/web/w01.mp4' },                                    // превью сайтов в browser window (w01–w04)
  f01: { src: '/media/work/f01.mp4' },                                   // портфолио FILM (f01–f10)
  p01: { src: '/media/work/p01.mp4' },                                   // портфолио SOCIAL (p01–p08)
  x01: { src: '/media/work/x01.mp4' },                                   // портфолио WEB (x01–x07)
};
```

Видео: H.264 mp4 (или webm), без звука, 720p–1080p, короткие лупы 5–12 с, ≤ 3–6 МБ.
Горизонтальные — 16:9, вертикальные — 9:16. Видео грузятся лениво и играют только в зоне видимости.

**Портрет** (`portrait`): для фотографии вместо видео положите jpg/webp и укажите `src` —
`media.js` создаст `<video>`; для статичного изображения замените в `index.html` блок
`<div class="media portrait__media" data-media="portrait">` на
`<div class="media portrait__media"><img src="/media/portrait.jpg" alt="Ilyas Spainov"></div>`.
Чёрно-белая обработка, тёплая вспышка и зерно накладываются CSS автоматически.

**Проекты** в портфолио — массив `PROJECTS` в `data.js`: `title`, `type`, `year`, `service`,
`ratio` (`16/9`, `4/5`, `9/16`), `mode` (`film` / `social` / `web`).

## Контакты и ссылки

WhatsApp с готовым сообщением «Ильяс, хочу обсудить проект.» и Instagram
заданы в `index.html` (кнопки) и `data.js` (константы).

## Производительность

- 3D загружается динамическим импортом после первого paint.
- Three.js, GSAP/Lenis — отдельные чанки.
- Плейсхолдеры рисуются на 24 fps только для видимых элементов.
- `prefers-reduced-motion` учитывается.
