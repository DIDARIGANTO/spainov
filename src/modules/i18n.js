/**
 * i18n — RU / EN. Static copy: `data-i18n="key"` in index.html. Dynamic: t(key).
 * The language is stored in localStorage and applied before anything is built.
 */
const DICT = {
  'clap.location': { ru: 'АСТАНА · KZ', en: 'ASTANA · KZ' },
  'clap.hint': { ru: 'ХЛОПУШКА · МОТОР', en: 'SLATE · ACTION' },

  'nav.hits': { ru: 'ХИТЫ', en: 'HITS' },
  'nav.services': { ru: 'УСЛУГИ', en: 'SERVICES' },
  'nav.book': { ru: 'ЗАЯВКА', en: 'BOOK' },
  'nav.contacts': { ru: 'КОНТАКТЫ', en: 'CONTACTS' },
  'nav.cta': { ru: 'НАЧАТЬ ПРОЕКТ', en: 'START A PROJECT' },
  'badge.text': { ru: 'SPAINOV · АСТАНА · МОБИЛОГРАФИЯ · SMM · WEB · ', en: 'SPAINOV · ASTANA · MOBILEGRAPHY · SMM · WEB · ' },

  'hero.m1': { ru: 'АСТАНА', en: 'ASTANA' },
  'hero.m2': { ru: 'С 2019', en: 'SINCE 2019' },
  'hero.m3': { ru: 'МОБИЛОГРАФ · SMM · WEB', en: 'MOBILEGRAPHER · SMM · WEB' },
  'hero.l1': { ru: 'Снимаю так,', en: 'Shot so well,' },
  'hero.l2': { ru: 'чтобы запомнили', en: 'they remember' },
  'hero.cta1': { ru: 'НАЧАТЬ ПРОЕКТ', en: 'START A PROJECT' },
  'hero.cta2': { ru: 'СМОТРЕТЬ РАБОТЫ', en: 'SEE THE WORK' },
  'hero.hint': { ru: 'ПОТЯНИ КАДР', en: 'DRAG A FRAME' },

  'ticker.1': { ru: 'SPAINOV · АСТАНА · С 2019 · МОБИЛОГРАФИЯ · SMM · WEB · ', en: 'SPAINOV · ASTANA · EST. 2019 · MOBILEGRAPHY · SMM · WEB · ' },

  'city.l1': { ru: 'Астана.', en: 'Astana.' },
  'city.l2': { ru: 'Spainov.', en: 'Spainov.' },
  'city.text': {
    ru: 'С 2019 года снимаю Астану и её бизнес так, как видит камера в руках, которой доверяют: честно, близко и с кинематографичным светом. Один человек — три мира: камера, соцсети, сайты.',
    en: 'Since 2019 I have been shooting Astana and its businesses the way a trusted camera sees them: honest, close and in cinematic light. One man, three worlds: camera, social, web.',
  },

  'belief.l1': { ru: 'Мы верим, что контент —', en: 'We believe content is' },
  'belief.l2': { ru: 'это внимание', en: 'attention' },
  'belief.p1': {
    ru: 'Spainov — это не «веду Instagram». Это идея, съёмка, монтаж, публикация и внимание, которое остаётся. Reels, которые смотрят до конца, визуал, который узнают, и сайты, которые продолжают бренд.',
    en: 'Spainov is not "running an Instagram". It is idea, shoot, edit, publish — and attention that stays. Reels people watch to the end, visuals they recognise, and websites that extend the brand.',
  },
  'belief.p2': {
    ru: '12 лет в общепите — поэтому рестораны, кейтеринг и сервис я снимаю изнутри: знаю, где свет, где вкус и где момент. Снимаю на телефон так, что это выглядит как кино.',
    en: '12 years in hospitality — so I shoot restaurants, catering and service from the inside: I know where the light is, where the taste is, where the moment is. Shot on a phone, looks like cinema.',
  },
  'belief.c1': { ru: 'ЗА КАМЕРОЙ · КУХНЯ', en: 'BEHIND THE CAMERA · KITCHEN' },
  'belief.c2': { ru: 'ОБОРУДОВАНИЕ · 5 МИНУТ НА СБОРКУ', en: 'GEAR · 5 MINUTES TO SET UP' },
  'belief.c3': { ru: 'КОНЦЕРТ · ЖИВОЙ ЗВУК', en: 'CONCERT · LIVE SOUND' },
  'belief.c4': { ru: 'РЕСТОРАН · ВКУС В КАДРЕ', en: 'RESTAURANT · TASTE ON CAMERA' },
  'stat.1': { ru: 'ОТСНЯТЫХ ВИДЕО', en: 'VIDEOS SHOT' },
  'stat.2': { ru: 'ПРОЕКТОВ ДЛЯ БИЗНЕСА И ЛЮДЕЙ', en: 'PROJECTS FOR BUSINESSES AND PEOPLE' },
  'stat.3': { ru: 'В SMM · С 2019 ГОДА', en: 'IN SMM · SINCE 2019' },
  'stat.3s': { ru: ' лет', en: ' yrs' },

  'hits.l1': { ru: 'Хиты', en: 'Hits by' },
  'hits.sub': { ru: 'ТО, ЧТО СМОТРЯТ ДО КОНЦА. ЛИСТАЙТЕ →', en: 'THE ONES PEOPLE WATCH TO THE END. SCROLL →' },
  'hits.open': { ru: 'СМОТРЕТЬ', en: 'WATCH' },
  'hits.end.l1': { ru: 'Все работы —', en: 'All the work —' },
  'hits.end.l2': { ru: 'в Instagram', en: 'on Instagram' },
  'hits.end.cta': { ru: 'ОТКРЫТЬ ПРОФИЛЬ', en: 'OPEN PROFILE' },
  'hits.likes': { ru: 'ЛАЙКОВ', en: 'LIKES' },

  'steps.eyebrow': { ru: 'СЪЁМКА НА ВАШЕЙ ЛОКАЦИИ', en: 'SHOOTING AT YOUR LOCATION' },
  'steps.l2': { ru: 'едет к вам', en: 'comes to you' },
  'steps.1': { ru: 'Пишете в WhatsApp — обсуждаем задачу, формат и дату', en: 'Message me on WhatsApp — we discuss the task, format and date' },
  'steps.2': { ru: 'Снимаю у вас: ресторан, офис, событие, продукт, люди', en: 'I shoot at your place: restaurant, office, event, product, people' },
  'steps.3': { ru: 'Получаете готовые Reels, контент для соцсетей или сайт', en: 'You get finished Reels, social content or a website' },
  'steps.cta': { ru: 'НАПИСАТЬ В WHATSAPP', en: 'MESSAGE ON WHATSAPP' },
  'steps.note': { ru: 'ЗАЯВКИ ПРИНИМАЮТСЯ В WHATSAPP · АСТАНА · ВЫЕЗД ПО КАЗАХСТАНУ', en: 'REQUESTS VIA WHATSAPP · ASTANA · TRAVEL ACROSS KAZAKHSTAN' },
  'steps.you': { ru: 'ВЫ', en: 'YOU' },

  'serv.l1': { ru: 'Мои', en: 'My' },
  'serv.l2': { ru: 'услуги', en: 'services' },
  'serv.sub': { ru: 'Три направления — один человек. Выберите раздел и напишите в один клик.', en: 'Three directions, one person. Pick a section and message me in one click.' },
  'serv.t1': { ru: 'МОБИЛОГРАФИЯ', en: 'MOBILEGRAPHY' },
  'serv.t2': { ru: 'SMM', en: 'SMM' },
  'serv.t3': { ru: 'САЙТЫ', en: 'WEBSITES' },
  'serv.cta': { ru: 'ЗАКАЗАТЬ «{tab}»', en: 'ORDER "{tab}"' },
  'serv.ask': { ru: 'ПО ЗАПРОСУ', en: 'ON REQUEST' },
  'serv.note': { ru: 'СТОИМОСТЬ — ПОД ЗАДАЧУ · АКТУАЛЬНЫЙ PRICE В INSTAGRAM HIGHLIGHTS', en: 'PRICING PER PROJECT · CURRENT PRICE LIST IN INSTAGRAM HIGHLIGHTS' },

  'book.eyebrow': { ru: 'ЗАЯВКА НА СЪЁМКУ', en: 'BOOK A SHOOT' },
  'book.l1': { ru: 'Оставьте', en: 'Save me' },
  'book.l2': { ru: 'мне место в календаре', en: 'a spot in your calendar' },
  'book.text': { ru: 'Reels для ресторана, контент для бренда, событие или сайт — оставьте заявку, и я напишу в WhatsApp, чтобы подтвердить дату.', en: 'Reels for a restaurant, content for a brand, an event or a website — leave a request and I will message you on WhatsApp to confirm the date.' },
  'form.name': { ru: 'ИМЯ', en: 'NAME' },
  'form.phone': { ru: 'ТЕЛЕФОН', en: 'PHONE' },
  'form.date': { ru: 'ДАТА', en: 'DATE' },
  'form.format': { ru: 'ФОРМАТ', en: 'FORMAT' },
  'form.f1': { ru: 'Reels / короткие видео', en: 'Reels / short-form video' },
  'form.f2': { ru: 'Продукт / меню', en: 'Product / menu' },
  'form.f3': { ru: 'Событие', en: 'Event' },
  'form.f4': { ru: 'Люди / бизнес', en: 'People / business' },
  'form.f5': { ru: 'Ведение соцсетей', en: 'Social media management' },
  'form.f6': { ru: 'Сайт / лендинг', en: 'Website / landing page' },
  'form.wish': { ru: 'ПОЖЕЛАНИЯ', en: 'NOTES' },
  'form.submit': { ru: 'ОТПРАВИТЬ ЗАЯВКУ', en: 'SEND REQUEST' },
  'form.or': { ru: 'ИЛИ ПОЗВОНИТЕ:', en: 'OR CALL:' },
  'form.done1': { ru: 'Спасибо!', en: 'Thank you!' },
  'form.done2': { ru: 'Заявка открыта в WhatsApp — отправьте сообщение, и я подтвержу дату.', en: 'Your request is open in WhatsApp — send the message and I will confirm the date.' },
  'form.err': { ru: 'Заполните имя и телефон', en: 'Please fill in name and phone' },
  'form.msg': {
    ru: 'Ильяс, хочу обсудить проект.\nНаправление: {dir}\nФормат: {format}\nИмя: {name}\nТелефон: {phone}\nДата: {date}\nПожелания: {wish}',
    en: 'Ilyas, I would like to discuss a project.\nDirection: {dir}\nFormat: {format}\nName: {name}\nPhone: {phone}\nDate: {date}\nNotes: {wish}',
  },

  'where.l1': { ru: 'Где меня', en: 'Where to' },
  'where.l2': { ru: 'найти', en: 'find me' },
  'loc1.title': { ru: 'Съёмка в Астане', en: 'Shooting in Astana' },
  'loc.addr': { ru: 'ЛОКАЦИЯ', en: 'LOCATION' },
  'loc1.addr': { ru: 'Астана · выезд по Казахстану', en: 'Astana · travel across Kazakhstan' },
  'loc.hours': { ru: 'ОТВЕЧАЮ', en: 'REPLIES' },
  'loc1.hours': { ru: 'ежедневно в WhatsApp', en: 'daily on WhatsApp' },
  'loc.phone': { ru: 'ТЕЛЕФОН', en: 'PHONE' },
  'loc1.book': { ru: 'ОСТАВИТЬ ЗАЯВКУ', en: 'LEAVE A REQUEST' },
  'loc2.k1': { ru: 'ПОДПИСЧИКИ', en: 'FOLLOWERS' },
  'loc2.k2': { ru: 'HIGHLIGHTS', en: 'HIGHLIGHTS' },
  'loc2.k3': { ru: 'ЛУЧШИЙ REEL', en: 'BEST REEL' },
  'loc2.v3': { ru: '407 лайков · 77 комментариев', en: '407 likes · 77 comments' },
  'loc2.hits': { ru: 'СМОТРЕТЬ ХИТЫ', en: 'SEE THE HITS' },

  'faq.l1': { ru: 'Частые', en: 'Frequent' },
  'faq.l2': { ru: 'вопросы', en: 'questions' },

  'ft.k1': { ru: 'АСТАНА', en: 'ASTANA' },
  'ft.v1': { ru: 'Съёмка · SMM · сайты', en: 'Shooting · SMM · websites' },
  'ft.k4': { ru: 'НАПРАВЛЕНИЯ', en: 'DIRECTIONS' },
  'ft.city': { ru: 'АСТАНА', en: 'ASTANA' },
  'ft.tag': { ru: 'ОДИН ЧЕЛОВЕК. ТРИ МИРА.', en: 'ONE MAN. THREE WORLDS.' },

  'cursor.view': { ru: 'СМОТРЕТЬ', en: 'VIEW' },
  'cursor.open': { ru: 'ОТКРЫТЬ', en: 'OPEN' },
  'cursor.drag': { ru: 'ТЯНИ', en: 'DRAG' },

  'meta.title': { ru: 'ИЛЬЯС SPAINOV — Мобилография / SMM / Web · Астана', en: 'ILYAS SPAINOV — Mobilegraphy / SMM / Web · Astana' },
  'meta.desc': {
    ru: 'Ильяс Спаинов — мобилограф, SMM и digital в Астане. 4000+ отснятых видео, 200+ проектов, 7 лет в SMM.',
    en: 'Ilyas Spainov — mobilegrapher, SMM and digital in Astana. 4000+ videos shot, 200+ projects, 7 years in SMM.',
  },
};

const KEY = 'spainov.lang';

export function detectLang() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ru' || q === 'en') { localStorage.setItem(KEY, q); return q; }
    const saved = localStorage.getItem(KEY);
    if (saved === 'ru' || saved === 'en') return saved;
  } catch (e) { /* storage unavailable */ }
  const nav = (navigator.language || 'ru').toLowerCase();
  return /^(ru|kk|uk|be)/.test(nav) ? 'ru' : 'en';
}

export const LANG = detectLang();

export function t(key, vars) {
  const entry = DICT[key];
  let s = entry ? (entry[LANG] ?? entry.en) : key;
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.split(`{${k}}`).join(v); });
  return s;
}

export function applyI18n(root = document) {
  document.documentElement.lang = LANG;
  document.title = t('meta.title');
  const md = document.querySelector('meta[name="description"]');
  if (md) md.content = t('meta.desc');
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-lang]').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.lang === LANG);
    b.setAttribute('aria-pressed', String(b.dataset.lang === LANG));
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
}

export function setLang(lang) {
  if (lang === LANG) return;
  try { localStorage.setItem(KEY, lang); } catch (e) { /* noop */ }
  const url = new URL(location.href);
  url.searchParams.delete('lang');
  url.hash = '';
  location.replace(url.toString());
}
