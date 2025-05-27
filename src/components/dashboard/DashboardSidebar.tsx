import { LayoutGrid, School2, Wallet, MessageSquare, User, Settings, Trophy, Calendar, Briefcase } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  {
    title: "Profile",
    icon: User,
    href: "/dashboard/profile"
  }
];

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
  return <Sidebar className="border-r rounded-none mx-0 px-0 py-0 w-[230px] bg-white shadow-lg">
      <SidebarContent className="px-0 py-[33px]">
      <div className="px-4 py- text-emerald-600 font-bold text-2xl">
      Earn-n-Learn
      </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => {
                if (item.title === "Profile") {
                  return (
                    <DropdownMenu key={item.title}>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton>
                          <User />
                          <span>Profile</span>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" className="w-56">
                        {profileMenuItems.map(profileItem => (
                          <DropdownMenuItem key={profileItem.title} asChild>
                            <Link to={profileItem.href} className="flex items-center gap-2">
                              <profileItem.icon className="w-4 h-4" />
                              <span>{profileItem.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
};

export default DashboardSidebar;