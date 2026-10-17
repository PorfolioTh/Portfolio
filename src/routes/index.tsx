import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendContactMessage } from "@/lib/contact.functions";
import { portfolioCopy, type Locale } from "@/lib/portfolio-copy";
import {
  Briefcase, Code2, Database, Facebook, Github, Gitlab, Instagram, LayoutTemplate,
  GraduationCap, Linkedin, Mail, MapPin, MessageCircle, Moon, Palette, Phone, Sun, ListChecks, Wrench, X,
} from "lucide-react";
import portrait from "@/assets/portrait.jfif";
import maritime from "@/assets/maritime.jpg";
import aesna from "@/assets/aesna.jpg";
import vanilla from "@/assets/vanilla.jpg";
import handshake from "@/assets/handshake.jpg";
import cv from "@/assets/CV/CV - ThéophileRas.pdf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: portfolioCopy.fr.metadata.title },
      { name: "description", content: portfolioCopy.fr.metadata.description },
      { property: "og:title", content: portfolioCopy.fr.metadata.title },
      { property: "og:description", content: portfolioCopy.fr.metadata.socialDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const skillIcons = [LayoutTemplate, Code2, Database, Palette, ListChecks, Wrench];
const projectImages = [maritime, aesna, vanilla];
const socialIcons = [Facebook, Instagram, MessageCircle, Linkedin, Gitlab, Github];
const WELCOME_TOAST_DURATION_MS = 8000;

type FloatingPosition = { left: number; top: number };

function clampFloatingPosition(left: number, top: number, width = 40, height = width) {
  const margin = 8;
  return {
    left: Math.max(margin, Math.min(left, window.innerWidth - width - margin)),
    top: Math.max(margin, Math.min(top, window.innerHeight - height - margin)),
  };
}

function FloatingLanguageSelector({ language, labels, dragLabel, onChange }: { language: Locale; labels: { currentFrench: string; currentEnglish: string; switchToEnglish: string; switchToFrench: string }; dragLabel: string; onChange: (language: Locale) => void }) {
  const [position, setPosition] = useState<FloatingPosition | null>(null);
  const dragState = useRef<{ pointerX: number; pointerY: number; left: number; top: number; currentLeft: number; currentTop: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("language-selector-position");
      if (saved) {
        const parsed = JSON.parse(saved) as { left?: unknown; top?: unknown };
        if (typeof parsed.left === "number" && typeof parsed.top === "number") {
          setPosition(clampFloatingPosition(parsed.left, parsed.top, 48, 40));
        }
      }
    } catch {
      // Ignore invalid or unavailable position storage.
    }

    const clampAfterResize = () => setPosition((current) => current ? clampFloatingPosition(current.left, current.top, 48, 40) : current);
    window.addEventListener("resize", clampAfterResize);
    return () => window.removeEventListener("resize", clampAfterResize);
  }, []);

  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragState.current = { pointerX: event.clientX, pointerY: event.clientY, left: bounds.left, top: bounds.top, currentLeft: bounds.left, currentTop: bounds.top, moved: false };
    const captureTarget = event.target instanceof HTMLElement ? event.target : event.currentTarget;
    captureTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragState.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.pointerX;
    const deltaY = event.clientY - drag.pointerY;
    if (!drag.moved && Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) return;
    drag.moved = true;
    const next = clampFloatingPosition(drag.left + deltaX, drag.top + deltaY, event.currentTarget.offsetWidth, event.currentTarget.offsetHeight);
    drag.currentLeft = next.left;
    drag.currentTop = next.top;
    setPosition(next);
  }

  function endDrag() {
    const drag = dragState.current;
    dragState.current = null;
    if (!drag?.moved) return;
    const next = { left: drag.currentLeft, top: drag.currentTop };
    setPosition(next);
    suppressClick.current = true;
    window.setTimeout(() => { suppressClick.current = false; }, 0);
    try {
      window.localStorage.setItem("language-selector-position", JSON.stringify(next));
    } catch {
      // The selector remains movable when storage is unavailable.
    }
  }

  function toggleLanguage() {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    onChange(language === "fr" ? "en" : "fr");
  }

  const currentLabel = language === "fr" ? labels.currentFrench : labels.currentEnglish;
  const nextLabel = language === "fr" ? labels.switchToEnglish : labels.switchToFrench;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={`${currentLabel}. ${nextLabel}. ${dragLabel}.`}
      aria-pressed={language === "en"}
      title={`${currentLabel}. ${nextLabel}. ${dragLabel}.`}
      style={position ? { left: position.left, top: position.top, right: "auto", bottom: "auto" } : undefined}
      className="fixed bottom-20 right-6 z-50 flex h-10 w-12 touch-none select-none cursor-grab items-center justify-center rounded-full border border-border bg-background text-xs font-bold text-foreground shadow-lg transition-colors hover:bg-muted active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {language.toUpperCase()}
    </button>
  );
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
  const [language, setLanguage] = useState<Locale>("fr");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "saved" | "error">("idle");
  const [darkMode, setDarkMode] = useState(false);
  const [welcomeToastState, setWelcomeToastState] = useState<"visible" | "closing" | "hidden">("visible");
  const [togglePosition, setTogglePosition] = useState<{ left: number; top: number } | null>(null);
  const dragState = useRef<{ pointerX: number; pointerY: number; left: number; top: number; currentLeft: number; currentTop: number; moved: boolean } | null>(null);
  const suppressToggleClick = useRef(false);
  const welcomeToastTimer = useRef<number | null>(null);
  const send = useServerFn(sendContactMessage);
  const copy = portfolioCopy[language];

  useEffect(() => {
    welcomeToastTimer.current = window.setTimeout(() => setWelcomeToastState("closing"), WELCOME_TOAST_DURATION_MS);
    try {
      const savedLanguage = window.localStorage.getItem("portfolio-language");
      if (savedLanguage === "fr" || savedLanguage === "en") setLanguage(savedLanguage);
    } catch {
      // Use French when language storage is unavailable.
    }
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

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", copy.metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", copy.metadata.socialDescription);
  }, [copy.metadata.description, copy.metadata.socialDescription, copy.metadata.title, language]);

  function changeLanguage(nextLanguage: Locale) {
    setLanguage(nextLanguage);
    try {
      window.localStorage.setItem("portfolio-language", nextLanguage);
    } catch {
      // The current page still changes language when storage is unavailable.
    }
  }

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
            {[
              [copy.navigation.home, "accueil"],
              [copy.navigation.skills, "competences"],
              [copy.navigation.experience, "experiences"],
              [copy.navigation.projects, "projets"],
              [copy.navigation.education, "education"],
              [copy.navigation.contact, "contact"],
            ].map(([l, id], i) => (
              <a key={id} href={`#${id}`} className={`${i === 0 ? "border-b-2 border-brand pb-1 text-brand" : "hover:text-brand"} ${id === "contact" ? "xl:-mr-16" : ""}`}>{l}</a>
            ))}
          </nav>
        </div>
      </header>
      <FloatingLanguageSelector language={language} onChange={changeLanguage} labels={copy.languageSelector} dragLabel={copy.theme.drag} />
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
          <span className="text-sm font-medium">{copy.toast.welcome}</span>
          <button
            type="button"
            onClick={dismissWelcomeToast}
            aria-label={copy.toast.close}
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
        aria-label={`${darkMode ? copy.theme.switchToLight : copy.theme.switchToDark}. ${copy.theme.drag}`}
        aria-pressed={darkMode}
        title={`${darkMode ? copy.theme.dark : copy.theme.light}. ${copy.theme.drag}`}
        style={togglePosition ? { left: togglePosition.left, top: togglePosition.top, right: "auto", bottom: "auto" } : undefined}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 touch-none select-none cursor-grab items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-colors hover:bg-muted active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {darkMode ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
      </button>

      <section id="accueil" className="page-rail grid max-w-6xl scroll-mt-28 items-center gap-12 pb-10 pt-4 md:grid-cols-2">
        <div>
          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            {copy.hero.greeting} <span className="block text-brand">RASOLOFOSON Théophile</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">{copy.hero.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["JavaScript", "TypeScript", "Vue", "React", "Node.js"].map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
          <p className="mt-6 flex items-center gap-1 font-medium text-brand"><MapPin className="h-5 w-5" /> {copy.hero.location}</p>
          <div className="mt-8 flex gap-4">
            <a href="#contact" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">{copy.hero.contact}</a>
            <a href={cv} download="CV-Theophile-Ras.pdf" className="rounded-lg border border-foreground px-6 py-3 font-medium hover:bg-muted">{copy.hero.download}</a>
          </div>
        </div>
        <div className="relative mx-auto xl:translate-x-16">
          <div className="h-72 w-72 translate-x-4 overflow-hidden rounded-full border-4 border-brand-soft shadow-2xl md:h-[26rem] md:w-[26rem] md:translate-x-6">
            <img src={portrait} alt={copy.hero.portraitAlt} className="h-full w-full scale-110 object-cover" />
          </div>
          <div className="card-soft absolute -bottom-2 right-0 flex items-center gap-2 px-4 py-3 text-sm font-medium">{copy.hero.role}</div>
        </div>
      </section>
      <section id="competences" className="bg-surface py-24">
        <Title t={copy.skills.title} sub={copy.skills.subtitle} big />
        <div className="page-rail grid max-w-7xl gap-8 md:grid-cols-3">
          {copy.skills.categories.map(({ title, items }, index) => {
            const Icon = skillIcons[index] ?? LayoutTemplate;
            return (
              <div key={title} className="card-soft p-7 transition hover:-translate-y-1">
                <div className="flex items-center gap-4"><div className="icon-tile"><Icon className="h-5 w-5" /></div><h3 className="text-lg font-medium">{title}</h3></div>
                <div className="mt-5 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="chip">{item}</span>)}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="experiences" className="py-24">
        <Title t={copy.experience.title} />
        <div className="page-rail relative max-w-7xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-brand-soft md:block" />
          <div className="space-y-12">
            {copy.experience.entries.map(({ year, company, role, description }, index) => (
              <div key={`${year}-${company}-${role}`} className={`relative md:w-1/2 ${index % 2 ? "md:ml-auto md:pl-0" : "md:pr-0"}`}>
                <span className={`absolute top-1/2 hidden h-2.5 w-2.5 rounded-full bg-brand md:block ${index % 2 ? "-left-[5px]" : "-right-[5px]"}`} />
                <div className="card-soft flex gap-5 p-7">
                  <div className="icon-tile shrink-0"><Briefcase className="h-5 w-5" /></div>
                  <div>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">{year}</span>
                    <h3 className="mt-3 text-xl font-medium">{company}</h3>
                    <p className="font-medium text-brand">{role}</p>
                    <p className="mt-2 text-muted-foreground">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projets" className="bg-surface py-24">
        <Title t={copy.projects.title} />
        <div className="page-rail grid max-w-7xl gap-8 md:grid-cols-3">
          {copy.projects.entries.map((project, index) => (
            <article key={project.title} className="card-soft dark:bg-card overflow-hidden transition hover:-translate-y-1">
              <img src={projectImages[index] ?? maritime} alt={project.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-medium">{project.title}</h3>
                <p className="mt-3 line-clamp-2 text-muted-foreground">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="chip font-medium">{item}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="py-24">
        <Title t={copy.education.title} />
        <div className="page-rail relative max-w-7xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-brand-soft md:block" />
          <div className="space-y-12">
            {copy.education.entries.map(({ degree, school, description, year }, index) => (
              <div key={degree} className={`relative md:w-1/2 ${index % 2 ? "md:ml-auto md:pl-0" : "md:pr-0"}`}>
                <span className={`absolute top-1/2 hidden h-2.5 w-2.5 rounded-full bg-brand md:block ${index % 2 ? "-left-[5px]" : "-right-[5px]"}`} />
                <div className="card-soft flex gap-5 p-7">
                  <div className="icon-tile shrink-0"><GraduationCap className="h-5 w-5" /></div>
                  <div>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">{year}</span>
                    <h3 className="mt-3 text-xl font-medium">{degree}</h3>
                    <p className="font-medium text-brand">{school}</p>
                    <p className="mt-2 text-muted-foreground">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-surface py-24">
        <Title t={copy.contact.title} sub={copy.contact.subtitle} big />
        <div className="page-rail grid max-w-6xl gap-10 md:grid-cols-2">
          <div className="card-soft p-9">
            <img src={handshake} alt="" className="h-32 w-32 rounded-full object-cover" />
            <h3 className="mt-5 text-2xl font-bold">RASOLOFOSON Théophile</h3>
            <p className="font-medium text-brand">{copy.contact.role}</p>
            <p className="mt-4 text-muted-foreground">{copy.contact.availability}</p>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center gap-3"><Phone className="h-5 w-5" /> +261 14 348 63</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5" /> <a href="mailto:rasolofosontheophile43@gmail.com">{copy.contact.professionalEmail}</a></li>
              <li className="flex items-center gap-3"><MessageCircle className="h-5 w-5" /> {copy.contact.whatsapp}</li>
            </ul>
            <p className="mt-8 font-medium">{copy.contact.follow}</p>
            <div className="mt-3 flex gap-3">
              {socialIcons.map((Icon, index) => <a key={copy.socialLabels[index]} href="#" aria-label={copy.socialLabels[index]} className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-brand hover:bg-brand-soft"><Icon className="h-5 w-5" /></a>)}
            </div>
          </div>
          <form className="card-soft space-y-5 p-9" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">{copy.contact.form.name}<input name="name" required maxLength={100} className="field" /></label>
              <label className="text-sm font-medium">{copy.contact.form.phone}<input name="phone" maxLength={30} className="field" /></label>
            </div>
            <label className="block text-sm font-medium">{copy.contact.form.email}<input name="email" type="email" maxLength={255} required className="field" /></label>
            <label className="block text-sm font-medium">{copy.contact.form.subject}<input name="subject" maxLength={200} className="field" /></label>
            <label className="block text-sm font-medium">{copy.contact.form.message}<textarea name="message" required maxLength={5000} rows={6} className="field" /></label>
            <button disabled={status === "loading"} className="w-full disabled:opacity-60 rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90">{status === "loading" ? copy.contact.form.sending : copy.contact.form.submit}</button>
            {status === "ok" && <p className="text-center text-sm text-brand">{copy.contact.form.sent}</p>}
            {status === "saved" && <p className="text-center text-sm text-destructive">{copy.contact.form.saved}</p>}
            {status === "error" && <p className="text-center text-sm text-destructive">{copy.contact.form.error}</p>}
          </form>
        </div>
      </section>

      <footer className="bg-footer py-14 text-footer-foreground">
        <div className="page-rail grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <h4 className="text-xl font-medium">{copy.footer.about}</h4>
            <p className="mt-4 text-sm opacity-80">{copy.footer.aboutDescription}</p>
            <p className="mt-4 text-xs opacity-60">{copy.footer.availability}</p>
          </div>
          <div>
            <h4 className="text-xl font-medium">{copy.footer.networks}</h4>
            <div className="mt-4 flex gap-3">
              {socialIcons.map((Icon, index) => <a key={copy.socialLabels[index]} href="#" aria-label={copy.socialLabels[index]} className="flex h-11 w-11 items-center justify-center rounded-lg border border-footer-foreground/20 bg-footer-foreground/5 hover:bg-footer-foreground/15"><Icon className="h-5 w-5" /></a>)}
            </div>
            <p className="mt-4 text-xs opacity-60">{copy.footer.socialDescription}</p>
          </div>
          <div>
            <h4 className="text-xl font-medium">{copy.footer.contact}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3"><Phone className="h-5 w-5" /> +261 14 348 63</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5" /> rasolofosontheophile43@gmail.com</li>
              <li className="flex items-center gap-3"><MapPin className="h-5 w-5" /> {copy.footer.location}</li>
            </ul>
          </div>
        </div>
        <p className="page-rail mt-12 max-w-6xl border-t border-footer-foreground/10 pt-6 text-center text-sm opacity-50">{copy.footer.copyright}</p>
      </footer>
    </div>
  );
}
