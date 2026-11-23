import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { apiRequest, assetUrl } from "@/lib/api";
import { fetchPortfolio, type PortfolioData } from "@/lib/portfolio-api";
import { portfolioCopy, type Locale } from "@/lib/portfolio-copy";
import {
  Briefcase, Code2, Database, ExternalLink, Facebook, Github, Instagram, LayoutTemplate,
  GraduationCap, Mail, MapPin, MessageCircle, Moon, Palette, Phone, Sun, ListChecks, Wrench, X,
} from "lucide-react";
import handshake from "@/assets/handshake.jpg";
import icon14779d4968d4999239dc8264fdd026cc from "@/assets/icons/14779d4968d4999239dc8264fdd026cc.jpg";
import icon1b29a538acb3efa07b2289d932b2daa9 from "@/assets/icons/1b29a538acb3efa07b2289d932b2daa9.jpg";
import icon1d963dce52d6527abc02fc4d37337b09 from "@/assets/icons/1d963dce52d6527abc02fc4d37337b09.jpg";
import icon2c54f65a03c35ac90f5c73b92da39779 from "@/assets/icons/2c54f65a03c35ac90f5c73b92da39779.jpg";
import icon499b1d8f955acd1d3ec30f217eddfa2a from "@/assets/icons/499b1d8f955acd1d3ec30f217eddfa2a.jpg";
import icon4a417d1f8cab870d4e93498ae1ae2d21 from "@/assets/icons/4a417d1f8cab870d4e93498ae1ae2d21.jpg";
import icon521843744a6b97eb7083216a3c2e895b from "@/assets/icons/521843744a6b97eb7083216a3c2e895b.jpg";
import icon5eb95eaf598d1007befaa78d038c2b2f from "@/assets/icons/5eb95eaf598d1007befaa78d038c2b2f.jpg";
import icon66ec3b7a760749c090592af88ad71c7b from "@/assets/icons/66ec3b7a760749c090592af88ad71c7b.jpg";
import icon808c8c39f0e1e76d75deb0de23ada852 from "@/assets/icons/808c8c39f0e1e76d75deb0de23ada852.jpg";
import icon8c0ab3baec0ebc6cfbad22cbe206d0cd from "@/assets/icons/8c0ab3baec0ebc6cfbad22cbe206d0cd.jpg";
import icon91237f1eca767ef74d722ca534f9281a from "@/assets/icons/91237f1eca767ef74d722ca534f9281a.jpg";
import icon9ae8ceaa543d93d321a63d4f6f1b120d from "@/assets/icons/9ae8ceaa543d93d321a63d4f6f1b120d.jpg";
import icon9cc241c59d401c0fd99b1e47c2f90551 from "@/assets/icons/9cc241c59d401c0fd99b1e47c2f90551.jpg";
import icon9db864bb96c5117671f9aed169a85700 from "@/assets/icons/9db864bb96c5117671f9aed169a85700.jpg";
import icon9eb571d4a0f9d11a1e70e7f0e4ee908a from "@/assets/icons/9eb571d4a0f9d11a1e70e7f0e4ee908a.jpg";
import iconA2ed6ed30e28d9c32766ca082a401581 from "@/assets/icons/a2ed6ed30e28d9c32766ca082a401581.jpg";
import iconA95aadde4325065401dc6942ea5dad90 from "@/assets/icons/a95aadde4325065401dc6942ea5dad90.jpg";
import iconC7b8113247fecd83bd9b5ed5bd3f34d5 from "@/assets/icons/c7b8113247fecd83bd9b5ed5bd3f34d5.jpg";
import iconCe96ec1279df6307f5baf27a4d60301b from "@/assets/icons/ce96ec1279df6307f5baf27a4d60301b.jpg";
import iconD96d4ab96b1d89388dd73c1cce67d829 from "@/assets/icons/d96d4ab96b1d89388dd73c1cce67d829.jpg";
import iconDa3c36ab7d12285e143e25c4741d3d3e from "@/assets/icons/da3c36ab7d12285e143e25c4741d3d3e.jpg";
import iconEad0bde8da1920238655504666b62105 from "@/assets/icons/ead0bde8da1920238655504666b62105.jpg";
import iconEd94e3e6fae5dd09cd8f7652f4a01c3d from "@/assets/icons/ed94e3e6fae5dd09cd8f7652f4a01c3d.jpg";
import iconF63a855e59ad35defdbcee7b00edd0b7 from "@/assets/icons/f63a855e59ad35defdbcee7b00edd0b7.jpg";
import iconF9a6129b0d10fd385e85a8cc50e25e15 from "@/assets/icons/f9a6129b0d10fd385e85a8cc50e25e15.jpg";
import iconFc93f63c2e801b1d0824f66c6b7bcad8 from "@/assets/icons/fc93f63c2e801b1d0824f66c6b7bcad8.jpg";
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
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61558554120999";
const WHATSAPP_URL = "https://wa.me/261341434863";
const GITHUB_URL = "https://github.com/Theophile706";
const socialLinks = [
  { Icon: Facebook, href: FACEBOOK_URL },
  { Icon: Instagram, href: "#" },
  { Icon: MessageCircle, href: WHATSAPP_URL },
  { Icon: Github, href: GITHUB_URL },
];
const orbitIcons = [
  icon14779d4968d4999239dc8264fdd026cc,
  icon1b29a538acb3efa07b2289d932b2daa9,
  icon1d963dce52d6527abc02fc4d37337b09,
  icon2c54f65a03c35ac90f5c73b92da39779,
  icon499b1d8f955acd1d3ec30f217eddfa2a,
  icon4a417d1f8cab870d4e93498ae1ae2d21,
  icon521843744a6b97eb7083216a3c2e895b,
  icon5eb95eaf598d1007befaa78d038c2b2f,
  icon66ec3b7a760749c090592af88ad71c7b,
  icon808c8c39f0e1e76d75deb0de23ada852,
  icon8c0ab3baec0ebc6cfbad22cbe206d0cd,
  icon91237f1eca767ef74d722ca534f9281a,
  icon9ae8ceaa543d93d321a63d4f6f1b120d,
  icon9cc241c59d401c0fd99b1e47c2f90551,
  icon9db864bb96c5117671f9aed169a85700,
  icon9eb571d4a0f9d11a1e70e7f0e4ee908a,
  iconA2ed6ed30e28d9c32766ca082a401581,
  iconA95aadde4325065401dc6942ea5dad90,
  iconC7b8113247fecd83bd9b5ed5bd3f34d5,
  iconCe96ec1279df6307f5baf27a4d60301b,
  iconD96d4ab96b1d89388dd73c1cce67d829,
  iconDa3c36ab7d12285e143e25c4741d3d3e,
  iconEad0bde8da1920238655504666b62105,
  iconEd94e3e6fae5dd09cd8f7652f4a01c3d,
  iconF63a855e59ad35defdbcee7b00edd0b7,
  iconF9a6129b0d10fd385e85a8cc50e25e15,
  iconFc93f63c2e801b1d0824f66c6b7bcad8,
];
const WELCOME_TOAST_DURATION_MS = 8000;

function ProfileOrbit({ portraitAlt, photoSrc }: { portraitAlt: string; photoSrc: string | null }) {
  const rings = [0, 1, 2].map((ringIndex) =>
    orbitIcons
      .filter((_, iconIndex) => iconIndex % 3 === ringIndex)
      .map((src, iconIndex, icons) => {
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
        {photoSrc && <img src={photoSrc} alt={portraitAlt} className="h-full w-full scale-110 object-cover" />}
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
  const photoSrc = assetUrl(portfolio.data?.profile.photoUrl) ?? null;
  const projects = portfolio.data?.projects ?? [];
  const skillCategories = portfolio.data ? groupSkills(portfolio.data.skills) : [];
  const experienceEntries = (portfolio.data?.experiences ?? []).map(({ period, company, role, description }) => ({ year: period, company, role, description }));
  const educationEntries = (portfolio.data?.education ?? []).map(({ degree, school, description, period }) => ({ degree, school, description, year: period }));

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
            {photoSrc && <img src={photoSrc} alt="" className="h-11 w-11 rounded-full border object-cover" />}
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
                {project.liveUrl && (
                  <div className="px-6 pb-6">
                    <Button asChild size="sm" variant="outline">
                      <a href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                        <ExternalLink aria-hidden="true" />
                        {copy.projects.viewLiveProject}
                      </a>
                    </Button>
                  </div>
                )}
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
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener">{copy.contact.whatsapp}</a>
              </li>
            </ul>
            <p className="mt-8 font-medium">{copy.contact.follow}</p>
            <div className="mt-3 flex gap-3">
              {socialLinks.map(({ Icon, href }, index) => (
                <a
                  key={copy.socialLabels[index]}
                  href={href}
                  aria-label={copy.socialLabels[index]}
                  target={href.startsWith("https://") ? "_blank" : undefined}
                  rel={href.startsWith("https://") ? "noreferrer noopener" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-brand hover:bg-brand-soft"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
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
              {socialLinks.map(({ Icon, href }, index) => (
                <a
                  key={copy.socialLabels[index]}
                  href={href}
                  aria-label={copy.socialLabels[index]}
                  target={href.startsWith("https://") ? "_blank" : undefined}
                  rel={href.startsWith("https://") ? "noreferrer noopener" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-footer-foreground/20 bg-footer-foreground/5 hover:bg-footer-foreground/15"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
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
