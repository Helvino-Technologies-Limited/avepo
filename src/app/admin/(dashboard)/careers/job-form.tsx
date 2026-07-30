import { Field, TextInput, TextArea, Select, Checkbox, SubmitButton } from "@/components/admin/ui";
import type { JobPosting } from "@prisma/client";

function toDateInputValue(date?: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function JobForm({
  action,
  job,
}: {
  action: (formData: FormData) => Promise<void>;
  job?: JobPosting;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={job?.title} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="type">
          <Select id="type" name="type" defaultValue={job?.type ?? "JOB"}>
            <option value="JOB">Job</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="ATTACHMENT">Attachment</option>
          </Select>
        </Field>
        <Field label="Location" htmlFor="location">
          <TextInput id="location" name="location" defaultValue={job?.location ?? ""} />
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={job?.description ?? ""} />
      </Field>

      <Field label="Application Deadline" htmlFor="deadline">
        <TextInput
          id="deadline"
          name="deadline"
          type="date"
          defaultValue={toDateInputValue(job?.deadline)}
        />
      </Field>

      <Checkbox name="isActive" label="Active (visible on site)" defaultChecked={job?.isActive ?? true} />

      <SubmitButton>{job ? "Save Changes" : "Create Job Posting"}</SubmitButton>
    </form>
  );
}
