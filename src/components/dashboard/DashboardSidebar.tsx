import { LayoutGrid, School2, Wallet, MessageSquare, User, Settings, Trophy, Calendar } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
const mainMenuItems = [{
  title: "Browse",
  icon: LayoutGrid,
  href: "/dashboard/browse"
}, {
  title: "Campus Hub",
  icon: School2,
  href: "/dashboard/campus"
}, {
  title: "Wallet",
  icon: Wallet,
  href: "/dashboard/wallet"
}, {
  title: "Messages",
  icon: MessageSquare,
  href: "/dashboard/messages"
}];
const profileMenuItems = [{
  title: "View Profile",
  icon: User,
  href: "/dashboard/profile"
}, {
  title: "Settings",
  icon: Settings,
  href: "/dashboard/settings"
}, {
  title: "Leaderboard",
  icon: Trophy,
  href: "/dashboard/leaderboard"
}, {
  title: "Calendar",
  icon: Calendar,
  href: "/dashboard/calendar"
}];
const DashboardSidebar = () => {
  const location = useLocation();
  return <Sidebar className="border-r">
      <SidebarContent>
        <div className="px-2 py-4">
          
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User />
                  <span>John Doe</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                {profileMenuItems.map(item => <DropdownMenuItem key={item.title} asChild>
                    <Link to={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
};
export default DashboardSidebar;