import { ServiceForm } from "../service-form";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Service</h1>
      <div className="mt-6 max-w-2xl">
        <ServiceForm action={createService} />
      </div>
    </div>
  );
}
