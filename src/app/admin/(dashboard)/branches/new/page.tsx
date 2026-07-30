import { BranchForm } from "../branch-form";
import { createBranch } from "../actions";

export default function NewBranchPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Branch</h1>
      <div className="mt-6 max-w-2xl">
        <BranchForm action={createBranch} />
      </div>
    </div>
  );
}
