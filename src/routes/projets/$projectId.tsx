import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Code2, Github, Loader2 } from "lucide-react";
import { assetUrl } from "@/lib/api";
import { fetchProject, type Project } from "@/lib/portfolio-api";
import { portfolioCopy, type Locale, type PortfolioCopy } from "@/lib/portfolio-copy";

export const Route = createFileRoute("/projets/$projectId")({
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId } = Route.useParams();
  const [locale, setLocale] = useState<Locale>("fr");
  const project = useQuery({
    queryKey: ["portfolio", "project", projectId],
    queryFn: () => fetchProject(Number(projectId)),
    retry: false,
  });
  const copy = portfolioCopy[locale];

  useEffect(() => {
    let savedLocale: string | null = null;
    let savedTheme: string | null = null;
    try {
      savedLocale = window.localStorage.getItem("portfolio-language");
      savedTheme = window.localStorage.getItem("theme");
    } catch {
      // Storage may be disabled; defaults apply.
    }
    if (savedLocale === "fr" || savedLocale === "en") setLocale(savedLocale);
    const isDark = savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    if (project.data) document.title = `${project.data.title} — ${portfolioCopy[locale].metadata.title}`;
  }, [locale, project.data]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center px-6 py-4">
          <Link to="/" hash="projets" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {copy.projectPage.backToProjects}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24">
        {project.isLoading && (
          <div className="flex justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Chargement" />
          </div>
        )}
        {project.isError && <ProjectNotFound copy={copy} />}
        {project.data && <ProjectContent project={project.data} labels={copy.projectPage} />}
      </main>
    </div>
  );
}

function ProjectNotFound({ copy }: { copy: PortfolioCopy }) {
  return (
    <div className="py-32 text-center">
      <h1 className="text-3xl font-bold">{copy.fallback.notFoundTitle}</h1>
      <p className="mt-3 text-muted-foreground">{copy.fallback.notFoundDescription}</p>
      <Link to="/" className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
        {copy.fallback.goHome}
      </Link>
    </div>
  );
}

function ProjectContent({ project, labels }: { project: Project; labels: PortfolioCopy["projectPage"] }) {
  const imageSrc = assetUrl(project.imageUrl);

  return (
    <article className="space-y-12 pt-8">
      {imageSrc ? (
        <img src={imageSrc} alt={project.title} className="aspect-video w-full rounded-2xl object-cover" />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl bg-muted text-muted-foreground">
          <Code2 className="h-10 w-10 text-brand" aria-hidden="true" />
          <span className="text-sm">{labels.noImage}</span>
        </div>
      )}

      <div className="space-y-6">
        <h1 className="name-typeface text-4xl font-bold md:text-5xl">{project.title}</h1>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-foreground px-5 py-2.5 font-medium hover:bg-muted"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
            {labels.viewRepository}
          </a>
        )}
      </div>

      <Section title={labels.description}>
        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{project.description}</p>
      </Section>

      {project.objectives && (
        <Section title={labels.objectives}>
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{project.objectives}</p>
        </Section>
      )}

      {project.stack.length > 0 && (
        <Section title={labels.stack}>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item, index) => <span key={`${index}-${item}`} className="chip font-medium">{item}</span>)}
          </div>
        </Section>
      )}

      {project.features.length > 0 && (
        <Section title={labels.features}>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            {project.features.map((feature, index) => <li key={`${index}-${feature}`}>{feature}</li>)}
          </ul>
        </Section>
      )}

      {project.details.length > 0 && (
        <Section title={labels.details}>
          <dl className="card-soft grid gap-6 p-7 sm:grid-cols-2">
            {project.details.map(({ label, value }, index) => (
              <div key={`${index}-${label}`}>
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-medium">{title}</h2>
      {children}
    </section>
  );
}
