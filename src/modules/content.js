/** Services, selected work and page media. RU/EN. */
import { LANG } from './i18n.js';
import { REELS, reelUrl } from './data.js';

const L = (ru, en) => (LANG === 'en' ? en : ru);
const R = Object.fromEntries(REELS.map((r) => [r.id, r]));

export const SERVICES = [
  {
    n: '01', title: L('Мобилография', 'Mobilegraphy'),
    lead: L('Reels, короткие и рекламные видео, продукт, люди, события. Съёмка на телефон, которая выглядит как кино.', 'Reels, short-form and ad video, product, people, events. Shot on a phone, looks like cinema.'),
    tags: ['Reels', 'Short form', L('Продукт', 'Product'), 'Lifestyle', L('События', 'Events'), L('Бизнес', 'Business')],
    fact: L('До 8 видео за одну съёмку · 4K · 24fps', 'Up to 8 videos per shoot · 4K · 24fps'),
    img: R.r01.img,
  },
  {
    n: '02', title: 'SMM',
    lead: L('Контент-стратегия, визуальная концепция, создание контента и ведение соцсетей. Не «веду Instagram» — строю внимание.', 'Content strategy, visual concept, content production and social media management. Not “running an Instagram” — building attention.'),
    tags: [L('Стратегия', 'Strategy'), L('Контент', 'Content'), 'Reels', 'Stories', L('Визуал', 'Visual'), L('Рост', 'Growth')],
    fact: L('7 лет в SMM · 200+ проектов', '7 years in SMM · 200+ projects'),
    img: R.r06.img,
  },
  {
    n: '03', title: L('Сайты', 'Websites'),
    lead: L('Лендинги, сайты брендов и digital-experience. Сайт — продолжение бренда, а не техническая задача.', 'Landing pages, brand websites and digital experiences. A website is an extension of the brand, not a technical task.'),
    tags: [L('Лендинг', 'Landing'), L('Сайт бренда', 'Brand site'), 'Digital experience', L('Креативная разработка', 'Creative dev')],
    fact: L('Как этот сайт', 'Like this site'),
    img: R.r02.img,
  },
];

const w = (id, size, pos, service) => ({ ...R[id], size, pos, service, href: reelUrl(R[id]), title: LANG === 'en' && R[id].title_en ? R[id].title_en : R[id].title });
export const WORK = [
  w('r01', 'lg', '50% 45%', L('Мобилография', 'Mobilegraphy')),
  w('r07', 'sm', '50% 30%', L('События', 'Events')),
  w('r02', 'sm', '50% 55%', L('Продукт', 'Product')),
  w('r09', 'lg', '50% 40%', L('Кейтеринг · событие', 'Catering · event')),
  w('r03', 'md', '50% 45%', L('Бизнес', 'Business')),
  w('r12', 'md', '50% 20%', 'Beauty · SMM'),
  w('r10', 'sm', '50% 50%', L('Меню · ресторан', 'Menu · restaurant')),
  w('r11', 'sm', '50% 25%', L('Образование', 'Education')),
];

export const PAGE_MEDIA = {
  hero: { img: R.r05.img, pos: '50% 30%' },
  portrait: { img: R.r05.img, pos: '50% 20%' },
};
