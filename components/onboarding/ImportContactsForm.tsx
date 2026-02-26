"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/hooks/use-toast";
import { Upload, CheckCircle, ArrowRight, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Papa from "papaparse";

export function ImportContactsForm() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "text/csv") setFile(selected);
    else toast({ title: "Invalid file", description: "Please upload a CSV file", variant: "destructive" });
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as Record<string, string>[];
        const contacts = rows.slice(0, 1000).map((row) => ({
          organization_id: profile!.organization_id,
          first_name: row.first_name || row.firstName || row["First Name"] || "",
          last_name: row.last_name || row.lastName || row["Last Name"] || "",
          email: row.email || row.Email || null,
          phone: row.phone || row.Phone || null,
          title: row.title || row.Title || null,
          status: "lead" as const,
        })).filter((c) => c.first_name || c.last_name);

        if (contacts.length > 0) {
          const { error } = await supabase.from("contacts").insert(contacts);
          if (error) toast({ title: "Import failed", description: error.message, variant: "destructive" });
          else { toast({ title: "Import successful", description: `${contacts.length} contacts imported` }); setDone(true); }
        }
        setImporting(false);
      },
    });
  };

  const handleFinish = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ onboarding_complete: true }).eq("id", user.id);
    router.push("/dashboard");
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      {!done ? (
        <>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">Drop your CSV file here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
            <p className="text-xs text-muted-foreground mt-2">Supports: first_name, last_name, email, phone, title</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          {file && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <Button size="sm" onClick={handleImport} disabled={importing}>
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Import"}
              </Button>
            </div>
          )}
          <Button variant="ghost" className="w-full" onClick={handleFinish}>Skip for now</Button>
        </>
      ) : (
        <div className="text-center py-6 space-y-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <div>
            <p className="font-semibold text-lg">Import complete!</p>
            <p className="text-sm text-muted-foreground mt-1">Your contacts have been imported successfully.</p>
          </div>
          <Button onClick={handleFinish} className="gap-1.5">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
