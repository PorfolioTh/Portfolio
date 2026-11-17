import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/_protected/experiences")({
  head: () => ({ meta: [{ title: "Expériences — Administration" }] }),
  component: ExperiencesPage,
});

function ExperiencesPage() {
  return (
    <ResourceManager
      title="Expériences professionnelles"
      description="Les expériences apparaissent dans la section Expériences du portfolio."
      endpoint="/api/admin/experiences"
      queryKey="experiences"
      itemName="l'expérience"
      columns={[
        { key: "period", label: "Période" },
        { key: "company", label: "Entreprise" },
        { key: "role", label: "Poste / projet" },
        { key: "sortOrder", label: "Ordre" },
      ]}
      fields={[
        { name: "company", label: "Entreprise", required: true, maxLength: 150 },
        { name: "role", label: "Poste / projet", required: true, maxLength: 150 },
        { name: "period", label: "Période", required: true, maxLength: 50, placeholder: "2025 ou 2023 - 2024" },
        { name: "description", label: "Description", type: "textarea", required: true, maxLength: 2000 },
        { name: "sortOrder", label: "Ordre d'affichage (0 = en premier)", type: "number" },
      ]}
    />
  );
}
