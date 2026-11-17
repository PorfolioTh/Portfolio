import { createFileRoute } from "@tanstack/react-router";
import { ProjectManager } from "@/components/admin/project-manager";

export const Route = createFileRoute("/admin/_protected/projects")({
  head: () => ({ meta: [{ title: "Projets — Administration" }] }),
  component: ProjectManager,
});
