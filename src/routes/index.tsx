import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { apiRequest, assetUrl } from "@/lib/api";
import { fetchPortfolio, type PortfolioData } from "@/lib/portfolio-api";
import { portfolioCopy, type Locale } from "@/lib/portfolio-copy";
import {
  Briefcase, Code2, Database, Facebook, Github, Gitlab, Instagram, LayoutTemplate,
  GraduationCap, Linkedin, Mail, MapPin, MessageCircle, Moon, Palette, Phone, Sun, ListChecks, Wrench, X,
} from "lucide-react";
import portrait from "@/assets/th.png";
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
const socialIcons = [Facebook, Instagram, MessageCircle, Linkedin, Gitlab, Github];
const orbitIcons = Object.entries(import.meta.glob<string>("@/assets/icons/*.jpg", { eager: true, import: "default" }))
  .sort(([first], [second]) => first.localeCompare(second));
const WELCOME_TOAST_DURATION_MS = 8000;

function ProfileOrbit({ portraitAlt, photoSrc }: { portraitAlt: string; photoSrc: string }) {
  const rings = [0, 1, 2].map((ringIndex) =>
    orbitIcons
      .filter((_, iconIndex) => iconIndex % 3 === ringIndex)
      .map(([src], iconIndex, icons) => {
        const angle = (iconIndex / icons.length) * Math.PI * 2 - Math.PI / 2;
        return {
          src,
          left: `${50 + Math.cos(angle) * 50}%`,
          top: `${50 + Math.sin(angle) * 50}%`,
        };
      }),
  );

  return (
    <div className="profile-orbit">
      {rings.map((icons, ringIndex) => (
        <div key={ringIndex} className={`profile-orbit__ring profile-orbit__ring--${ringIndex + 1}`} aria-hidden="true">
          {icons.map(({ src, left, top }) => (
            <div key={src} className="profile-orbit__badge" style={{ left, top }}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      ))}
      <div className="profile-orbit__portrait">
        <img src={photoSrc} alt={portraitAlt} className="h-full w-full scale-110 object-cover" />
      </div>
    </div>
  );
}

function FloatingLanguageSelector({ language, labels, onChange }: { language: Locale; labels: { currentFrench: string; currentEnglish: string; switchToEnglish: string; switchToFrench: string }; onChange: (language: Locale) => void }) {
  function toggleLanguage() {
    onChange(language === "fr" ? "en" : "fr");
  }

  const currentLabel = language === "fr" ? labels.currentFrench : labels.currentEnglish;
  const nextLabel = language === "fr" ? labels.switchToEnglish : labels.switchToFrench;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={`${currentLabel}. ${nextLabel}.`}
      aria-pressed={language === "en"}
      title={`${currentLabel}. ${nextLabel}.`}
      className="fixed bottom-[3.75rem] right-4 z-50 flex h-10 w-12 items-center justify-center rounded-full border border-border bg-background text-xs font-bold text-foreground shadow-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

function groupSkills(skills: PortfolioData["skills"]) {
  const groups = new Map<string, string[]>();
  for (const skill of skills) groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill.name]);
  return [...groups].map(([title, items]) => ({ title, items }));
}

function Index() {
  const [language, setLanguage] = useState<Locale>("fr");
  const [activeSection, setActiveSection] = useState("accueil");
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [darkMode, setDarkMode] = useState(false);
  const [welcomeToastState, setWelcomeToastState] = useState<"visible" | "closing" | "hidden">("visible");
  const welcomeToastTimer = useRef<number | null>(null);

  const copy = portfolioCopy[language];
  const portfolio = useQuery({ queryKey: ["portfolio"], queryFn: fetchPortfolio, retry: false });
  const photoSrc = assetUrl(portfolio.data?.profile.photoUrl) ?? portrait;
  const projects = portfolio.data?.projects ?? [];
  const skillCategories = portfolio.data ? groupSkills(portfolio.data.skills) : copy.skills.categories;
  const experienceEntries = portfolio.data
    ? portfolio.data.experiences.map(({ period, company, role, description }) => ({ year: period, company, role, description }))
    : copy.experience.entries;
  const educationEntries = portfolio.data
    ? portfolio.data.education.map(({ degree, school, description, period }) => ({ degree, school, description, year: period }))
    : copy.education.entries;

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sectionIds = ["accueil", "competences", "experiences", "projets", "education", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
      const result = await apiRequest<{ notificationSent: boolean }>("/api/portfolio/contact", {
        method: "POST",
        body: Object.fromEntries(f),
      });
      form.reset();
      if (result.notificationSent) {
        toast.success(copy.contact.form.sent);
        setStatus("idle");
      } else {
        setStatus("saved");
      }
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#accueil" className="-ml-6 flex items-center gap-3 text-lg font-medium xl:-ml-20">
            <img src={photoSrc} alt="" className="h-11 w-11 rounded-full border object-cover" />
            <span className="name-typeface">Théophile</span>
          </a>
          <nav className="hidden gap-8 text-sm font-medium md:flex lg:gap-10">
            {[
              [copy.navigation.home, "accueil"],
              [copy.navigation.skills, "competences"],
              [copy.navigation.experience, "experiences"],
              [copy.navigation.projects, "projets"],
              [copy.navigation.education, "education"],
              [copy.navigation.contact, "contact"],
            ].map(([l, id]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={() => setActiveSection(id)}
                className={`border-b-2 pb-1 transition-colors ${activeSection === id ? "border-brand text-brand" : "border-transparent hover:border-brand hover:text-brand"} ${id === "contact" ? "xl:-mr-16" : ""}`}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <FloatingLanguageSelector language={language} onChange={changeLanguage} labels={copy.languageSelector} />
      <Toaster position="bottom-right" />
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
        onClick={toggleTheme}
        aria-label={darkMode ? copy.theme.switchToLight : copy.theme.switchToDark}
        aria-pressed={darkMode}
        title={`${darkMode ? copy.theme.dark : copy.theme.light}`}
        className="fixed bottom-1 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {darkMode ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
      </button>

      <section id="accueil" className="page-rail grid max-w-6xl scroll-mt-28 items-center gap-12 pb-10 pt-4 md:grid-cols-2">
        <div>
          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            {copy.hero.greeting} <span className="name-typeface block text-brand">RASOLOFOSON Théophile</span>
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
        <div className="relative mx-auto w-full max-w-[34rem] xl:translate-x-12">
          <ProfileOrbit portraitAlt={copy.hero.portraitAlt} photoSrc={photoSrc} />
          <div className="card-soft absolute -bottom-2 right-0 flex items-center gap-2 px-4 py-3 text-sm font-medium">{copy.hero.role}</div>
        </div>
      </section>
      <section id="competences" className="bg-surface py-24">
        <Title t={copy.skills.title} sub={copy.skills.subtitle} big />
        <div className="page-rail grid max-w-7xl gap-8 md:grid-cols-3">
          {skillCategories.map(({ title, items }, index) => {
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
            {experienceEntries.map(({ year, company, role, description }, index) => (
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
          {projects.map((project) => {
            const imageSrc = assetUrl(project.imageUrl);
            return (
              <article key={project.id} className="card-soft dark:bg-card overflow-hidden transition hover:-translate-y-1">
                <Link to="/projets/$projectId" params={{ projectId: String(project.id) }} className="block">
                  {imageSrc ? (
                    <img src={imageSrc} alt={project.title} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-muted text-brand">
                      <Code2 className="h-10 w-10" aria-hidden="true" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-medium">{project.title}</h3>
                    <p className="mt-3 line-clamp-2 text-muted-foreground">{project.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="chip font-medium">{item}</span>)}</div>
                    <span className="mt-5 inline-block font-medium text-brand">{copy.projects.viewProject}</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section id="education" className="py-24">
        <Title t={copy.education.title} />
        <div className="page-rail relative max-w-7xl">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-brand-soft md:block" />
          <div className="space-y-12">
            {educationEntries.map(({ degree, school, description, year }, index) => (
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
            <h3 className="name-typeface mt-5 text-2xl font-bold">RASOLOFOSON Théophile</h3>
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
