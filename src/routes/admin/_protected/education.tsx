import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/_protected/education")({
  head: () => ({ meta: [{ title: "Formations — Administration" }] }),
  component: EducationPage,
});

function EducationPage() {
  return (
    <ResourceManager
      title="Études et formations"
      description="Les formations apparaissent dans la section Éducation du portfolio."
      endpoint="/api/admin/education"
      queryKey="education"
      itemName="la formation"
      columns={[
        { key: "period", label: "Année" },
        { key: "degree", label: "Diplôme" },
        { key: "school", label: "Établissement" },
        { key: "sortOrder", label: "Ordre" },
      ]}
      fields={[
        { name: "degree", label: "Diplôme", required: true, maxLength: 200 },
        { name: "school", label: "Établissement", required: true, maxLength: 200 },
        { name: "period", label: "Année", required: true, maxLength: 50, placeholder: "2025" },
        { name: "description", label: "Description", type: "textarea", required: true, maxLength: 2000 },
        { name: "sortOrder", label: "Ordre d'affichage (0 = en premier)", type: "number" },
      ]}
    />
  );
}
