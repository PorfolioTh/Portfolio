import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Code2, Loader2, Pencil, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, assetUrl } from "@/lib/api";
import { fetchProjectImages, type Project } from "@/lib/portfolio-api";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type DetailField = { label: string; value: string };

type FormState = {
  title: string;
  description: string;
  objectives: string;
  stack: string;
  features: string;
  details: DetailField[];
  githubUrl: string;
  sortOrder: string;
};

type ProjectPayload = {
  title: string;
  description: string;
  objectives: string;
  stack: string[];
  features: string[];
  details: DetailField[];
  githubUrl: string;
  sortOrder: number;
};

function toFormState(project: Project | null): FormState {
  return {
    title: project?.title ?? "",
    description: project?.description ?? "",
    objectives: project?.objectives ?? "",
    stack: project?.stack.join("\n") ?? "",
    features: project?.features.join("\n") ?? "",
    details: project?.details ?? [],
    githubUrl: project?.githubUrl ?? "",
    sortOrder: String(project?.sortOrder ?? 0),
  };
}

function splitLines(text: string) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

function toPayload(form: FormState): ProjectPayload {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    objectives: form.objectives.trim(),
    stack: splitLines(form.stack),
    features: splitLines(form.features),
    details: form.details
      .map(({ label, value }) => ({ label: label.trim(), value: value.trim() }))
      .filter(({ label, value }) => label && value),
    githubUrl: form.githubUrl.trim(),
    sortOrder: Number(form.sortOrder),
  };
}

function FormField({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ProjectManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(toFormState(null));
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const list = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => apiRequest<Project[]>("/api/admin/projects", { auth: true }),
  });

  const editingId = editing?.id;
  const images = useQuery({
    queryKey: ["admin", "project-images", editingId],
    queryFn: () => fetchProjectImages(editingId as number),
    enabled: dialogOpen && editingId !== undefined,
  });
  const currentCover = list.data?.find((project) => project.id === editingId)?.imageUrl ?? editing?.imageUrl ?? null;

  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles]);

  function invalidateProjects() {
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "project-images"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio"] });
  }

  const save = useMutation({
    mutationFn: async (payload: ProjectPayload) => {
      const project = editing
        ? await apiRequest<Project>(`/api/admin/projects/${editing.id}`, { method: "PUT", body: payload, auth: true })
        : await apiRequest<Project>("/api/admin/projects", { method: "POST", body: payload, auth: true });
      // Once saved, a retry must update this project rather than create a duplicate if the image upload fails.
      setEditing(project);
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        await apiRequest(`/api/admin/projects/${project.id}/images`, { method: "POST", formData, auth: true });
        setImageFiles([]);
      }
      return project;
    },
    onSuccess: () => setDialogOpen(false),
    onSettled: invalidateProjects,
  });

  const removeImage = useMutation({
    mutationFn: (imageId: string) =>
      apiRequest<void>(`/api/admin/projects/${editingId}/images/${imageId}`, { method: "DELETE", auth: true }),
    onSettled: invalidateProjects,
  });

  const setCover = useMutation({
    mutationFn: (imageId: string) =>
      apiRequest<Project>(`/api/admin/projects/${editingId}/cover/${imageId}`, { method: "PUT", auth: true }),
    onSettled: invalidateProjects,
  });

  const remove = useMutation({
    mutationFn: (project: Project) => apiRequest<void>(`/api/admin/projects/${project.id}`, { method: "DELETE", auth: true }),
    onSuccess: () => setToDelete(null),
    onSettled: invalidateProjects,
  });

  function openCreate() {
    setEditing(null);
    setForm(toFormState(null));
    setImageFiles([]);
    setImageError(null);
    save.reset();
    removeImage.reset();
    setCover.reset();
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm(toFormState(project));
    setImageFiles([]);
    setImageError(null);
    save.reset();
    removeImage.reset();
    setCover.reset();
    setDialogOpen(true);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateDetail(index: number, key: keyof DetailField, value: string) {
    updateField(
      "details",
      form.details.map((detail, detailIndex) => (detailIndex === index ? { ...detail, [key]: value } : detail)),
    );
  }

  function removeDetail(index: number) {
    updateField("details", form.details.filter((_, detailIndex) => detailIndex !== index));
  }

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    const rejected: string[] = [];
    const valid = selected.filter((file) => {
      const ok = ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_BYTES;
      if (!ok) rejected.push(file.name);
      return ok;
    });
    setImageError(
      rejected.length > 0 ? `Image(s) ignorée(s) (JPEG, PNG ou WebP, 5 Mo maximum) : ${rejected.join(", ")}` : null,
    );
    if (valid.length > 0) setImageFiles((current) => [...current, ...valid]);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save.mutate(toPayload(form));
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="name-typeface text-4xl font-bold">Projets</h1>
          <p className="mt-2 text-muted-foreground">Chaque projet apparaît dans la section Projets et possède sa propre page de détail.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" />
          Ajouter
        </Button>
      </header>

      <div className="card-soft overflow-x-auto">
        {list.isLoading && (
          <div className="flex justify-center p-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand" aria-label="Chargement" />
          </div>
        )}
        {list.isError && <p className="p-6 text-destructive">Impossible de charger les données.</p>}
        {list.data && list.data.length === 0 && (
          <p className="p-6 text-center text-muted-foreground">Aucun projet pour le moment.</p>
        )}
        {list.data && list.data.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Image</th>
                <th className="px-5 py-3 font-medium">Titre</th>
                <th className="px-5 py-3 font-medium">Technologies</th>
                <th className="px-5 py-3 font-medium">Ordre</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((project) => {
                const imageSrc = assetUrl(project.imageUrl);
                return (
                  <tr key={project.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3">
                      {imageSrc ? (
                        <img src={imageSrc} alt="" className="h-12 w-20 rounded object-cover" />
                      ) : (
                        <div className="flex h-12 w-20 items-center justify-center rounded bg-muted text-muted-foreground">
                          <Code2 className="h-4 w-4" aria-hidden="true" />
                        </div>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-5 py-3 font-medium">{project.title}</td>
                    <td className="max-w-xs truncate px-5 py-3">{project.stack.join(", ")}</td>
                    <td className="px-5 py-3">{project.sortOrder}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEdit(project)} aria-label={`Modifier le projet ${project.title}`}>
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setToDelete(project)} aria-label={`Supprimer le projet ${project.title}`}>
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le projet" : "Ajouter un projet"}</DialogTitle>
            <DialogDescription>Les modifications sont enregistrées dans la base de données.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField id="project-title" label="Titre">
              <Input id="project-title" required maxLength={150} value={form.title} onChange={(event) => updateField("title", event.target.value)} />
            </FormField>

            <FormField id="project-description" label="Description">
              <Textarea id="project-description" required rows={4} maxLength={5000} value={form.description} onChange={(event) => updateField("description", event.target.value)} />
            </FormField>

            <FormField id="project-objectives" label="Objectifs">
              <Textarea id="project-objectives" rows={3} maxLength={3000} value={form.objectives} onChange={(event) => updateField("objectives", event.target.value)} />
            </FormField>

            <FormField id="project-stack" label="Technologies et stack" hint="Une technologie par ligne.">
              <Textarea id="project-stack" rows={4} value={form.stack} onChange={(event) => updateField("stack", event.target.value)} />
            </FormField>

            <FormField id="project-features" label="Fonctionnalités principales" hint="Une fonctionnalité par ligne.">
              <Textarea id="project-features" rows={4} value={form.features} onChange={(event) => updateField("features", event.target.value)} />
            </FormField>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Label>Informations supplémentaires</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => updateField("details", [...form.details, { label: "", value: "" }])}>
                  <Plus aria-hidden="true" />
                  Ajouter une ligne
                </Button>
              </div>
              {form.details.length === 0 && <p className="text-sm text-muted-foreground">Aucune information ajoutée.</p>}
              {form.details.map((detail, index) => (
                <div key={index} className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
                  <Input
                    aria-label={`Libellé ${index + 1}`}
                    placeholder="Client, durée, rôle…"
                    maxLength={100}
                    value={detail.label}
                    onChange={(event) => updateDetail(index, "label", event.target.value)}
                  />
                  <Input
                    aria-label={`Valeur ${index + 1}`}
                    maxLength={500}
                    value={detail.value}
                    onChange={(event) => updateDetail(index, "value", event.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeDetail(index)} aria-label={`Supprimer la ligne ${index + 1}`}>
                    <X aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            <FormField id="project-github" label="Lien GitHub" hint="Optionnel. Adresse du dépôt, par exemple https://github.com/utilisateur/depot.">
              <Input id="project-github" type="url" maxLength={255} placeholder="https://github.com/…" value={form.githubUrl} onChange={(event) => updateField("githubUrl", event.target.value)} />
            </FormField>

            <FormField id="project-order" label="Ordre d'affichage (0 = en premier)">
              <Input id="project-order" type="number" min={0} max={9999} value={form.sortOrder} onChange={(event) => updateField("sortOrder", event.target.value)} />
            </FormField>

            <div className="space-y-3">
              <Label htmlFor="project-image">Images du projet</Label>

              {editingId !== undefined && images.isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-brand" aria-label="Chargement des images" />
              )}
              {images.data && images.data.length > 0 && (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.data.map((image) => {
                    const isCover = assetUrl(currentCover) === assetUrl(image.url);
                    return (
                      <li key={image.id} className="space-y-2">
                        <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                          <img src={assetUrl(image.url) ?? ""} alt="" className="h-full w-full object-cover" />
                          {isCover && (
                            <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-xs font-medium text-white">Couverture</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            disabled={isCover || setCover.isPending}
                            onClick={() => setCover.mutate(image.id)}
                          >
                            <Star aria-hidden="true" />
                            Couverture
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={removeImage.isPending}
                            onClick={() => removeImage.mutate(image.id)}
                            aria-label="Supprimer cette image"
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {images.data && images.data.length === 0 && imageFiles.length === 0 && (
                <div className="flex h-16 items-center justify-center gap-2 rounded-md border bg-muted text-sm text-muted-foreground">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  Aucune image enregistrée.
                </div>
              )}

              {imageFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">À envoyer à l'enregistrement ({imageFiles.length})</p>
                  <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {imageFiles.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                        {imagePreviews[index] && <img src={imagePreviews[index]} alt={file.name} className="h-full w-full object-cover" />}
                        <button
                          type="button"
                          onClick={() => setImageFiles((current) => current.filter((_, i) => i !== index))}
                          className="absolute right-1 top-1 rounded-full bg-background/90 p-1 hover:bg-background"
                          aria-label={`Retirer ${file.name}`}
                        >
                          <X className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-border px-4 py-3 text-sm font-medium transition-colors hover:border-brand hover:bg-muted/50">
                <Upload className="h-4 w-4 text-brand" aria-hidden="true" />
                <span>Ajouter des images</span>
                <input id="project-image" type="file" multiple accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={onImageChange} className="sr-only" />
              </label>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG ou WebP, 5 Mo maximum par image, sans limite de nombre. Les nouvelles images sont envoyées à l'enregistrement ; la première devient la couverture si le projet n'en a pas.
              </p>
              {imageError && <p role="alert" className="text-sm text-destructive">{imageError}</p>}
              {(removeImage.isError || setCover.isError) && (
                <p role="alert" className="text-sm text-destructive">
                  {removeImage.error?.message ?? setCover.error?.message}
                </p>
              )}
            </div>

            {save.isError && <p role="alert" className="text-sm text-destructive">{save.error.message}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le projet ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est définitive. L'image associée sera également supprimée.</AlertDialogDescription>
          </AlertDialogHeader>
          {remove.isError && <p role="alert" className="text-sm text-destructive">{remove.error.message}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                if (toDelete) remove.mutate(toDelete);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
