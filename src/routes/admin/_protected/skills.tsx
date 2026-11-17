import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/_protected/skills")({
  head: () => ({ meta: [{ title: "Compétences — Administration" }] }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <ResourceManager
      title="Compétences techniques"
      description="Les compétences sont regroupées par catégorie dans la section Compétences du portfolio."
      endpoint="/api/admin/skills"
      queryKey="skills"
      itemName="la compétence"
      columns={[
        { key: "category", label: "Catégorie" },
        { key: "name", label: "Compétence" },
        { key: "sortOrder", label: "Ordre" },
      ]}
      fields={[
        { name: "category", label: "Catégorie", required: true, maxLength: 100, placeholder: "Frontend" },
        { name: "name", label: "Compétence", required: true, maxLength: 100, placeholder: "React.js" },
        { name: "sortOrder", label: "Ordre d'affichage (0 = en premier)", type: "number" },
      ]}
    />
  );
}
