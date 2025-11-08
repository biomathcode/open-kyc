
import {
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    CommandLineIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline"
import { useRouterState } from "@tanstack/react-router"
import { NavItem } from "./app-sidebar"
import { Avatar } from "~/components/ui/avatar"
import { Breadcrumbs, BreadcrumbsItem } from "~/components/ui/breadcrumbs"

import {
    Menu,
    MenuContent,
    MenuHeader,
    MenuItem,
    MenuLabel,
    MenuSection,
    MenuSeparator,
    MenuTrigger,
} from "~/components/ui/menu"
import { SidebarNav, SidebarTrigger } from "~/components/ui/sidebar"



// TODO: Use Tanstack Router and get the path and show Description 

export default function AppSidebarNav() {
    const location = useRouterState({ select: (s) => s.location })
    const currentPath = location.pathname

    const currentNavItem = NavItem.find((item) =>
        currentPath.startsWith(item.href)
    )
    return (
        <SidebarNav>
            <span className="flex items-center gap-x-4">
                <SidebarTrigger />
                <Breadcrumbs className="hidden md:flex">
                    <BreadcrumbsItem href="#">
                        {currentNavItem?.label ?? "Dashboard"}
                    </BreadcrumbsItem>
                    <BreadcrumbsItem>
                        {currentNavItem?.description ?? "Dashboard"}
                    </BreadcrumbsItem>
                </Breadcrumbs>
            </span>
            <UserMenu />
        </SidebarNav>
    )
}

function UserMenu() {
    return (
        <Menu>
            <MenuTrigger className="ml-auto md:hidden" aria-label="Open Menu">
                <Avatar isSquare alt="kurt cobain" src="https://intentui.com/images/avatar/cobain.jpg" />
            </MenuTrigger>
            <MenuContent popover={{ placement: "bottom end" }} className="min-w-64">
                <MenuSection>
                    <MenuHeader separator>
                        <span className="block">Kurt Cobain</span>
                        <span className="font-normal text-muted-fg">@cobain</span>
                    </MenuHeader>
                </MenuSection>
                <MenuItem href="#dashboard">
                    <Squares2X2Icon />
                    <MenuLabel>Dashboard</MenuLabel>
                </MenuItem>
                <MenuItem href="#settings">
                    <Cog6ToothIcon />
                    <MenuLabel>Settings</MenuLabel>
                </MenuItem>
                <MenuSeparator />
                <MenuItem>
                    <CommandLineIcon />
                    <MenuLabel>Command Menu</MenuLabel>
                </MenuItem>
                <MenuSeparator />
                <MenuItem href="#contact-s">
                    <MenuLabel>Contact Support</MenuLabel>
                </MenuItem>
                <MenuSeparator />
                <MenuItem href="#logout">
                    <ArrowRightOnRectangleIcon />
                    <MenuLabel>Log out</MenuLabel>
                </MenuItem>
            </MenuContent>
        </Menu>
    )
}