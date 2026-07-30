import { JobForm } from "../job-form";
import { createJob } from "../actions";

export default function NewJobPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add Job Posting</h1>
      <div className="mt-6 max-w-2xl">
        <JobForm action={createJob} />
      </div>
    </div>
  );
}
