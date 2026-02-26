"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { INDUSTRIES } from "@/lib/constants";

const schema = z.object({
  org_name: z.string().min(2, "Organization name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
});

type FormData = z.infer<typeof schema>;

export function WorkspaceSetupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_name: data.org_name, industry: data.industry }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create workspace");
      router.push("/onboarding/team");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create workspace";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="org_name">Organization name</Label>
          <Input id="org_name" placeholder="Acme Corp" {...register("org_name")} />
          {errors.org_name && <p className="text-xs text-destructive">{errors.org_name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select onValueChange={(v) => setValue("industry", v)}>
            <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-xs text-destructive">{errors.industry.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </form>
  );
}
