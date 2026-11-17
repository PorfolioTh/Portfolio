import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Camera, Code2, GraduationCap, ListChecks, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, assetUrl } from "@/lib/api";

type DashboardData = {
  counts: { experiences: number; projects: number; skills: number; education: number };
  photoUrl: string | null;
};

export const Route = createFileRoute("/admin/_protected/")({
  head: () => ({ meta: [{ title: "Tableau de bord — Administration" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => apiRequest<DashboardData>("/api/admin/dashboard", { auth: true }),
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-brand" aria-label="Chargement" />;
  if (isError || !data) return <p className="text-destructive">Impossible de charger le tableau de bord.</p>;

  const photo = assetUrl(data.photoUrl);

  const modules = [
    { to: "/admin/experiences", title: "Expériences", count: data.counts.experiences, icon: Briefcase },
    { to: "/admin/projects", title: "Projets", count: data.counts.projects, icon: Code2 },
    { to: "/admin/skills", title: "Compétences", count: data.counts.skills, icon: ListChecks },
    { to: "/admin/education", title: "Formations", count: data.counts.education, icon: GraduationCap },
  ] as const;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border bg-muted">
          {photo ? (
            <img src={photo} alt="Photo de profil" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Camera aria-hidden="true" />
            </div>
          )}
        </div>
        <div>
          <h1 className="name-typeface text-4xl font-bold">Bonjour, Théophile</h1>
          <p className="mt-2 text-muted-foreground">Gérez le contenu affiché sur votre portfolio.</p>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {modules.map(({ to, title, count, icon: Icon }) => (
          <Link key={to} to={to} className="group">
            <Card className="card-soft h-full transition hover:-translate-y-1">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <div className="icon-tile">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>Gérer les éléments</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-brand">{count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
