/**
 * i18n — RU / EN.
 * Static copy lives in `index.html` under `data-i18n="key"` (text) and
 * `data-i18n-hover="key"` (button hover text). Dynamic strings use `t(key)`.
 * The chosen language is stored in localStorage and applied before any
 * text splitting / scroll scene is built, so a switch reloads the page.
 */
const DICT = {
  // nav
  'nav.work': { ru: 'РАБОТЫ', en: 'WORK' },
  'nav.services': { ru: 'УСЛУГИ', en: 'SERVICES' },
  'nav.about': { ru: 'ОБО МНЕ', en: 'ABOUT' },
  'nav.contact': { ru: 'КОНТАКТ', en: 'CONTACT' },
  'nav.start': { ru: 'НАЧАТЬ ПРОЕКТ', en: 'START A PROJECT' },
  'nav.start.hover': { ru: 'ОТКРЫТЬ КАМЕРУ', en: 'OPEN CAMERA' },
  'sound.off': { ru: 'ЗВУК ВЫКЛ', en: 'SOUND OFF' },
  'sound.on': { ru: 'ЗВУК ВКЛ', en: 'SOUND ON' },

  // hero
  'hero.city': { ru: 'АСТАНА · KZ', en: 'ASTANA · KZ' },
  'hero.roles': { ru: 'МОБИЛОГРАФИЯ / SMM / WEB', en: 'MOBILEGRAPHY / SMM / WEB' },
  'hero.l1': { ru: 'Я СНИМАЮ.', en: 'I SHOOT.' },
  'hero.l2': { ru: 'Я СТРОЮ.', en: 'I BUILD.' },
  'hero.l3': { ru: 'Я СОЗДАЮ.', en: 'I CREATE.' },
  'hero.videos': { ru: 'ВИДЕО', en: 'VIDEOS' },
  'hero.projects': { ru: 'ПРОЕКТОВ', en: 'PROJECTS' },
  'hero.years': { ru: 'ЛЕТ В SMM', en: 'YEARS IN SMM' },
  'hero.enter': { ru: 'ВОЙТИ В КАДР', en: 'ENTER THE FRAME' },
  'hero.worlds': { ru: 'КАМЕРА · СОЦСЕТИ · САЙТЫ', en: 'CAMERA · SOCIAL · WEB' },
  'hero.oneman': { ru: 'ОДИН ЧЕЛОВЕК. ТРИ МИРА.', en: 'ONE MAN. THREE WORLDS.' },
  'hero.drag': { ru: 'ПОКРУТИ ОБЪЕКТИВ', en: 'DRAG THE LENS' },

  // intro
  'intro.camera': { ru: 'КАМЕРА', en: 'CAMERA' },
  'intro.social': { ru: 'СОЦСЕТИ', en: 'SOCIAL' },
  'intro.web': { ru: 'САЙТЫ', en: 'WEB' },
  'intro.flow': { ru: 'КАМЕРА → СОЦСЕТИ → САЙТЫ', en: 'CAMERA → SOCIAL → WEB' },
  'intro.one': { ru: 'ОДИН ОБЪЕКТ. ТРИ МИРА.', en: 'ONE OBJECT. THREE WORLDS.' },

  // numbers
  'count.videos': { ru: 'ОТСНЯТЫХ ВИДЕО', en: 'VIDEOS SHOT' },
  'count.videos.sub': { ru: 'И СЧЁТ ПРОДОЛЖАЕТСЯ', en: 'AND COUNTING' },
  'count.projects': { ru: 'ПРОЕКТОВ', en: 'PROJECTS' },
  'count.projects.sub': { ru: 'БРЕНДЫ · ЛЮДИ · БИЗНЕС · СОБЫТИЯ', en: 'BRANDS · PEOPLE · BUSINESS · EVENTS' },
  'count.years': { ru: 'ЛЕТ В SMM', en: 'YEARS IN SMM' },
  'count.years.sub': { ru: '2019 — 2026', en: '2019 — 2026' },

  // 01 mobile
  'mobile.l1': { ru: 'Я СНИМАЮ', en: 'I SHOOT' },
  'mobile.l2': { ru: 'РЕАЛЬНОСТЬ.', en: 'REALITY.' },
  'mobile.lead': {
    ru: 'Reels, короткие видео, рекламный и lifestyle-контент, продукт, люди и бизнес. Съёмка на телефон, которая выглядит как кино.',
    en: 'Reels, short-form video, ad and lifestyle content, product, people and business. Shot on a phone, looks like cinema.',
  },
  'mobile.cta': { ru: 'ДАВАЙ СНИМАТЬ', en: "LET'S SHOOT" },
  'mobile.cta.hover': { ru: 'ОТКРЫТЬ КАМЕРУ', en: 'OPEN CAMERA' },

  // 02 social
  'social.l1': { ru: 'КОНТЕНТ,', en: 'CONTENT' },
  'social.l2': { ru: 'КОТОРЫЙ', en: 'THAT GETS' },
  'social.l3': { ru: 'ЗАМЕЧАЮТ.', en: 'ATTENTION.' },
  'social.lead': {
    ru: 'Создание контента, визуальная концепция, ведение социальных сетей, контент-стратегия. Не «веду Instagram» — строю внимание.',
    en: 'Content creation, visual concept, social media management, content strategy. Not "running an Instagram" — building attention.',
  },
  'chip.best': { ru: 'ЛУЧШИЙ REEL', en: 'BEST REEL' },
  'chip.best.v': { ru: '407 ЛАЙКОВ', en: '407 LIKES' },
  'chip.disc': { ru: 'ОБСУЖДЕНИЕ', en: 'DISCUSSION' },
  'chip.disc.v': { ru: '77 КОММЕНТАРИЕВ', en: '77 COMMENTS' },
  'chip.shoot': { ru: 'ОДНА СЪЁМКА', en: 'ONE SHOOT' },
  'chip.shoot.v': { ru: '8 ВИДЕО / 4Ч', en: '8 VIDEOS / 4H' },
  'chip.setup': { ru: 'СБОРКА', en: 'SETUP' },
  'chip.setup.v': { ru: '5 МИН', en: '5 MIN' },
  'feed.followers': { ru: 'ПОДПИСЧИКОВ', en: 'FOLLOWERS' },
  'feed.videos': { ru: 'ВИДЕО', en: 'VIDEOS' },
  'feed.projects': { ru: 'ПРОЕКТОВ', en: 'PROJECTS' },
  'flow.1': { ru: 'ИДЕЯ', en: 'IDEA' },
  'flow.2': { ru: 'СЪЁМКА', en: 'SHOOT' },
  'flow.3': { ru: 'МОНТАЖ', en: 'EDIT' },
  'flow.4': { ru: 'КОНТЕНТ', en: 'CONTENT' },
  'flow.5': { ru: 'ПУБЛИКАЦИЯ', en: 'PUBLISH' },
  'flow.6': { ru: 'ВНИМАНИЕ', en: 'ATTENTION' },

  // 03 web
  'web.l1': { ru: 'DIGITAL', en: 'DIGITAL' },
  'web.l2': { ru: 'ДОЛЖЕН', en: 'SHOULD' },
  'web.l3': { ru: 'ЖИТЬ.', en: 'FEEL ALIVE.' },
  'web.lead': {
    ru: 'Современные сайты, лендинги и digital-представительства брендов. Сайт — это продолжение бренда, а не техническая задача.',
    en: 'Modern websites, landing pages and digital homes for brands. A website is an extension of the brand, not a technical task.',
  },
  'web.cta': { ru: 'ДАВАЙ СОЗДАДИМ', en: "LET'S CREATE" },
  'web.cta.hover': { ru: 'НАЧАТЬ ПРОЕКТ', en: 'START PROJECT' },
  'web.feel': { ru: 'ЖИВОЙ', en: 'FEEL' },
  'web.alive': { ru: 'БРЕНД.', en: 'ALIVE.' },
  'web.foot': { ru: 'НАЧАТЬ ПРОЕКТ →', en: 'START A PROJECT →' },

  // process
  'proc.idea': { ru: 'ИДЕЯ', en: 'IDEA' },
  'proc.shot': { ru: 'СЪЁМКА', en: 'SHOT' },
  'proc.edit': { ru: 'МОНТАЖ', en: 'EDIT' },
  'proc.publish': { ru: 'ПУБЛИКАЦИЯ', en: 'PUBLISH' },
  'proc.grow': { ru: 'РОСТ', en: 'GROW' },
  'proc.idea.sub': { ru: 'СЛОВА ЕЩЁ НЕ СОБРАНЫ', en: 'WORDS NOT YET ASSEMBLED' },
  'proc.shot.sub': { ru: 'РАМКА КАМЕРЫ', en: 'CAMERA FRAME' },
  'proc.edit.sub': { ru: 'ТАЙМЛАЙН', en: 'TIMELINE' },
  'proc.publish.sub': { ru: 'ЛЕНТА', en: 'SOCIAL FEED' },
  'proc.grow.sub': { ru: 'ВНИМАНИЕ ↑', en: 'ATTENTION ↑' },
  'proc.label': { ru: 'ПРОЦЕСС', en: 'PROCESS' },

  // about
  'about.l1': { ru: 'ЗА', en: 'BEHIND' },
  'about.l2': { ru: 'КАМЕРОЙ.', en: 'THE CAMERA.' },
  'about.r1': { ru: 'МОБИЛОГРАФ', en: 'MOBILEGRAPHER' },
  'about.r2': { ru: 'SMM', en: 'SMM' },
  'about.r3': { ru: 'DIGITAL-СОЗДАТЕЛЬ', en: 'DIGITAL CREATOR' },
  'about.lead': {
    ru: 'Я не просто снимаю Reels. Я создаю цифровой образ бизнеса: снимаю, развиваю соцсети и строю сайты, которые продолжают бренд. 12 лет в общепите — поэтому рестораны, кейтеринг и сервис я снимаю изнутри.',
    en: "I don't just shoot Reels. I build the digital image of a business: I shoot, grow social media and craft websites that extend the brand. 12 years in hospitality — so restaurants, catering and service I shoot from the inside.",
  },
  'about.horeca': { ru: 'ЛЕТ В ОБЩЕПИТЕ', en: 'YEARS IN HORECA' },
  'about.city': { ru: 'АСТАНА', en: 'ASTANA' },
  'about.city.sub': { ru: 'КАЗАХСТАН · НА ЛОКАЦИИ', en: 'KAZAKHSTAN · ON LOCATION' },
  'about.cta': { ru: 'РАБОТАЙ СО МНОЙ', en: 'WORK WITH ME' },
  'about.onset': { ru: 'НА СЪЁМКЕ · АСТАНА', en: 'ON SET · ASTANA' },
  'about.followers': { ru: '1 688 ПОДПИСЧИКОВ', en: '1 688 FOLLOWERS' },

  // work
  'work.l1': { ru: 'ИЗБРАННЫЕ', en: 'SELECTED' },
  'work.l2': { ru: 'РАБОТЫ.', en: 'WORK.' },
  'work.profile.sub': { ru: '1 688 ПОДПИСЧИКОВ · АСТАНА', en: '1 688 FOLLOWERS · ASTANA' },
  'work.foot': { ru: 'КЛИК — ОТКРЫТЬ · КАЖДЫЙ REEL ВЕДЁТ В INSTAGRAM', en: 'CLICK TO ENTER · EVERY REEL OPENS ON INSTAGRAM' },
  'work.follow': { ru: 'ПОДПИСАТЬСЯ →', en: 'FOLLOW →' },
  'scene.open': { ru: 'ОТКРЫТЬ В INSTAGRAM →', en: 'OPEN ON INSTAGRAM →' },
  'scene.open.stats': { ru: 'ОТКРЫТЬ В INSTAGRAM → ♥ {likes} · {comments} КОММ.', en: 'OPEN ON INSTAGRAM → ♥ {likes} · {comments} COMMENTS' },
  'scene.prev': { ru: '← НАЗАД', en: '← PREV' },
  'scene.next': { ru: 'ДАЛЕЕ →', en: 'NEXT →' },

  // contact
  'contact.l1': { ru: 'СДЕЛАЕМ', en: "LET'S" },
  'contact.l2': { ru: 'ТО,', en: 'MAKE' },
  'contact.l3': { ru: 'ЧТО', en: 'SOMETHING' },
  'contact.l4': { ru: 'ЛЮДИ', en: 'PEOPLE' },
  'contact.l5': { ru: 'ЗАПОМНЯТ.', en: 'REMEMBER.' },
  'contact.q1': { ru: 'КАКОЙ', en: "WHAT'S" },
  'contact.q2': { ru: 'ТВОЙ', en: 'YOUR' },
  'contact.q3': { ru: 'СЛЕДУЮЩИЙ', en: 'NEXT' },
  'contact.q4': { ru: 'ПРОЕКТ?', en: 'PROJECT?' },
  'contact.r1': { ru: 'МОБИЛОГРАФИЯ', en: 'MOBILEGRAPHY' },
  'contact.start': { ru: 'НАЧАТЬ ПРОЕКТ →', en: 'START A PROJECT →' },
  'contact.start.hover': { ru: 'ОТКРЫТЬ WHATSAPP', en: 'OPEN WHATSAPP' },

  // footer
  'footer.roles': { ru: 'МОБИЛОГРАФИЯ / SMM / WEB', en: 'MOBILEGRAPHY / SMM / WEB' },
  'footer.city': { ru: 'АСТАНА / КАЗАХСТАН', en: 'ASTANA / KAZAKHSTAN' },

  // cursor
  'cursor.view': { ru: 'СМОТРЕТЬ', en: 'VIEW' },
  'cursor.open': { ru: 'ОТКРЫТЬ', en: 'OPEN' },
  'cursor.explore': { ru: 'ОТКРЫТЬ', en: 'EXPLORE' },
  'cursor.drag': { ru: 'КРУТИ', en: 'DRAG' },

  // meta
  'meta.title': { ru: 'ИЛЬЯС SPAINOV — Мобилография / SMM / Web', en: 'ILYAS SPAINOV — Mobilegraphy / SMM / Web' },
  'meta.desc': {
    ru: 'Ильяс Спаинов — мобилограф, SMM и digital. 4000+ отснятых видео, 200+ проектов, 7 лет в SMM. Астана, Казахстан.',
    en: 'Ilyas Spainov — mobilegrapher, SMM and digital. 4000+ videos shot, 200+ projects, 7 years in SMM. Astana, Kazakhstan.',
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
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
  return s;
}

export function applyI18n(root = document) {
  document.documentElement.lang = LANG;
  document.title = t('meta.title');
  const md = document.querySelector('meta[name="description"]');
  if (md) md.content = t('meta.desc');
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-hover]').forEach((el) => { el.dataset.hover = t(el.dataset.i18nHover); });
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
