"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = "Add tag..." }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
    else if (e.key === "Backspace" && !input && tags.length > 0) removeTag(tags[tags.length - 1]);
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-input rounded-md bg-transparent min-h-[2.25rem]">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 h-5 text-xs">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="border-0 p-0 h-5 text-xs bg-transparent focus-visible:ring-0 w-24 flex-1"
      />
    </div>
  );
}
