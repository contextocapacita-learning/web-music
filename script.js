/* ---- Cursor personalizado ---- */
const cur = document.getElementById("cur");
const curR = document.getElementById("curRing");
let rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  cur.style.left = e.clientX + "px";
  cur.style.top = e.clientY + "px";
  rx += (e.clientX - rx) * 0.12;
  ry += (e.clientY - ry) * 0.12;
  curR.style.left = rx + "px";
  curR.style.top = ry + "px";
});
(function animRing() {
  rx += (parseFloat(cur.style.left || 0) - rx) * 0.1;
  ry += (parseFloat(cur.style.top || 0) - ry) * 0.1;
  curR.style.left = rx + "px";
  curR.style.top = ry + "px";
  requestAnimationFrame(animRing);
})();
document.querySelectorAll("a,button,.tl-item,.mk-item").forEach((el) => {
  el.addEventListener("mouseenter", () => cur.classList.add("hovered"));
  el.addEventListener("mouseleave", () => cur.classList.remove("hovered"));
});

window.addEventListener(
  "scroll",
  () => {
    document
      .getElementById("hdr")
      .classList.toggle("solid", window.scrollY > 50);
  },
  { passive: true },
);

const hbg = document.getElementById("hbg");
const mob = document.getElementById("mobNav");
hbg.addEventListener("click", () => {
  hbg.classList.toggle("open");
  mob.style.display = mob.style.display === "flex" ? "none" : "flex";
});
function closeM() {
  hbg.classList.remove("open");
  mob.style.display = "none";
}

const revEls = document.querySelectorAll(".r");
const rules = document.querySelectorAll(".title-rule,.contact-line");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add(
          e.target.classList.contains("title-rule") ||
            e.target.classList.contains("contact-line")
            ? "visible"
            : "in",
        );
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
);
[...revEls, ...rules].forEach((el) => io.observe(el));

const TRACKS = [
  {
    title: "Otra vez en el club",
    artist: "UNOTOPIC · 2024",
    src: "assets/audio/track-1.mp3",
    cover: "assets/img/track-1.webp",
  },
  {
    title: "Lunita mía",
    artist: "UNOTOPIC · 2024",
    src: "assets/audio/track-2.mp3",
    cover: "assets/img/track-2.webp",
  },
  {
    title: "Cada noche",
    artist: "UNOTOPIC · 2023",
    src: "assets/audio/track-3.mp3",
    cover: "assets/img/track-3.webp",
  },
  {
    title: "3 a.m.",
    artist: "UNOTOPIC · 2023",
    src: "assets/audio/track-4.mp3",
    cover: "assets/img/track-4.webp",
  },
];
let cIdx = 0,
  audio = new Audio(),
  playing = false;
function fmt(s) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}
function renderPlayer() {
  const t = TRACKS[cIdx];
  document.getElementById("npTitle").textContent = t.title;
  document.getElementById("npArtist").textContent = t.artist;
  document.getElementById("npCoverImg").src = t.cover;
  audio.src = t.src;
  audio.load();
  updateBar();
  document
    .querySelectorAll(".tl-item")
    .forEach((li, i) => li.classList.toggle("active", i === cIdx));
  document
    .querySelectorAll(".tl-waveform")
    .forEach((wf, i) =>
      wf.classList.toggle("paused", !(playing && i === cIdx)),
    );
}
function updateBar() {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  document.getElementById("progFill").style.width = pct + "%";
  document.getElementById("progDot").style.left = pct + "%";
  document.getElementById("tCur").textContent = fmt(audio.currentTime);
  document.getElementById("tTot").textContent = fmt(audio.duration || 0);
}
function selTrack(i) {
  cIdx = i;
  renderPlayer();
  if (playing) audio.play();
}
function togglePlay() {
  playing = !playing;
  document.getElementById("playIco").innerHTML = playing
    ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';
  if (playing) audio.play();
  else audio.pause();
  document
    .querySelectorAll(".tl-waveform")
    .forEach((wf, i) =>
      wf.classList.toggle("paused", !(playing && i === cIdx)),
    );
}
function nextTrack() {
  cIdx = (cIdx + 1) % TRACKS.length;
  renderPlayer();
  if (playing) audio.play();
}
function prevTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  cIdx = (cIdx - 1 + TRACKS.length) % TRACKS.length;
  renderPlayer();
  if (playing) audio.play();
}
function seekTrack(e) {
  const r = document.getElementById("progWrap").getBoundingClientRect();
  const pct = (e.clientX - r.left) / r.width;
  audio.currentTime = pct * audio.duration;
}
audio.addEventListener("timeupdate", updateBar);
audio.addEventListener("ended", nextTrack);
audio.addEventListener("loadedmetadata", updateBar);
renderPlayer();

function toggleAcc() {
  const btn = document.getElementById("accBtn");
  const body = document.getElementById("accBody");
  const open = body.classList.toggle("open");
  btn.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
  const span = btn.querySelector("span");
  if (span && typeof currentLang !== "undefined") {
    span.textContent = open
      ? i18n[currentLang].acc_close
      : i18n[currentLang].acc_read;
  }
}

document.querySelectorAll(".press-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-4px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.addEventListener(
  "scroll",
  () => {
    const stars = document.querySelector(".hero-stars");
    if (stars) stars.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  },
  { passive: true },
);

/* ---- INTERNACIONALIZACIÓN ---- */
const i18n = {
  es: {
    nav_inicio: "Inicio",
    nav_musica: "Música",
    nav_videos: "Videos",
    nav_historia: "Historia",
    nav_prensa: "Prensa",
    nav_contacto: "Contacto",
    hero_pre: "Electronic Press Kit · Guatemala · 2026",
    hero_cta_listen: "Escuchar",
    show_eyebrow: "Próximo Show",
    show_title: "Expolatino 2026",
    show_headliner: "★ Artista Headliner ★",
    show_date: "16 de Agosto, 2026",
    show_details: "Calgary, Canadá",
    show_link: "Ver evento ↗",
    show_ig: "Ver anuncio",
    music_eyebrow: "Discografía",
    music_title: "Música",
    np_playing: "Reproduciendo ahora",
    videos_eyebrow: "Visuales",
    videos_title: "Videos",
    vid_label: "Video oficial",
    bio_eyebrow: "El artista",
    bio_title: "Historia",
    bio_short: "Miguel Torres-Deschenes, conocido artísticamente como UNOTOPIC, se está consolidando como una de las voces más cautivadoras de la música global. Su sonido fusiona a la perfección ritmos latinos, R&B soul e influencias urbanas modernas, creando algo inconfundiblemente propio. Con raíces en Canadá y Guatemala, aporta una singular dualidad a su arte: riqueza cultural, emotividad pura y una visión vanguardista del sonido. Su música no solo cruza fronteras, sino que las trasciende.",
    acc_read: "Leer bio completa +",
    acc_close: "Cerrar bio [-]",
    bio_full: `<p>Con presencia en las listas de éxitos en múltiples ocasiones y un impulso innegable, UNOTOPIC se ha posicionado como algo más que un artista emergente: es una fuerza en desarrollo dentro del panorama musical internacional. Su catálogo ha generado más de 1.400 millones de reproducciones, alcanzando una audiencia global y estableciendo una poderosa presencia digital en plataformas como Spotify, Apple Music y YouTube.</p>
    <p>Reconocido por su versatilidad, UNOTOPIC se mueve con naturalidad entre el español y el inglés, creando tanto temas íntimos para la noche como himnos de reguetón llenos de energía. Lanzamientos como Cada Noche y el tan esperado 3AM demuestran su habilidad para crear estribillos atemporales y de gran resonancia emocional, a la vez que evoluciona constantemente su sonido.</p>
    <p>Más allá de su éxito en solitario, UNOTOPIC se ha labrado una sólida reputación en la industria, colaborando con superestrellas mundiales como Drake, Bad Bunny, Rauw Alejandro y Feid, lo que refleja tanto su talento como su creciente influencia a nivel mundial.</p>
    <p>Su presencia en directo sigue expandiéndose internacionalmente, con próximas actuaciones en ciudades como Lisboa, San Diego, La Habana, Barcelona y Guatemala, además de presentaciones por toda Latinoamérica. Sobre el escenario, transmite la misma intensidad y emoción que caracterizan sus grabaciones, creando momentos que van más allá de la música misma.</p>
    <p>Cada lanzamiento de UNOTOPIC es intencional; cada canción es un capítulo de una historia más amplia, sin complejos, envolvente y diseñada para conectar con el público de todo el mundo. Representa a una nueva generación de artistas: sonido global, visión estratégica e ilimitado en potencial.</p>
    <p><strong>ESTO NO ES SOLO EL COMIENZO, este es el ascenso de un artista con mil millones de reproducciones.</strong></p>`,
    press_eyebrow: "Lo que dicen",
    press_title: "Prensa",
    press_quote_1:
      "Unotopic regresó con Cada Noche, un lanzamiento que marca un cambio significativo en el sonido y la emotividad de este artista emergente.",
    press_pub_1: "Billboard Italia",
    press_media_1: '"Cada noche"',
    press_quote_2:
      "Unotopic ya ha aparecido tres veces en el Top 50 de Spotify y también alcanzó el Top 50 de iTunes.",
    press_pub_2: "Billboard Brasil",
    press_media_2: '"Entre dois mundos"',
    press_quote_3:
      "A lo largo de toda su carrera, Uno-Topic, nacido como Miguel Torres-Deschenes, ha sido una figura atípica en el campo latino, y aún más específicamente, dentro del movimiento.",
    press_pub_3: "Billboard World Music",
    press_media_3: "Perfil del artista",
    mk_eyebrow: "Recursos",
    mk_title: "Media Kit",
    mk_intro:
      "Materiales oficiales para prensa, medios y promotores.<br>Contactar a management para acceso completo.",
    contact_eyebrow: "Trabajemos juntos",
    form_name_label: "Nombre",
    form_name_placeholder: "Tu nombre",
    form_email_label: "Email",
    form_email_placeholder: "tu@email.com",
    form_subject_label: "Asunto",
    form_subject_booking: "Booking",
    form_subject_press: "Prensa",
    form_subject_collab: "Colaboración",
    form_subject_other: "Otro",
    form_message_label: "Mensaje",
    form_message_placeholder: "Escribe tu mensaje aquí...",
    form_submit: "Enviar mensaje",
    footer_copy: "© 2026 Unotopic · Todos los derechos reservados",
  },
  en: {
    nav_inicio: "Home",
    nav_musica: "Music",
    nav_videos: "Videos",
    nav_historia: "Story",
    nav_prensa: "Press",
    nav_contacto: "Contact",
    hero_pre: "Electronic Press Kit · Guatemala · 2026",
    hero_cta_listen: "Listen",
    show_eyebrow: "Upcoming Show",
    show_title: "Expolatino 2026",
    show_headliner: "★ Headliner Artist ★",
    show_date: "August 16, 2026",
    show_details: "Calgary, Canada",
    show_link: "View event ↗",
    show_ig: "See announcement",
    music_eyebrow: "Discography",
    music_title: "Music",
    np_playing: "Now Playing",
    videos_eyebrow: "Visuals",
    videos_title: "Videos",
    vid_label: "Official Video",
    bio_eyebrow: "The Artist",
    bio_title: "Story",
    bio_short: "Miguel Torres-Deschenes, known professionally as UNOTOPIC, is quickly becoming one of the most compelling voices in global music. His sound seamlessly blends Latin rhythms, soulful R&B, and modern urban influences to create something unmistakably his own. With roots in both Canada and Guatemala, he brings a unique duality to his art—cultural richness, raw emotion, and a forward-thinking sonic vision. His music doesn't just cross borders; it transcends them.",
    acc_read: "Read full bio +",
    acc_close: "Close bio [-]",
    bio_full: `<p>A frequent presence on the charts with undeniable momentum, UNOTOPIC is more than an emerging artist—he's a growing force in the international music scene. His catalog has racked up over 1.4 billion streams, reaching a worldwide audience and building a powerful digital footprint across Spotify, Apple Music, and YouTube.</p>
    <p>Recognized for his versatility, UNOTOPIC moves effortlessly between Spanish and English, crafting everything from intimate late-night tracks to high-energy reggaeton anthems. Releases like Cada Noche and the highly anticipated 3AM showcase his ability to write timeless, emotionally resonant hooks while constantly evolving his sound.</p>
    <p>Beyond his solo success, UNOTOPIC has built a strong industry reputation, collaborating with global superstars like Drake, Bad Bunny, Rauw Alejandro, and Feid—a testament to both his talent and his rising worldwide influence.</p>
    <p>His live presence continues to expand internationally, with upcoming performances in cities like Lisbon, San Diego, Havana, Barcelona, and Guatemala, and performances across Latin America. On stage, he delivers the same intensity and emotion that define his recordings, creating moments that go beyond the music itself.</p>
    <p>Every UNOTOPIC release is intentional; each song is a chapter in a bigger story—unapologetic, immersive, and designed to connect with listeners around the world. He represents a new generation of artists: global sound, strategic vision, and unlimited potential.</p>
    <p><strong>THIS IS NOT JUST THE BEGINNING—this is the rise of an artist with one billion streams.</strong></p>`,    press_eyebrow: "What They Say",
    press_title: "Press",
    press_quote_1:
      "Unotopic returns with Cada Noche, a release that marks a significant shift in the sound and emotion of this emerging artist.",
    press_pub_1: "Billboard Italia",
    press_media_1: '"Cada noche"',
    press_quote_2:
      "Unotopic has already appeared three times in Spotify's Top 50 and also reached iTunes Top 50.",
    press_pub_2: "Billboard Brazil",
    press_media_2: '"Entre dois mundos"',
    press_quote_3:
      "Throughout his entire career, Uno-Topic, born Miguel Torres-Deschenes, has been an outlier in the Latin field, and even more specifically, within el movimiento.",
    press_pub_3: "Billboard World Music",
    press_media_3: "Artist Profile",
    mk_eyebrow: "Resources",
    mk_title: "Media Kit",
    mk_intro:
      "Official materials for press, media, and promoters.<br>Contact management for full access.",
    contact_eyebrow: "Let's Work Together",
    form_name_label: "Name",
    form_name_placeholder: "Your name",
    form_email_label: "Email",
    form_email_placeholder: "your@email.com",
    form_subject_label: "Subject",
    form_subject_booking: "Booking",
    form_subject_press: "Press",
    form_subject_collab: "Collaboration",
    form_subject_other: "Other",
    form_message_label: "Message",
    form_message_placeholder: "Write your message here...",
    form_submit: "Send message",
    footer_copy: "© 2026 Unotopic · All rights reserved",
  },
};

let currentLang =
  localStorage.getItem("lang") ||
  (navigator.language.startsWith("en") ? "en" : "es");

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  if (typeof closeM === "function") {
    closeM();
  }
  document
    .querySelectorAll(".lang-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("lang-" + lang).classList.add("active");
  document.getElementById("lang-" + lang + "-mob")?.classList.add("active");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang] && i18n[lang][key] !== undefined) {
      el.innerHTML = i18n[lang][key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (i18n[lang] && i18n[lang][key]) {
      el.setAttribute("placeholder", i18n[lang][key]);
    }
  });
  document.querySelectorAll("select option").forEach((opt) => {
    const key = opt.getAttribute("data-i18n");
    if (key && i18n[lang] && i18n[lang][key]) {
      opt.textContent = i18n[lang][key];
    }
  });
  const accBtn = document.getElementById("accBtn");
  if (accBtn) {
    const span = accBtn.querySelector("span");
    if (span) {
      const open = document
        .getElementById("accBody")
        .classList.contains("open");
      span.textContent = open ? i18n[lang].acc_close : i18n[lang].acc_read;
    }
  }
}

setLanguage(currentLang);
