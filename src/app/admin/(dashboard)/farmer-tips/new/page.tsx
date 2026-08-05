import { TipForm } from "../tip-form";
import { createFarmerTip } from "../actions";

export default function NewFarmerTipPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Farmer Tip</h1>
      <div className="mt-6 max-w-2xl">
        <TipForm action={createFarmerTip} />
      </div>
    </div>
  );
}
