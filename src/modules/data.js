/**
 * MEDIA REGISTRY
 * ----------------------------------------------------------
 * Every `.media[data-media="id"]` element on the page looks up its entry here.
 *   { src: '/media/x.mp4' }   → real video (muted loop, lazy, plays in view)
 *   { img: '/media/x.jpg' }   → still photo with a slow "living" camera move
 *   { tone: 'warm' }          → procedural cinematic placeholder
 *
 * The Instagram reels below are the real covers from @spainov.ilyas.
 * To upgrade any of them to a video, add `src` next to `img` (poster stays).
 */
const IG = `${import.meta.env.BASE_URL}media/ig/`;

export const REELS = [
  { id: 'r01', img: IG + 'r01.jpg', code: 'Dak2ViaIVfp', user: 'spainov_1', title: 'Сборка рентген-аппарата', title_en: 'X-ray machine assembly', type: 'BUSINESS · MEDICAL', likes: 105, comments: 7, date: '2026-07', tag: 'BUSINESS' },
  { id: 'r02', img: IG + 'r02.jpg', code: 'DZUmfZitnk8', user: 'spainov_1', title: '5 минут на сборку', title_en: '5 minutes to set up', type: 'GEAR · PROCESS', likes: 407, comments: 16, date: '2026-06', tag: 'PRODUCT' },
  { id: 'r03', img: IG + 'r03.jpg', code: 'DZaTjxSNFqX', user: 'spainov_1', title: 'Double 2 · Atyrau Botanic', title_en: 'Double 2 · Atyrau Botanic', type: '8 VIDEOS · 4 HOURS', likes: 122, comments: 6, date: '2026-06', tag: 'BUSINESS' },
  { id: 'r04', img: IG + 'r04.jpg', code: 'DYNYrVaIqqz', user: 'spainov_1', title: 'Запуск блога', title_en: 'Launching the blog', type: 'PEOPLE · LIFESTYLE', likes: 111, comments: 77, date: '2026-05', tag: 'LIFESTYLE' },
  { id: 'r05', img: IG + 'r05.jpg', code: 'DWyIdyFMR2J', user: 'spainov.ilyas', title: 'На кухне. За камерой', title_en: 'In the kitchen. Behind the camera', type: 'BEHIND THE SCENES', likes: 19, comments: 0, date: '2026-04', tag: 'LIFESTYLE' },
  { id: 'r06', img: IG + 'r06.jpg', code: 'DZfdxbkIJRQ', user: 'spainov_1', title: 'Обновление Instagram', title_en: 'Instagram update', type: 'SMM · EXPERT', likes: 50, comments: 9, date: '2026-06', tag: 'REELS' },
  { id: 'r07', img: IG + 'r07.jpg', code: 'Dd8RP3ZMdf_', user: 'spainov.ilyas', title: 'Концерт. Живой звук', title_en: 'Concert. Live sound', type: 'EVENT · CONCERT', likes: 1, comments: 0, date: '2026-09', tag: 'EVENTS' },
  { id: 'r08', img: IG + 'r08.jpg', code: 'Dd7JyIRsVSf', user: 'spainov.ilyas', title: 'Ресторан. Вкус в кадре', title_en: 'Restaurant. Taste on camera', type: 'RESTAURANT · FOOD', likes: 3, comments: 0, date: '2026-09', tag: 'PRODUCT' },
  { id: 'r09', img: IG + 'r09.jpg', code: 'Dd50wQVsUh3', user: 'auracatering.ast', title: 'Aura Table Catering × Кайрат Нуртас', title_en: 'Aura Table Catering × Kairat Nurtas', type: 'EVENT · CATERING', likes: 29, comments: 4, date: '2026-09', tag: 'EVENTS' },
  { id: 'r10', img: IG + 'r10.jpg', code: 'Dd1_mFtMgFk', user: 'spainov.ilyas', title: 'Культегин. Меню', title_en: 'Kultegin. The menu', type: 'RESTAURANT · MENU', likes: 1, comments: 0, date: '2026-09', tag: 'PRODUCT' },
  { id: 'r11', img: IG + 'r11.jpg', code: 'DdzayUBs6Y3', user: 'spainov.ilyas', title: 'Школа. Первый класс', title_en: 'School. First grade', type: 'EDUCATION · PEOPLE', likes: 3, comments: 0, date: '2026-09', tag: 'PEOPLE' },
  { id: 'r12', img: IG + 'r12.jpg', code: 'Ddw2C5ks9cz', user: 'spainov.ilyas', title: 'Салон. Образ', title_en: 'Salon. The look', type: 'BEAUTY · PEOPLE', likes: 2, comments: 0, date: '2026-09', tag: 'PEOPLE' },
];
export const reelUrl = (r) => `https://www.instagram.com/${r.user}/reel/${r.code}/`;

export const PROFILE = {
  handle: 'spainov.ilyas',
  url: 'https://www.instagram.com/spainov.ilyas/',
  avatar: IG + 'avatar.jpg',
  followers: 1688,
  following: 64,
  title: 'СММ | SMM | МОБИЛОГРАФИЯ | ТАРГЕТ | REELS | АСТАНА',
  bio: ['Более 4000+ отснятых видео', '200+ проектов', '7 лет в SMM', '12 лет в общепите'],
  highlights: [
    { name: 'VIDEO', img: IG + 'h1.jpg' },
    { name: 'КЕЙСЫ', img: IG + 'h2.jpg' },
    { name: 'PRICE', img: IG + 'h3.jpg' },
    { name: 'АФИША', img: IG + 'h4.jpg' },
    { name: 'РЕЗУЛЬТАТ', img: IG + 'h5.jpg' },
    { name: 'ПРОЦЕСС', img: IG + 'h6.jpg' },
  ],
};

const R = Object.fromEntries(REELS.map((r) => [r.id, r.img]));

export const MEDIA = {
  // inside the lens / first frame — Ilyas behind the gimbal
  'hero-reel': { img: R.r01, pos: '50% 45%' },
  // editorial portrait: Ilyas on set in the kitchen
  portrait: { img: R.r05, pos: '50% 20%' },

  // film strips in the 4000+ scene (16:9 crops of vertical reels)
  s01: { img: R.r02, pos: '50% 60%' }, s02: { img: R.r07, pos: '50% 30%' }, s03: { img: R.r03, pos: '50% 40%' }, s04: { img: R.r10, pos: '50% 50%' },
  s05: { img: R.r05, pos: '50% 30%' }, s06: { img: R.r12, pos: '50% 25%' }, s07: { img: R.r01, pos: '50% 45%' }, s08: { img: R.r08, pos: '50% 35%' },
  s09: { img: R.r04, pos: '50% 50%' }, s10: { img: R.r11, pos: '50% 25%' }, s11: { img: R.r06, pos: '50% 30%' }, s12: { img: R.r09, pos: '50% 45%' },
  s13: { img: R.r03, pos: '50% 70%' }, s14: { img: R.r02, pos: '50% 35%' }, s15: { img: R.r07, pos: '50% 55%' }, s16: { img: R.r01, pos: '50% 65%' },

  // vertical reels inside the phone (01 MOBILEGRAPHY) — REELS / SHORT FORM / PRODUCT / LIFESTYLE / EVENTS / BUSINESS
  p01: { img: R.r06 }, p02: { img: R.r12 }, p03: { img: R.r10 }, p04: { img: R.r04 }, p05: { img: R.r07 }, p06: { img: R.r01 },

  // previews inside the 3D browser (03 WEB)
  w01: { img: R.r02, pos: '50% 55%' }, w02: { img: R.r08, pos: '50% 30%' }, w03: { img: R.r10, pos: '50% 45%' }, w04: { img: R.r12, pos: '50% 25%' },
};

/**
 * PORTFOLIO — built from real reels. `href` opens the original on Instagram.
 */
const byId = Object.fromEntries(REELS.map((r) => [r.id, r]));
const proj = (id, mode, ratio, over = {}) => {
  const r = byId[id];
  return { id: `${mode}-${id}`, mode, ratio, title: r.title, title_en: r.title_en, type: r.type, year: Number(r.date.slice(0, 4)), service: over.service || 'MOBILEGRAPHY', media: `${mode}-${id}`, img: r.img, pos: over.pos, href: reelUrl(r), likes: r.likes, comments: r.comments, ...over };
};

export const PROJECTS = [
  // FILM — 2 wide · 3 tall · 2 wide · 3 tall
  proj('r02', 'film', '16/9', { pos: '50% 60%' }),
  proj('r07', 'film', '16/9', { pos: '50% 30%' }),
  proj('r01', 'film', '4/5', { pos: '50% 40%' }),
  proj('r03', 'film', '4/5', { pos: '50% 45%' }),
  proj('r05', 'film', '4/5', { pos: '50% 25%' }),
  proj('r09', 'film', '16/9', { pos: '50% 45%' }),
  proj('r08', 'film', '16/9', { pos: '50% 35%' }),
  proj('r10', 'film', '4/5', { pos: '50% 50%' }),
  proj('r11', 'film', '4/5', { pos: '50% 25%' }),
  proj('r12', 'film', '4/5', { pos: '50% 25%' }),

  // SOCIAL — vertical reels as published
  proj('r02', 'social', '9/16', { service: 'SMM' }),
  proj('r04', 'social', '9/16', { service: 'SMM' }),
  proj('r06', 'social', '9/16', { service: 'SMM' }),
  proj('r03', 'social', '9/16', { service: 'SMM' }),
  proj('r09', 'social', '9/16', { service: 'SMM' }),
  proj('r11', 'social', '9/16', { service: 'SMM' }),
  proj('r12', 'social', '9/16', { service: 'SMM' }),
  proj('r01', 'social', '9/16', { service: 'SMM' }),

  // WEB — brand sites (concept previews until live links arrive)
  { id: 'web-01', mode: 'web', title: 'Restaurant Brand Site', type: 'BRAND WEBSITE · CONCEPT', year: 2026, service: 'WEB', ratio: '16/9', media: 'x01', img: R.r10, pos: '50% 50%' },
  { id: 'web-02', mode: 'web', title: 'Catering Landing', type: 'LANDING PAGE · CONCEPT', year: 2026, service: 'WEB', ratio: '16/9', media: 'x02', img: R.r09, pos: '50% 40%' },
  { id: 'web-03', mode: 'web', title: 'Beauty Studio', type: 'DIGITAL EXPERIENCE · CONCEPT', year: 2025, service: 'WEB', ratio: '4/5', media: 'x03', img: R.r12, pos: '50% 20%' },
  { id: 'web-04', mode: 'web', title: 'Education Microsite', type: 'LANDING PAGE · CONCEPT', year: 2025, service: 'WEB', ratio: '4/5', media: 'x04', img: R.r11, pos: '50% 25%' },
  { id: 'web-05', mode: 'web', title: 'Creator Portfolio', type: 'DIGITAL EXPERIENCE · CONCEPT', year: 2026, service: 'WEB', ratio: '4/5', media: 'x05', img: R.r05, pos: '50% 25%' },
];

export const WHATSAPP_NUMBER = '77077013718';
export const WHATSAPP = 'https://wa.me/77077013718?text=' + encodeURIComponent('Ильяс, хочу обсудить проект.');
export const INSTAGRAM = PROFILE.url;
export const PHONE = '+7 707 701 3718';
