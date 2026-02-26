import { ImportContactsForm } from "@/components/onboarding/ImportContactsForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Import Contacts" };

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Import your contacts</h1>
        <p className="text-muted-foreground mt-2">Import from CSV or start fresh</p>
      </div>
      <ImportContactsForm />
    </div>
  );
}
