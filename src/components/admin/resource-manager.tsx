import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { apiRequest } from "@/lib/api";

type Row = { id: number } & Record<string, unknown>;

export type ResourceField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number";
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
};

export type ResourceColumn = { key: string; label: string };

type ResourceManagerProps = {
  title: string;
  description: string;
  endpoint: string;
  queryKey: string;
  itemName: string;
  columns: ResourceColumn[];
  fields: ResourceField[];
};

function toFormValues(fields: ResourceField[], row?: Row) {
  return Object.fromEntries(
    fields.map((field) => [field.name, row ? String(row[field.name] ?? "") : field.type === "number" ? "0" : ""]),
  );
}

export function ResourceManager({ title, description, endpoint, queryKey, itemName, columns, fields }: ResourceManagerProps) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Row | null>(null);

  const list = useQuery({
    queryKey: ["admin", queryKey],
    queryFn: () => apiRequest<Row[]>(endpoint, { auth: true }),
  });

  const save = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editing
        ? apiRequest<Row>(`${endpoint}/${editing.id}`, { method: "PUT", body: payload, auth: true })
        : apiRequest<Row>(endpoint, { method: "POST", body: payload, auth: true }),
    onSuccess: () => {
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", queryKey] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  const remove = useMutation({
    mutationFn: (row: Row) => apiRequest<void>(`${endpoint}/${row.id}`, { method: "DELETE", auth: true }),
    onSuccess: () => {
      setToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin", queryKey] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  function openCreate() {
    setEditing(null);
    setValues(toFormValues(fields));
    save.reset();
    setDialogOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setValues(toFormValues(fields, row));
    save.reset();
    setDialogOpen(true);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(
      fields.map((field) => [field.name, field.type === "number" ? Number(values[field.name]) : values[field.name]?.trim()]),
    );
    save.mutate(payload);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="name-typeface text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
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
          <p className="p-6 text-center text-muted-foreground">Aucun élément pour le moment.</p>
        )}
        {list.data && list.data.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-5 py-3 font-medium">{column.label}</th>
                ))}
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((row) => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50">
                  {columns.map((column) => (
                    <td key={column.key} className="max-w-xs truncate px-5 py-3">{String(row[column.key] ?? "")}</td>
                  ))}
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(row)} aria-label={`Modifier ${itemName}`}>
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setToDelete(row)} aria-label={`Supprimer ${itemName}`}>
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Modifier ${itemName}` : `Ajouter ${itemName}`}</DialogTitle>
            <DialogDescription>Les modifications sont enregistrées dans la base de données.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={`field-${field.name}`}
                    required={field.required}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    rows={4}
                    value={values[field.name] ?? ""}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  />
                ) : (
                  <Input
                    id={`field-${field.name}`}
                    type={field.type === "number" ? "number" : "text"}
                    min={field.type === "number" ? 0 : undefined}
                    max={field.type === "number" ? 9999 : undefined}
                    required={field.required}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  />
                )}
              </div>
            ))}
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
            <AlertDialogTitle>Supprimer {itemName} ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est définitive.</AlertDialogDescription>
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
