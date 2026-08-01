"use client";

import { Button } from "@/components/ui/Button";
import { getBySlug } from "@/data/products";
import type { Lead } from "@/types";

export interface ExportCsvProps {
  leads: Lead[];
}

const COLUMNS: { key: keyof Lead; label: string }[] = [
  { key: "created_at", label: "Date" },
  { key: "reference", label: "Reference" },
  { key: "full_name", label: "Full name" },
  { key: "company_name", label: "Company" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "country", label: "Country" },
  { key: "products", label: "Products" },
  { key: "volume", label: "Volume" },
  { key: "destination_port", label: "Destination port" },
  { key: "message", label: "Message" },
  { key: "source_section", label: "Source" },
  { key: "status", label: "Status" },
  { key: "internal_notes", label: "Internal notes" },
];

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value)
    ? value.map((slug) => getBySlug(slug)?.name ?? slug).join("; ")
    : String(value);
  // Always quote, and escape internal quotes by doubling them — handles
  // commas, quotes and newlines in free-text fields like `message`.
  return `"${text.replace(/"/g, '""')}"`;
}

export function ExportCsv({ leads }: ExportCsvProps) {
  const onExport = () => {
    const header = COLUMNS.map((column) => csvCell(column.label)).join(",");
    const rows = leads.map((lead) => COLUMNS.map((column) => csvCell(lead[column.key])).join(","));
    const csv = [header, ...rows].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `westora-leads-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button type="button" variant="secondary" onClick={onExport} disabled={leads.length === 0}>
      Export CSV
    </Button>
  );
}
