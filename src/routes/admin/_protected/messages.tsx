import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";

type ContactMessage = {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
  repliedAt: string | null;
};

export const Route = createFileRoute("/admin/_protected/messages")({
  head: () => ({ meta: [{ title: "Messages — Administration" }] }),
  component: MessagesPage,
});

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

function formatDate(value: string) {
  return dateFormat.format(new Date(value));
}

function MessagesPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ContactMessage | null>(null);

  const messages = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => apiRequest<ContactMessage[]>("/api/admin/messages", { auth: true }),
  });

  const respond = useMutation({
    mutationFn: (message: ContactMessage) =>
      apiRequest<{ ok: boolean }>(`/api/admin/messages/${message.id}/reply`, {
        method: "POST",
        body: { body: reply },
        auth: true,
      }),
    onSuccess: () => {
      setSelected(null);
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });

  const remove = useMutation({
    mutationFn: (message: ContactMessage) =>
      apiRequest<{ ok: boolean }>(`/api/admin/messages/${message.id}`, { method: "DELETE", auth: true }),
    onSuccess: (_result, message) => {
      if (selected?.id === message.id) closeMessage();
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });

  function confirmDelete() {
    if (pendingDelete) remove.mutate(pendingDelete);
    setPendingDelete(null);
  }

  function openMessage(message: ContactMessage) {
    setSelected(message);
    setReply("");
    respond.reset();
  }

  function closeMessage() {
    setSelected(null);
    setReply("");
    respond.reset();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected) respond.mutate(selected);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="name-typeface text-4xl font-bold">Messages</h1>
        <p className="mt-2 text-muted-foreground">Les messages envoyés depuis le formulaire de contact du portfolio.</p>
      </header>

      <div className="card-soft overflow-x-auto">
        {messages.isLoading && (
          <div className="flex justify-center p-10">
            <Loader2 className="h-6 w-6 animate-spin text-brand" aria-label="Chargement" />
          </div>
        )}
        {messages.isError && <p className="p-6 text-destructive">Impossible de charger les messages.</p>}
        {messages.data && messages.data.length === 0 && (
          <p className="p-6 text-center text-muted-foreground">Aucun message pour le moment.</p>
        )}
        {messages.data && messages.data.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">E-mail</th>
                <th className="px-5 py-3 font-medium">Sujet</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.data.map((message) => (
                <tr key={message.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="whitespace-nowrap px-5 py-3">{formatDate(message.createdAt)}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      className="text-left font-medium text-brand hover:underline"
                      onClick={() => openMessage(message)}
                    >
                      {message.name}
                    </button>
                  </td>
                  <td className="px-5 py-3">{message.email}</td>
                  <td className="max-w-xs truncate px-5 py-3">{message.subject || "Non renseigné"}</td>
                  <td className="px-5 py-3">
                    <Badge variant={message.repliedAt ? "secondary" : "default"}>
                      {message.repliedAt ? "Répondu" : "À traiter"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Supprimer le message de ${message.name}`}
                      disabled={remove.isPending}
                      onClick={() => setPendingDelete(message)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le message de {pendingDelete?.name} sera supprimé définitivement. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && closeMessage()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject || "Message sans sujet"}</DialogTitle>
                <DialogDescription>
                  De {selected.name} &lt;{selected.email}&gt; · {formatDate(selected.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                {selected.phone && <p>Téléphone : {selected.phone}</p>}
                <p className="whitespace-pre-wrap rounded-md bg-muted p-4">{selected.message}</p>
                {selected.repliedAt && (
                  <p className="text-muted-foreground">Réponse envoyée le {formatDate(selected.repliedAt)}</p>
                )}
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message-reply">Votre réponse</Label>
                  <Textarea
                    id="message-reply"
                    rows={6}
                    required
                    maxLength={5000}
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                  />
                </div>
                {respond.isError && <p role="alert" className="text-sm text-destructive">{respond.error.message}</p>}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeMessage}>Fermer</Button>
                  <Button type="submit" disabled={respond.isPending || reply.trim().length === 0}>
                    {respond.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
                    Envoyer la réponse
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
