import { CompteChrome } from "@/components/compte-chrome";

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return <CompteChrome>{children}</CompteChrome>;
}
