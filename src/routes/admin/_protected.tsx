import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { GraduationCap, LayoutDashboard, Loader2, LogOut, Briefcase, Camera, Code2, ListChecks, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiError, clearToken, getToken } from "@/lib/api";

export const Route = createFileRoute("/admin/_protected")({
  component: ProtectedLayout,
});

const navItems = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/experiences", label: "Expériences", icon: Briefcase, exact: false },
  { to: "/admin/projects", label: "Projets", icon: Code2, exact: false },
  { to: "/admin/skills", label: "Compétences", icon: ListChecks, exact: false },
  { to: "/admin/education", label: "Formations", icon: GraduationCap, exact: false },
  { to: "/admin/messages", label: "Messages", icon: Mail, exact: false },
  { to: "/admin/profile", label: "Photo de profil", icon: Camera, exact: false },
] as const;

function ProtectedLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate({ to: "/admin/login", replace: true });
      return;
    }

    apiRequest("/api/auth/me", { auth: true })
      .then(() => setReady(true))
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) clearToken();
        navigate({ to: "/admin/login", replace: true });
      });
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Chargement" />
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-surface md:flex">
      <aside className="relative border-b bg-background md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-4 px-6 py-5 md:block">
          <div>
            <p className="name-typeface text-xl font-bold">Administration</p>
            <p className="text-xs text-muted-foreground">Portfolio de Théophile</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0" aria-label="Navigation administration">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "bg-brand-soft text-brand" }}
              className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-2 px-3 pb-5 pt-2 md:absolute md:bottom-0 md:left-0 md:w-64 md:flex-col">
          <Button asChild variant="ghost" className="justify-start">
            <a href="/">
              <ExternalLink aria-hidden="true" />
              Voir le site
            </a>
          </Button>
          <Button variant="ghost" className="justify-start" onClick={logout}>
            <LogOut aria-hidden="true" />
            Déconnexion
          </Button>
        </div>
      </aside>
      <main className="flex-1 px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
