import { PartnerForm } from "../partner-form";
import { createPartner } from "../actions";

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Partner</h1>
      <div className="mt-6 max-w-2xl">
        <PartnerForm action={createPartner} />
      </div>
    </div>
  );
}
