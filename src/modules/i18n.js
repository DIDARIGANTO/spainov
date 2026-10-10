const DICT = {
  'load.role': { ru: 'МОБИЛОГРАФ · SMM · WEB', en: 'MOBILEGRAPHER · SMM · WEB' },
  'load.city': { ru: 'АСТАНА, KZ', en: 'ASTANA, KZ' },
  'nav.work': { ru: 'Работы', en: 'Work' },
  'nav.services': { ru: 'Услуги', en: 'Services' },
  'nav.about': { ru: 'Обо мне', en: 'About' },
  'nav.contact': { ru: 'Контакт', en: 'Contact' },
  'nav.astana': { ru: 'АСТАНА', en: 'ASTANA' },
  'nav.cta': { ru: 'Обсудить проект', en: 'Start a project' },
  'hero.status': { ru: 'Открыт для проектов · 2026', en: 'Open for projects · 2026' },
  'hero.role1': { ru: 'Мобилограф, SMM', en: 'Mobilegrapher, SMM' },
  'hero.role2': { ru: 'и digital-создатель из Астаны.', en: 'and digital creator based in Astana.' },
  'hero.desc': { ru: 'Снимаю, развиваю соцсети и делаю сайты для ресторанов, брендов и людей. Один человек — три направления, одна картинка.', en: 'I shoot, grow social media and build websites for restaurants, brands and people. One person, three disciplines, one picture.' },
  'hero.scroll': { ru: 'Скролл', en: 'Scroll' },
  'hero.cap1': { ru: 'За камерой · Астана', en: 'Behind the camera · Astana' },
  'marquee': { ru: 'Мобилография — SMM — Сайты — Reels — Продукт — События — Люди — Бизнес — ', en: 'Mobilegraphy — SMM — Websites — Reels — Product — Events — People — Business — ' },
  'num.1': { ru: 'отснятых видео', en: 'videos shot' },
  'num.2': { ru: 'проектов', en: 'projects' },
  'num.3': { ru: 'лет в SMM', en: 'years in SMM' },
  'num.4': { ru: 'лет в общепите', en: 'years in hospitality' },
  'work.t': { ru: 'Избранные работы', en: 'Selected work' },
  'work.all': { ru: 'Все работы в Instagram', en: 'All work on Instagram' },
  'work.view': { ru: 'Смотреть', en: 'View' },
  'serv.t': { ru: 'Что я делаю', en: 'What I do' },
  'serv.sub': { ru: 'Три направления, которые закрывают весь digital бизнеса: от первого кадра до сайта.', en: 'Three disciplines covering the whole digital side of a business: from the first frame to the website.' },
  'serv.cta': { ru: 'Заказать', en: 'Order' },
  'proc.t': { ru: 'Как проходит работа', en: 'How it works' },
  'proc.1t': { ru: 'Запрос', en: 'Request' },
  'proc.1p': { ru: 'Пишете в WhatsApp. Обсуждаем задачу, формат, бюджет и дату — обычно в тот же день.', en: 'Message me on WhatsApp. We discuss the task, format, budget and date — usually the same day.' },
  'proc.2t': { ru: 'Идея', en: 'Idea' },
  'proc.2p': { ru: 'Сценарий и референсы под вашу аудиторию. Для соцсетей — контент-план, для сайта — структура.', en: 'Script and references for your audience. A content plan for social, a structure for the website.' },
  'proc.3t': { ru: 'Съёмка', en: 'Shoot' },
  'proc.3p': { ru: 'На вашей локации: оборудование собирается за 5 минут, за одну смену — до 8 видео.', en: 'At your location: gear set up in 5 minutes, up to 8 videos per shooting day.' },
  'proc.4t': { ru: 'Результат', en: 'Result' },
  'proc.4p': { ru: 'Монтаж, субтитры, обложки, публикация. Вы получаете контент, который работает.', en: 'Editing, captions, covers, publishing. You get content that works.' },
  'about.t': { ru: 'Обо мне', en: 'About' },
  'about.big': { ru: 'Я Ильяс. Семь лет снимаю и веду соцсети, двенадцать — работал в общепите. Поэтому знаю бизнес изнутри: где свет, где вкус, где момент, который продаёт.', en: "I'm Ilyas. Seven years shooting and running social media, twelve years in hospitality before that. So I know business from the inside: where the light is, where the taste is, where the moment that sells is." },
  'about.p': { ru: 'Снимаю на телефон так, что это выглядит как кино. Строю визуальные системы, которые узнают в ленте. Делаю сайты как продолжение бренда. Работаю в Астане и выезжаю по Казахстану.', en: 'I shoot on a phone so it looks like cinema. I build visual systems people recognise in the feed. I make websites that extend the brand. Based in Astana, travelling across Kazakhstan.' },
  'about.f1k': { ru: 'База', en: 'Based in' },
  'about.f1v': { ru: 'Астана, Казахстан', en: 'Astana, Kazakhstan' },
  'about.f2k': { ru: 'Индустрии', en: 'Industries' },
  'about.f2v': { ru: 'Рестораны, кейтеринг, медицина, образование, beauty, события', en: 'Restaurants, catering, medical, education, beauty, events' },
  'about.f3k': { ru: 'Лучший reel', en: 'Best reel' },
  'about.f3v': { ru: '407 лайков · 77 комментариев', en: '407 likes · 77 comments' },
  'about.cta': { ru: 'Работать вместе', en: 'Work together' },
  'ig.t': { ru: 'Последнее в Instagram', en: 'Latest on Instagram' },
  'ig.f': { ru: 'подписчиков', en: 'followers' },
  'c.l1': { ru: 'Давайте', en: "Let's" },
  'c.l2': { ru: 'сделаем', en: 'make' },
  'c.l3': { ru: 'что-то стоящее', en: 'something worth it' },
  'c.k1': { ru: 'Написать', en: 'Message' },
  'c.k2': { ru: 'Соцсети', en: 'Social' },
  'c.k3': { ru: 'Локация', en: 'Location' },
  'c.v3': { ru: 'Астана · весь Казахстан', en: 'Astana · all Kazakhstan' },
  'c.time': { ru: 'Местное время', en: 'Local time' },
  'ft.mid': { ru: 'Мобилография · SMM · Web', en: 'Mobilegraphy · SMM · Web' },
  'ft.top': { ru: 'Наверх ↑', en: 'Back to top ↑' },
  'cursor.view': { ru: 'Смотреть', en: 'View' },
  'cursor.open': { ru: 'Открыть', en: 'Open' },
  'cursor.drag': { ru: 'Крути', en: 'Drag' },
  'meta.title': { ru: 'Ильяс Спаинов — мобилограф, SMM и web · Астана', en: 'Ilyas Spainov — Mobilegrapher, SMM & Web · Astana' },
  'meta.desc': { ru: 'Ильяс Спаинов — мобилограф, SMM и digital в Астане. 4000+ видео, 200+ проектов, 7 лет в SMM.', en: 'Ilyas Spainov — mobilegrapher, SMM and digital in Astana. 4000+ videos, 200+ projects, 7 years in SMM.' },
};
const KEY = 'spainov.lang';
export function detectLang() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ru' || q === 'en') { localStorage.setItem(KEY, q); return q; }
    const saved = localStorage.getItem(KEY);
    if (saved === 'ru' || saved === 'en') return saved;
  } catch (e) { /* noop */ }
  return /^(ru|kk|uk|be)/.test((navigator.language || 'ru').toLowerCase()) ? 'ru' : 'en';
}
export const LANG = detectLang();
export function t(key, vars) {
  const e = DICT[key]; let s = e ? (e[LANG] ?? e.en) : key;
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.split(`{${k}}`).join(v); });
  return s;
}
export function applyI18n(root = document) {
  document.documentElement.lang = LANG;
  document.title = t('meta.title');
  const md = document.querySelector('meta[name="description"]'); if (md) md.content = t('meta.desc');
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-lang]').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.lang === LANG);
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
}
export function setLang(lang) {
  if (lang === LANG) return;
  try { localStorage.setItem(KEY, lang); } catch (e) { /* noop */ }
  const url = new URL(location.href); url.searchParams.delete('lang'); url.hash = '';
  location.replace(url.toString());
}
