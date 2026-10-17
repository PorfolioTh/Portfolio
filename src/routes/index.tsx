import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendContactMessage } from "@/lib/contact.functions";
import {
  Briefcase, Code2, Database, Facebook, Github, Gitlab, Instagram, LayoutTemplate,
  GraduationCap, Linkedin, Mail, MapPin, MessageCircle, Moon, Palette, Phone, Sun, ListChecks, Wrench, X,
} from "lucide-react";
import portrait from "@/assets/portrait.jfif";
import maritime from "@/assets/maritime.jpg";
import aesna from "@/assets/aesna.jpg";
import vanilla from "@/assets/vanilla.jpg";
import handshake from "@/assets/handshake.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RASOLOFOSON Théophile — Développeur logiciel" },
      { name: "description", content: "Portfolio de RASOLOFOSON Théophile, développeur Vue, React et Node.js à Antsirabe." },
      { property: "og:title", content: "RASOLOFOSON Théophile — Développeur logiciel" },
      { property: "og:description", content: "Applications modernes, rapides et scalables en Vue, React et Node.js." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  ["Accueil", "accueil"], ["Compétences", "competences"], ["Expériences", "experiences"],
  ["Projets", "projets"], ["Éducation", "education"], ["Contact", "contact"],
];

const skills = [
  { t: "Frontend", i: LayoutTemplate, s: ["React.js", "Vue.js", "JavaScript", "TypeScript", "HTML/CSS", "TailwindCSS", "SASS"] },
  { t: "Backend", i: Code2, s: ["Node.js", "PHP"] },
  { t: "Base de données", i: Database, s: ["MongoDB", "MySQL"] },
  { t: "Design", i: Palette, s: ["Figma"] },
  { t: "Methodologies", i: ListChecks, s: ["2TUP", "Merise", "Agil - Scrum", "UML"] },
  { t: "Outils", i: Wrench, s: ["Visual paradigme", "VS Code", "Postman", "Git/GitHub/GitLab"] },
];

const xp = [
  ["2025", "Mahiratra Groupe", "Application Intranet", "Développement d'une application intranet pour la gestion interne de l'entreprise."],
  ["2025", "Mahiratra Groupe", "Transformation Digitale", "Développement d'une application transport maritime pour la gestion des bateaux pour une entreprise."],
  ["2024", "Tranoweb", "Mdgformation", "Contribution au développement d'une plateforme de formation en ligne."],
  ["2023", "Faculté de Sciences", "Gestion d'emploi du temps", "Développement d'un système de gestion d'emploi du temps universitaire."],
  ["2022", "Fyhary Soft", "Gestion d'entrepôt", "Création d'une application de gestion de stock et d'entrepôt."],
];

const projects = [
  { t: "Transport Maritime", img: maritime, d: "Plateforme complète de gestion du transport maritime : réservation de cargaisons, suivi des navires et facturation.", s: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Redux Toolkit", "Figma"] },
  { t: "AESN Fianarantsoa", img: aesna, d: "Site vitrine d'une association d'étudiants solidaires et natifs d'Antalaha, mettant en avant les activités.", s: ["React", "TypeScript", "Tailwind CSS"] },
  { t: "Natura Vanilla", img: vanilla, d: "Site vitrine pour une entreprise spécialisée dans la production et la vente de vanille naturelle à Madagascar.", s: ["HTML", "CSS", "JavaScript", "Tailwind CSS"] },
];

const edu = [
  ["Master professionnel et ingénieur en informatique", "École Nationale de l'Informatique (ENI), Madagascar", "Spécialisation en Génie logiciel & Base de données", "2025"],
  ["Licence professionnelle en informatique", "École Nationale de l'Informatique (ENI), Madagascar", "Formation approfondie en développement logiciel", "2023"],
  ["Baccalauréat", "Lycée Horace François, Antalaha, Madagascar", "Obtention du diplôme du baccalauréat", "2019"],
];

const socials = [Facebook, Instagram, MessageCircle, Linkedin, Gitlab, Github];
const WELCOME_TOAST_DURATION_MS = 8000;

function clampFloatingPosition(left: number, top: number, size = 40) {
  const margin = 8;
  return {
    left: Math.max(margin, Math.min(left, window.innerWidth - size - margin)),
    top: Math.max(margin, Math.min(top, window.innerHeight - size - margin)),
  };
}

function Title({ t, sub, big }: { t: string; sub?: string; big?: boolean }) {
  return (
    <div className="page-rail mb-14 text-left">
      <h2 className={big ? "text-4xl font-bold md:text-5xl" : "text-3xl font-medium md:text-4xl"}>{t}</h2>
      {sub && <p className="mt-2 text-muted-foreground">{sub}</p>}
      <div className="section-bar" />
    </div>
  );
}

function Index() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "saved" | "error">("idle");
  const [darkMode, setDarkMode] = useState(false);
  const [welcomeToastState, setWelcomeToastState] = useState<"visible" | "closing" | "hidden">("visible");
  const [togglePosition, setTogglePosition] = useState<{ left: number; top: number } | null>(null);
  const dragState = useRef<{ pointerX: number; pointerY: number; left: number; top: number; currentLeft: number; currentTop: number; moved: boolean } | null>(null);
  const suppressToggleClick = useRef(false);
  const welcomeToastTimer = useRef<number | null>(null);
  const send = useServerFn(sendContactMessage);

  useEffect(() => {
    welcomeToastTimer.current = window.setTimeout(() => setWelcomeToastState("closing"), WELCOME_TOAST_DURATION_MS);
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("theme");
    } catch {
      // Storage may be disabled; use the system preference instead.
    }
    const shouldUseDark = savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);

    try {
      const savedPosition = window.localStorage.getItem("theme-toggle-position");
      if (savedPosition) {
        const parsed = JSON.parse(savedPosition) as { left?: unknown; top?: unknown };
        if (typeof parsed.left === "number" && typeof parsed.top === "number") {
          setTogglePosition(clampFloatingPosition(parsed.left, parsed.top));
        }
      }
    } catch {
      // Ignore invalid or unavailable position storage.
    }

    return () => {
      if (welcomeToastTimer.current !== null) window.clearTimeout(welcomeToastTimer.current);
    };
  }, []);

  function toggleTheme() {
    const nextThemeIsDark = !darkMode;
    setDarkMode(nextThemeIsDark);
    document.documentElement.classList.toggle("dark", nextThemeIsDark);
    try {
      window.localStorage.setItem("theme", nextThemeIsDark ? "dark" : "light");
    } catch {
      // The current page still updates when storage is unavailable.
    }
  }

  function startToggleDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragState.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      left: bounds.left,
      top: bounds.top,
      currentLeft: bounds.left,
      currentTop: bounds.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveToggle(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragState.current;
    if (!drag) return;

    const deltaX = event.clientX - drag.pointerX;
    const deltaY = event.clientY - drag.pointerY;
    if (!drag.moved && Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) return;

    drag.moved = true;
    const position = clampFloatingPosition(drag.left + deltaX, drag.top + deltaY, event.currentTarget.offsetWidth);
    drag.currentLeft = position.left;
    drag.currentTop = position.top;
    setTogglePosition(position);
  }

  function finishToggleDrag() {
    const drag = dragState.current;
    dragState.current = null;
    if (!drag?.moved) return;

    const position = { left: drag.currentLeft, top: drag.currentTop };
    setTogglePosition(position);
    suppressToggleClick.current = true;
    window.setTimeout(() => {
      suppressToggleClick.current = false;
    }, 0);
    try {
      window.localStorage.setItem("theme-toggle-position", JSON.stringify(position));
    } catch {
      // The control remains movable when storage is unavailable.
    }
  }

  function handleToggleClick() {
    if (suppressToggleClick.current) {
      suppressToggleClick.current = false;
      return;
    }
    toggleTheme();
  }

  function dismissWelcomeToast() {
    if (welcomeToastTimer.current !== null) window.clearTimeout(welcomeToastTimer.current);
    setWelcomeToastState("closing");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setStatus("loading");
    try {
      const result = await send({ data: Object.fromEntries(f) });
      form.reset();
      setStatus(result.notificationSent ? "ok" : "saved");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#accueil" className="-ml-6 flex items-center gap-3 text-lg font-medium xl:-ml-20">
            <img src={portrait} alt="" className="h-11 w-11 rounded-full border object-cover" />
            Théophile
          </a>
          <nav className="hidden gap-8 text-sm font-medium md:flex lg:gap-10">
            {nav.map(([l, id], i) => (
              <a key={id} href={`#${id}`} className={`${i === 0 ? "border-b-2 border-brand pb-1 text-brand" : "hover:text-brand"} ${id === "contact" ? "xl:-mr-16" : ""}`}>{l}</a>
            ))}
          </nav>
        </div>
      </header>
      {welcomeToastState !== "hidden" && (
        <div
          role="status"
          aria-live="polite"
          onAnimationEnd={(event) => {
            if (welcomeToastState === "closing" && event.animationName === "welcome-toast-exit") {
              setWelcomeToastState("hidden");
            }
          }}
          className={`fixed left-4 right-4 top-20 z-[60] mx-auto flex w-fit items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-card-foreground shadow-lg sm:left-auto sm:right-6 sm:mx-0 ${welcomeToastState === "closing" ? "welcome-toast-exit" : "welcome-toast-enter"}`}
        >
          <span className={`welcome-wave ${welcomeToastState === "closing" ? "welcome-wave-stopped" : ""}`} aria-hidden="true">👋</span>
          <span className="text-sm font-medium">Bienvenue dans mon univers</span>
          <button
            type="button"
            onClick={dismissWelcomeToast}
            aria-label="Fermer la notification"
            className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handleToggleClick}
        onPointerDown={startToggleDrag}
        onPointerMove={moveToggle}
        onPointerUp={finishToggleDrag}
        onPointerCancel={finishToggleDrag}
        aria-label={`${darkMode ? "Activer le mode clair" : "Activer le mode sombre"}. Glisser pour déplacer.`}
        aria-pressed={darkMode}
        title={`${darkMode ? "Mode sombre" : "Mode clair"}. Glisser pour déplacer.`}
        style={togglePosition ? { left: togglePosition.left, top: togglePosition.top, right: "auto", bottom: "auto" } : undefined}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 touch-none select-none cursor-grab items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-colors hover:bg-muted active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {darkMode ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
      </button>

      <section id="accueil" className="page-rail grid max-w-6xl items-center gap-12 pb-10 pt-4 md:grid-cols-2">
        <div>
          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            Bonjour, je suis <span className="block text-brand">RASOLOFOSON Théophile</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Développeur logiciel spécialisé en <b className="text-foreground">Vue, React, Node.js</b>. Je transforme des idées en applications modernes, rapides et scalables.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["JavaScript", "TypeScript", "Vue", "React", "Node.js"].map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
          <p className="mt-6 flex items-center gap-1 font-medium text-brand"><MapPin className="h-5 w-5" /> Antsirabe, Madagascar</p>
          <div className="mt-8 flex gap-4">
            <a href="#contact" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">Me contacter</a>
            <a href="#" className="rounded-lg border border-foreground px-6 py-3 font-medium hover:bg-muted">Télécharger CV</a>
          </div>
        </div>
        <div className="relative mx-auto xl:translate-x-16">
          <div className="h-72 w-72 translate-x-4 overflow-hidden rounded-full border-4 border-brand-soft shadow-2xl md:h-[26rem] md:w-[26rem] md:translate-x-6">
            <img src={portrait} alt="RASOLOFOSON Théophile" className="h-full w-full scale-110 object-cover" />
          </div>
          <div className="card-soft absolute -bottom-2 right-0 flex items-center gap-2 px-4 py-3 text-sm font-medium">Dev Full Stack</div>
        </div>
      </section>
      <section id="competences" className="bg-surface py-24">
        <Title t="Compétences techniques" sub="Technologies & outils que j'utilise au quotidien" big />
        <div className="page-rail grid max-w-7xl gap-8 md:grid-cols-3">
          {skills.map(({ t, i: I, s }) => (
            <div key={t} className="card-soft p-7 transition hover:-translate-y-1">
              <div className="flex items-center gap-4"><div className="icon-tile"><I className="h-5 w-5" /></div><h3 className="text-lg font-medium">{t}</h3></div>
              <div className="mt-5 flex flex-wrap gap-2">{s.map((x) => <span key={x} className="chip">{x}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="experiences" className="py-24">
        <Title t="Expériences Professionnelles" />
        <div className="page-rail relative max-w-7xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-brand-soft md:block" />
          <div className="space-y-12">
            {xp.map(([y, c, r, d], i) => (
              <div key={i} className={`relative md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-0" : "md:pr-0"}`}>
                <span className={`absolute top-1/2 hidden h-2.5 w-2.5 rounded-full bg-brand md:block ${i % 2 ? "-left-[5px]" : "-right-[5px]"}`} />
                <div className="card-soft flex gap-5 p-7">
                  <div className="icon-tile shrink-0"><Briefcase className="h-5 w-5" /></div>
                  <div>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">{y}</span>
                    <h3 className="mt-3 text-xl font-medium">{c}</h3>
                    <p className="font-medium text-brand">{r}</p>
                    <p className="mt-2 text-muted-foreground">{d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projets" className="bg-surface py-24">
        <Title t="Projets et realisation" />
        <div className="page-rail grid max-w-7xl gap-8 md:grid-cols-3">
          {projects.map((p) => (
            <article key={p.t} className="card-soft dark:bg-card overflow-hidden transition hover:-translate-y-1">
              <img src={p.img} alt={p.t} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-medium">{p.t}</h3>
                <p className="mt-3 line-clamp-2 text-muted-foreground">{p.d}</p>
                <div className="mt-5 flex flex-wrap gap-2">{p.s.map((x) => <span key={x} className="chip font-medium">{x}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="py-24">
        <Title t="Éducation" />
        <div className="page-rail relative max-w-7xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-brand-soft md:block" />
          <div className="space-y-12">
            {edu.map(([t, s, d, y], i) => (
              <div key={t} className={`relative md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-0" : "md:pr-0"}`}>
                <span className={`absolute top-1/2 hidden h-2.5 w-2.5 rounded-full bg-brand md:block ${i % 2 ? "-left-[5px]" : "-right-[5px]"}`} />
                <div className="card-soft flex gap-5 p-7">
                  <div className="icon-tile shrink-0"><GraduationCap className="h-5 w-5" /></div>
                  <div>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">{y}</span>
                    <h3 className="mt-3 text-xl font-medium">{t}</h3>
                    <p className="font-medium text-brand">{s}</p>
                    <p className="mt-2 text-muted-foreground">{d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-surface py-24">
        <Title t="Contact" sub="Restons en contact" big />
        <div className="page-rail grid max-w-6xl gap-10 md:grid-cols-2">
          <div className="card-soft p-9">
            <img src={handshake} alt="" className="h-32 w-32 rounded-full object-cover" />
            <h3 className="mt-5 text-2xl font-bold">RASOLOFOSON Théophile</h3>
            <p className="font-medium text-brand">Développeur Logiciel</p>
            <p className="mt-4 text-muted-foreground">Disponible pour vos projets web, mobile et systèmes.</p>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center gap-3"><Phone className="h-5 w-5" /> +261 14 348 63</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5" /> <a href="mailto:rasolofosontheophile43@gmail.com">Email professionnel</a></li>
              <li className="flex items-center gap-3"><MessageCircle className="h-5 w-5" /> WhatsApp direct</li>
            </ul>
            <p className="mt-8 font-medium">Me suivre</p>
            <div className="mt-3 flex gap-3">
              {socials.map((I, i) => <a key={i} href="#" className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-brand hover:bg-brand-soft"><I className="h-5 w-5" /></a>)}
            </div>
          </div>
          <form className="card-soft space-y-5 p-9" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">Nom<input name="name" required maxLength={100} className="field" /></label>
              <label className="text-sm font-medium">Téléphone<input name="phone" maxLength={30} className="field" /></label>
            </div>
            <label className="block text-sm font-medium">Email<input name="email" type="email" maxLength={255} required className="field" /></label>
            <label className="block text-sm font-medium">Sujet<input name="subject" maxLength={200} className="field" /></label>
            <label className="block text-sm font-medium">Message<textarea name="message" required maxLength={5000} rows={6} className="field" /></label>
            <button disabled={status === "loading"} className="w-full disabled:opacity-60 rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90">{status === "loading" ? "Envoi..." : "Envoyer le message"}</button>
            {status === "ok" && <p className="text-center text-sm text-brand">Merci ! Votre message a bien été envoyé.</p>}
            {status === "saved" && <p className="text-center text-sm text-destructive">Votre message est enregistré, mais l'e-mail de notification n'a pas pu être envoyé.</p>}
            {status === "error" && <p className="text-center text-sm text-destructive">Une erreur est survenue, veuillez réessayer.</p>}
          </form>
        </div>
      </section>

      <footer className="bg-footer py-14 text-footer-foreground">
        <div className="page-rail grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <h4 className="text-xl font-medium">À propos</h4>
            <p className="mt-4 text-sm opacity-80">Passionné par le développement logiciel et la création d'interfaces modernes. J'aime transformer des idées en produits concrets et utiles.</p>
            <p className="mt-4 text-xs opacity-60">Disponible pour missions freelance & collaborations.</p>
          </div>
          <div>
            <h4 className="text-xl font-medium">Réseaux</h4>
            <div className="mt-4 flex gap-3">
              {socials.map((I, i) => <a key={i} href="#" className="flex h-11 w-11 items-center justify-center rounded-lg border border-footer-foreground/20 bg-footer-foreground/5 hover:bg-footer-foreground/15"><I className="h-5 w-5" /></a>)}
            </div>
            <p className="mt-4 text-xs opacity-60">Suivez-moi pour mes projets et updates</p>
          </div>
          <div>
            <h4 className="text-xl font-medium">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3"><Phone className="h-5 w-5" /> +261 14 348 63</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5" /> rasolofosontheophile43@gmail.com</li>
              <li className="flex items-center gap-3"><MapPin className="h-5 w-5" /> Antsirabe, Madagascar</li>
            </ul>
          </div>
        </div>
        <p className="page-rail mt-12 max-w-6xl border-t border-footer-foreground/10 pt-6 text-center text-sm opacity-50">© 2023 RASOLOFOSON Théophile</p>
      </footer>
    </div>
  );
}
