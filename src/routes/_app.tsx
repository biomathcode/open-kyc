
import { Outlet, createFileRoute, } from '@tanstack/react-router'

import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import AppSidebar from "~/components/app-sidebar"
import AppSidebarNav from "~/components/app-sidebar-nav"

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SidebarProvider>
    <AppSidebar collapsible="hidden" />
    <SidebarInset>
      <AppSidebarNav />
      <div className="p-4 lg:p-6">
        <Outlet />

      </div>


    </SidebarInset>
  </SidebarProvider>
}