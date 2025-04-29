import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Outlet } from "react-router-dom";
const DashboardLayout = () => {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full ">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col ">
          <DashboardHeader />
          <main className="flex-1 p-2 mx-0 ">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default DashboardLayout;