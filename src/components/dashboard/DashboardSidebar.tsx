import { LayoutGrid, School2, Wallet, MessageSquare, User, Settings, Trophy, Calendar, Briefcase } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const mainMenuItems = [
  {
    title: "Browse",
    icon: LayoutGrid,
    href: "/dashboard/browse"
  }, 
  {
    title: "Campus Hub",
    icon: School2,
    href: "/dashboard/campus"
  },
  {
    title: "My Work",
    icon: Briefcase,
    href: "/dashboard/mywork"
  },
  {
    title: "Wallet",
    icon: Wallet,
    href: "/dashboard/wallet"
  }, 
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/dashboard/messages"
  },
  // Profile as a single item
  {
    title: "Profile",
    icon: User,
    href: "/dashboard/profile"
  }
];

const DashboardSidebar = () => {
  const location = useLocation();
  
  return (
    <Sidebar className="">
      <SidebarContent className="px-0 py-[33px]">
        <div className="px-4 py- text-emerald-600 font-bold text-2xl">
          Earn-n-Learn
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;