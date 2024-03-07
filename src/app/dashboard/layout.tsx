import SidebarNav from "@/components/SidebarNav";
import { Card } from "@/components/ui/card";

const sidebarNavItems = [
  {
    title: "Trips",
    href: "/dashboard",
  },
  {
    title: "Default Locations",
    href: "/dashboard/default-locations",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Card className="mx-20 flex">
        <SidebarNav items={sidebarNavItems} />
        <div className="flex-grow">{children}</div>
      </Card>
    </>
  );
}
