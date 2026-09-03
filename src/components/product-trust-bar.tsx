import { IconLock, IconReturn, IconTruck } from "@/components/icons";

const items = [
  {
    title: "Livraison offerte",
    text: "France métropolitaine et destinations éligibles.",
    icon: IconTruck,
  },
  {
    title: "Paiement sécurisé",
    text: "Carte bancaire, Apple Pay et Google Pay.",
    icon: IconLock,
  },
  {
    title: "Retours sous 14 jours",
    text: "À compter de la réception.",
    icon: IconReturn,
  },
];

export function ProductTrustBar() {
  return (
    <ul className="grid gap-3 border-t border-border pt-5">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3">
          <item.icon className="mt-0.5 h-5 w-5 text-navy" />
          <div>
            <p className="text-sm font-medium text-navy">{item.title}</p>
            <p className="text-sm text-muted">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
