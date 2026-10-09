/**
 * CONTENT — services ("menu"), FAQ and media mapping for the new structure.
 * Only information from the brief and the Instagram profile is used here.
 */
import { LANG } from './i18n.js';
import { REELS } from './data.js';

const L = (ru, en) => (LANG === 'en' ? en : ru);

const IMGS = Object.fromEntries(REELS.map((r) => [r.id, r.img]));
export const SERVICES = {
  mobile: {
    label: L('МОБИЛОГРАФИЯ', 'MOBILEGRAPHY'),
    items: [
      { img: IMGS.r06, n: L('Reels-съёмка', 'Reels shoot'), d: L('Вертикальные видео под Instagram: идея, съёмка, монтаж, субтитры', 'Vertical videos for Instagram: idea, shoot, edit, captions'), m: L('ЗА 1 СЪЁМОЧНЫЙ ДЕНЬ — ДО 8 ВИДЕО', 'UP TO 8 VIDEOS PER SHOOTING DAY') },
      { img: IMGS.r02, n: L('Короткие видео', 'Short-form video'), d: L('Форматы до 60 секунд для соцсетей, рекламы и сайтов', 'Up to 60-second formats for social, ads and websites'), m: '9:16 · 4K · 24FPS' },
      { img: IMGS.r10, n: L('Рекламный контент', 'Ad content'), d: L('Видео под таргет и промо: офферы, акции, запуск продукта', 'Video for targeting and promo: offers, campaigns, product launch'), m: L('ТАРГЕТ-READY', 'TARGET-READY') },
      { img: IMGS.r08, n: L('Lifestyle-контент', 'Lifestyle content'), d: L('Атмосфера места, люди, процесс — то, за чем возвращаются', 'The atmosphere of a place, its people, the process — what people come back for'), m: L('РЕСТОРАНЫ · КАФЕ · САЛОНЫ', 'RESTAURANTS · CAFÉS · SALONS') },
      { img: IMGS.r10, n: L('Продукт и меню', 'Product and menu'), d: L('Блюда, товары, детали крупным планом с кинематографичным светом', 'Dishes, products, close-up details in cinematic light'), m: L('12 ЛЕТ В ОБЩЕПИТЕ', '12 YEARS IN HOSPITALITY') },
      { img: IMGS.r11, n: L('Люди и бизнес', 'People and business'), d: L('Эксперт в кадре, команда, интервью, клиника, школа, офис', 'Expert on camera, team, interviews, clinic, school, office'), m: L('ЭКСПЕРТНЫЕ REELS', 'EXPERT REELS') },
      { img: IMGS.r07, n: L('Съёмка событий', 'Event coverage'), d: L('Концерты, кейтеринг, презентации, открытия — репортаж и афтемуви', 'Concerts, catering, launches, openings — coverage and aftermovie'), m: L('КОНЦЕРТ КАЙРАТА НУРТАСА · AURA', 'KAIRAT NURTAS CONCERT · AURA') },
    ],
  },
  smm: {
    label: 'SMM',
    items: [
      { img: IMGS.r04, n: L('Контент-стратегия', 'Content strategy'), d: L('Кому, что и зачем показываем: рубрики, форматы, план публикаций', 'Who we show what to and why: rubrics, formats, publishing plan'), m: L('СТРАТЕГИЯ НА 90 ДНЕЙ', '90-DAY STRATEGY') },
      { img: IMGS.r05, n: L('Создание контента', 'Content production'), d: L('Reels, Stories, посты — съёмка и монтаж в одних руках', 'Reels, Stories, posts — shot and edited by one person'), m: L('REELS + STORIES + ПОСТЫ', 'REELS + STORIES + POSTS') },
      { img: IMGS.r12, n: L('Визуальная концепция', 'Visual concept'), d: L('Единый стиль профиля: цвет, свет, обложки, ритм ленты', 'One visual system for the profile: colour, light, covers, feed rhythm'), m: L('ВИЗУАЛЬНАЯ СИСТЕМА', 'VISUAL SYSTEM') },
      { img: IMGS.r06, n: L('Ведение социальных сетей', 'Social media management'), d: L('Публикации, вовлечение, рост — не «веду Instagram», а строю внимание', 'Publishing, engagement, growth — not "running an Instagram", building attention'), m: L('ЛУЧШИЙ REEL · 407 ЛАЙКОВ', 'BEST REEL · 407 LIKES') },
    ],
  },
  web: {
    label: L('САЙТЫ', 'WEBSITES'),
    items: [
      { img: IMGS.r09, n: L('Лендинг', 'Landing page'), d: L('Одна страница под одну цель: заявка, бронь, продажа', 'One page for one goal: request, booking, sale'), m: L('ЗАЯВКА В WHATSAPP', 'WHATSAPP REQUESTS') },
      { img: IMGS.r03, n: L('Сайт бренда', 'Brand website'), d: L('Digital-представительство: история, меню, кейсы, контакты', 'A digital home for the brand: story, menu, cases, contacts'), m: L('ПРОДОЛЖЕНИЕ БРЕНДА', 'BRAND EXTENSION') },
      { img: IMGS.r02, n: L('Digital-experience', 'Digital experience'), d: L('Сайт как фильм: анимации, видео, кинематографичный визуал', 'A website like a film: motion, video, cinematic visuals'), m: L('КАК ЭТОТ САЙТ', 'LIKE THIS SITE') },
      { img: IMGS.r01, n: L('Креативная разработка', 'Creative development'), d: L('Нестандартные интерфейсы и промо-страницы под запуск', 'Unconventional interfaces and promo pages for launches'), m: L('ПОД ЗАПУСК', 'FOR LAUNCHES') },
    ],
  },
};

export const FAQ = [
  { q: L('Что входит в съёмку?', 'What does a shoot include?'), a: L('Идея и сценарий, съёмка на локации, монтаж, субтитры и обложки. Вы получаете готовые Reels, которые можно публиковать сразу.', 'Idea and script, shooting on location, editing, captions and covers. You receive finished Reels ready to publish.') },
  { q: L('Сколько длится съёмка и сколько видео получится?', 'How long is a shoot and how many videos do I get?'), a: L('Обычно один съёмочный день — до 4 часов. Например, для Double 2 в Atyrau Botanic за 4 часа отснято 8 видео. Оборудование собирается за 5 минут.', 'Usually one shooting day — up to 4 hours. For example, for Double 2 at Atyrau Botanic 8 videos were shot in 4 hours. Gear is set up in 5 minutes.') },
  { q: L('Вы снимаете на телефон?', 'Do you shoot on a phone?'), a: L('Да — мобилография. При этом свет, стабилизация, звук и монтаж — профессиональные, поэтому результат выглядит как кино.', 'Yes — mobilegraphy. Light, stabilisation, sound and editing are professional, so the result looks like cinema.') },
  { q: L('Ведёте ли соцсети полностью?', 'Do you fully manage social media?'), a: L('Да: стратегия, визуальная концепция, создание контента и ведение. 7 лет в SMM, 200+ проектов.', 'Yes: strategy, visual concept, content production and management. 7 years in SMM, 200+ projects.') },
  { q: L('Делаете ли сайты?', 'Do you build websites?'), a: L('Да — лендинги, сайты брендов и digital-experience. Сайт — продолжение бренда, а не техническая задача.', 'Yes — landing pages, brand websites and digital experiences. A website is an extension of the brand, not a technical task.') },
  { q: L('Снимаете за пределами Астаны?', 'Do you shoot outside Astana?'), a: L('Да, выезжаю по Казахстану — например, съёмка Double 2 в Атырау. Детали поездки обсуждаем в WhatsApp.', 'Yes, I travel across Kazakhstan — for example the Double 2 shoot in Atyrau. Travel details are discussed on WhatsApp.') },
];

/** Media mapping for the page — reel covers from @spainov.ilyas. */
const R = Object.fromEntries(REELS.map((r) => [r.id, r.img]));
export const PAGE_MEDIA = {
  'hero-a': { img: R.r05, pos: '50% 20%' },
  'hero-b': { img: R.r01, pos: '50% 45%' },
  'hero-c': { img: R.r07, pos: '50% 30%' },
  'fl-1': { img: R.r06, pos: '50% 25%' },
  'fl-2': { img: R.r09, pos: '50% 40%' },
  'fl-3': { img: R.r10, pos: '50% 50%' },
  'fl-4': { img: R.r12, pos: '50% 20%' },
  'fl-5': { img: R.r03, pos: '50% 45%' },
  'fl-6': { img: R.r08, pos: '50% 30%' },
  'city-bg': { img: R.r02, pos: '50% 50%' },
  b1: { img: R.r05, pos: '50% 25%' },
  b2: { img: R.r02, pos: '50% 55%' },
  b3: { img: R.r07, pos: '50% 30%' },
  b4: { img: R.r08, pos: '50% 30%' },
  'loc-ig': { img: R.r04, pos: '50% 50%' },
};
