import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, Upload } from "lucide-react";
import { apiRequest, assetUrl } from "@/lib/api";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProfileData = { photoUrl: string | null };

export const Route = createFileRoute("/admin/_protected/profile")({
  head: () => ({ meta: [{ title: "Photo de profil — Administration" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const profile = useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => apiRequest<ProfileData>("/api/admin/profile", { auth: true }),
  });

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const upload = useMutation({
    mutationFn: (selected: File) => {
      const formData = new FormData();
      formData.append("photo", selected);
      return apiRequest<ProfileData>("/api/admin/profile/photo", { method: "PUT", formData, auth: true });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
      setFile(null);
    },
  });

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    upload.reset();
    setValidationError(null);
    if (selected && !ACCEPTED_TYPES.includes(selected.type)) {
      setValidationError("Format non supporté (JPEG, PNG ou WebP).");
      setFile(null);
      return;
    }
    if (selected && selected.size > MAX_SIZE_BYTES) {
      setValidationError("L'image dépasse 5 Mo.");
      setFile(null);
      return;
    }
    setFile(selected);
    if (selected) upload.mutate(selected);
    event.target.value = "";
  }

  const currentPhoto = assetUrl(profile.data?.photoUrl);
  const displayed = preview ?? currentPhoto;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="name-typeface text-4xl font-bold">Photo de profil</h1>
        <p className="mt-2 text-muted-foreground">La photo est affichée à côté de votre présentation sur le portfolio.</p>
      </header>

      <div className="card-soft grid gap-10 p-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="mx-auto h-56 w-56 overflow-hidden rounded-full border-4 border-brand-soft bg-muted">
          {profile.isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand" aria-label="Chargement" />
            </div>
          ) : displayed ? (
            <img src={displayed} alt="Aperçu de la photo de profil" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Camera className="h-10 w-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="font-medium">{upload.isPending ? "Enregistrement en cours…" : "Photo actuelle"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              JPEG, PNG ou WebP, 5 Mo maximum. La photo est enregistrée dans la base de données dès que vous la choisissez, puis affichée automatiquement sur le portfolio.
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-8 text-center transition-colors hover:border-brand hover:bg-muted/50">
            <Upload className="h-6 w-6 text-brand" aria-hidden="true" />
            <span className="text-sm font-medium">{profile.data?.photoUrl ? "Changer la photo" : "Choisir une image"}</span>
            <input type="file" accept={ACCEPTED_TYPES.join(",")} onChange={onFileChange} disabled={upload.isPending} className="sr-only" />
          </label>

          {validationError && <p role="alert" className="text-sm text-destructive">{validationError}</p>}
          {upload.isError && <p role="alert" className="text-sm text-destructive">{upload.error.message}</p>}
          {upload.isPending && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Envoi de la photo…
            </p>
          )}
          {upload.isSuccess && <p className="text-sm text-brand">Photo enregistrée et affichée sur le portfolio.</p>}
        </div>
      </div>
    </div>
  );
}
