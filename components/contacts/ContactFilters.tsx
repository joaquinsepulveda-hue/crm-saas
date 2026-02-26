"use client";

import { SearchInput } from "@/components/shared/SearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTACT_STATUSES } from "@/lib/constants";
import { useT } from "@/lib/i18n/client";

interface ContactFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}

export function ContactFilters({ search, onSearchChange, status, onStatusChange }: ContactFiltersProps) {
  const t = useT();
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SearchInput value={search} onChange={onSearchChange} placeholder={t.contacts.searchPlaceholder} className="flex-1" />
      <Select value={status || "all"} onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t.contacts.table.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          {CONTACT_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
