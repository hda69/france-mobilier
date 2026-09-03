import { IconTick } from "@/components/icons";

export function ProductBenefits({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-navy">
          <IconTick className="mt-0.5 h-4 w-4 text-navy" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
