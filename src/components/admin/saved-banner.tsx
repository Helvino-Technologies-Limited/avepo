export function SavedBanner({ show, label = "Saved successfully." }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
      ✓ {label}
    </div>
  );
}
