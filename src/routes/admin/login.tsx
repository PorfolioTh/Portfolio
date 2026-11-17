import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, ApiError, setToken } from "@/lib/api";

type LoginResponse = { token: string };

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Connexion — Administration" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(result.token);
      navigate({ to: "/admin" });
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 401
          ? caught.message
          : "Impossible de joindre le serveur. Vérifiez que le backend est démarré.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4 py-12">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-soft blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-soft blur-3xl" aria-hidden="true" />

      <div className="card-soft relative w-full max-w-md p-8 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <LockKeyhole className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="name-typeface mt-6 text-center text-3xl font-bold">Espace administration</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Connectez-vous pour gérer le contenu de votre portfolio.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Adresse e-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 pl-9"
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Mot de passe</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 pl-9 pr-11"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </main>
  );
}
