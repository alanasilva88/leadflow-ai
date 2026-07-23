import { LoaderCircle } from "lucide-react";

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending && <LoaderCircle className="animate-spin" size={17} />}
      {pending ? "Salvando..." : children}
    </button>
  );
}
