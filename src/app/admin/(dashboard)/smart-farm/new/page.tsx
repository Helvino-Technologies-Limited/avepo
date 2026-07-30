import { SectionForm } from "../section-form";
import { createSmartFarmSection } from "../actions";

export default function NewSectionPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Smart Farm Section</h1>
      <div className="mt-6 max-w-2xl">
        <SectionForm action={createSmartFarmSection} />
      </div>
    </div>
  );
}
