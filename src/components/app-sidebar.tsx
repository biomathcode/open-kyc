"use client"

import { ChevronUpDownIcon } from "@heroicons/react/24/outline"
import {
    ArrowRightStartOnRectangleIcon,
    Cog6ToothIcon,
    HomeIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/solid"
import { BanIcon, ChartPieIcon, IdCardIcon, ListTodoIcon, LucideHome, Settings2Icon, SwatchBookIcon, WorkflowIcon } from 'lucide-react'
import { Avatar } from "~/components/ui/avatar"
import { Link } from "~/components/ui/link"
import {
    Menu,
    MenuContent,
    MenuHeader,
    MenuItem,
    MenuSection,
    MenuSeparator,
    MenuTrigger,
} from "~/components/ui/menu"
import {
    Sidebar,
    SidebarContent,
    SidebarDisclosure,
    SidebarDisclosureGroup,
    SidebarDisclosurePanel,
    SidebarDisclosureTrigger,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarLink,
    SidebarMenuTrigger,
    SidebarRail,
    SidebarSection,
    SidebarSectionGroup,
} from "~/components/ui/sidebar"

export const NavItem = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LucideHome,
        description: "Overview of your entire workspace and stats",
    },
    {
        label: "Workflow",
        href: "/workflow",
        icon: WorkflowIcon,
        description: "Manage and automate your organization’s workflows",
    },
    {
        label: "Customization",
        href: "/customization",
        icon: SwatchBookIcon,
        description: "Configure branding, themes, and user preferences",
    },
    {
        label: "Verifications",
        href: "/verifications",
        icon: IdCardIcon,
        description: "View and manage verification requests and statuses",
    },
    {
        label: "Analytics",
        href: "/analytics",
        icon: ChartPieIcon,
        description: "Visualize and analyze key performance metrics",
    },
    {
        label: "Questionnaries",
        href: "/questionnaries",
        icon: ListTodoIcon,
        description: "Create and manage user questionnaires and surveys",
    },
    {
        label: "Blocklist",
        href: "/blocklist",
        icon: BanIcon,
        description: "Monitor and update restricted entities or users",
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings2Icon,
        description: "Adjust account and application configuration",
    },
]

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props} className="">
            <SidebarHeader>
                <Link href="/docs/components/layouts/sidebar" className="flex items-center gap-x-2">
                    <Avatar
                        isSquare
                        size="sm"
                        className="outline-hidden"
                        src="https://design.intentui.com/logo?color=155DFC"
                    />
                    <SidebarLabel className="font-medium">
                        Intent <span className="text-muted-fg">UI</span>
                    </SidebarLabel>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarSectionGroup>
                    <SidebarSection label="Overview">


                        {
                            NavItem.map(({ href, label, icon: Icon }) => {
                                return (
                                    <SidebarItem className="flex gap-2" key={href} tooltip={label} href={href}>
                                        <Icon size={16} />
                                        <SidebarLabel>{label}</SidebarLabel>
                                    </SidebarItem>
                                )
                            })
                        }
                    </SidebarSection>


                </SidebarSectionGroup>
            </SidebarContent>

            <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
                <Menu>
                    <MenuTrigger className="flex w-full items-center justify-between" aria-label="Profile">
                        <div className="flex items-center gap-x-2">
                            <Avatar
                                className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
                                isSquare
                                src="https://intentui.com/images/avatar/cobain.jpg"
                            />
                            <div className="in-data-[collapsible=dock]:hidden text-sm">
                                <SidebarLabel>Kurt Cobain</SidebarLabel>
                                <span className="-mt-0.5 block text-muted-fg">kurt@domain.com</span>
                            </div>
                        </div>
                        <ChevronUpDownIcon data-slot="chevron" />
                    </MenuTrigger>
                    <MenuContent
                        className="in-data-[sidebar-collapsible=collapsed]:min-w-56 min-w-(--trigger-width)"
                        placement="bottom right"
                    >
                        <MenuSection>
                            <MenuHeader separator>
                                <span className="block">Kurt Cobain</span>
                                <span className="font-normal text-muted-fg">@cobain</span>
                            </MenuHeader>
                        </MenuSection>

                        <MenuItem href="#dashboard">
                            <HomeIcon />
                            Profile
                        </MenuItem>
                        <MenuItem href="/settings">
                            <Cog6ToothIcon />
                            Settings
                        </MenuItem>
                        <MenuItem href="#security">
                            <ShieldCheckIcon />
                            Security
                        </MenuItem>
                        <MenuSeparator />

                        <MenuSeparator />
                        <MenuItem href="#logout">
                            <ArrowRightStartOnRectangleIcon />
                            Log out
                        </MenuItem>
                    </MenuContent>
                </Menu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}