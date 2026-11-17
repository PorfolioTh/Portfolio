import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    onSuccess: () => {
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
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
            <p className="font-medium">{preview ? "Nouvelle photo (aperçu)" : "Photo actuelle"}</p>
            <p className="mt-1 text-sm text-muted-foreground">JPEG, PNG ou WebP, 5 Mo maximum.</p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-8 text-center transition-colors hover:border-brand hover:bg-muted/50">
            <Upload className="h-6 w-6 text-brand" aria-hidden="true" />
            <span className="text-sm font-medium">{file ? file.name : "Choisir une image"}</span>
            <input type="file" accept={ACCEPTED_TYPES.join(",")} onChange={onFileChange} className="sr-only" />
          </label>

          {validationError && <p role="alert" className="text-sm text-destructive">{validationError}</p>}
          {upload.isError && <p role="alert" className="text-sm text-destructive">{upload.error.message}</p>}
          {upload.isSuccess && !file && <p className="text-sm text-brand">Photo de profil mise à jour.</p>}

          <Button disabled={!file || upload.isPending} onClick={() => file && upload.mutate(file)}>
            {upload.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Enregistrer la photo
          </Button>
        </div>
      </div>
    </div>
  );
}
