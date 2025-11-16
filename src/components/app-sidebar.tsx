"use client"

import { convexQuery } from "@convex-dev/react-query"
import { ChevronUpDownIcon } from "@heroicons/react/24/outline"
import {
    ArrowRightStartOnRectangleIcon,
    Cog6ToothIcon,
    HomeIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/solid"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { api } from "convex/_generated/api"
import {
    BanIcon, BookOpenIcon, ChartPieIcon, IdCardIcon, ListTodoIcon, LucideHome, ReceiptIcon, ScanFaceIcon, Settings2Icon,
    SwatchBookIcon,
    WorkflowIcon
} from 'lucide-react'
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

    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarRail,
    SidebarSection,
    SidebarSectionGroup,
} from "~/components/ui/sidebar"
import { authClient } from "~/lib/auth-client"

type AllowedRoutes =
    | "/sign-up"
    | "/sign-in"
    | "/anotherPage"
    | "/"
    | "/api/auth/$"
    | "/server"
    | "/client-only"
    | "."
    | ".."
    | "/analytics"
    | "/blocklist"
    | "/customization"
    | "/dashboard"
    | "/questionnaires"
    | "/settings"
    | "/verifications"
    | "/workflow"
    | "/documents"
    | "/backgroundcheck"
    | "/billing"
    | "/backgroundsearch"

interface NavItemType {
    href: AllowedRoutes
    icon: React.ElementType
    description: string
    label: string
}

export const NavItem: Array<NavItemType> = [
    {
        href: "/dashboard",
        icon: LucideHome,
        description: "Overview of your entire workspace and stats",
        label: "Dashboard",
    },
    {
        href: "/workflow",
        icon: WorkflowIcon,
        description: "Manage and automate your organization’s workflows",
        label: "Workflow",

    },
    {
        href: "/customization",
        icon: SwatchBookIcon,
        description: "Configure branding, themes, and user preferences",
        label: "Customization",

    },
    {
        href: "/verifications",
        icon: IdCardIcon,
        description: "View and manage verification requests and statuses",
        label: "Verifications",

    },
    {
        href: "/analytics",
        icon: ChartPieIcon,
        description: "Visualize and analyze key performance metrics",
        label: "Analytics",

    },
    {
        href: "/questionnaires",
        icon: ListTodoIcon,
        description: "Create and manage user questionnaires and surveys",
        label: "Questionnaries",
    },
    {
        href: "/documents",
        icon: BookOpenIcon,
        description: "Search and File Uploaded Documents",
        label: "Documents",
    },
    {
        href: "/blocklist",
        icon: BanIcon,
        description: "Monitor and update restricted entities or users",
        label: "Blocklist",

    },
    {
        href: "/backgroundsearch",
        icon: ScanFaceIcon,
        description: "Perform background checks on users",
        label: "Background Search",
    },
    {
        href: "/billing",
        icon: ReceiptIcon,
        description: "Manage your billing and subscription",
        label: "Billing",
    },
    {
        href: "/settings",
        icon: Settings2Icon,
        description: "Adjust account and application configuration",
        label: "Settings",
    },
]

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const user = useSuspenseQuery(convexQuery(api.auth.getCurrentUser, {}))

    const navigate = useNavigate()


    const handleSignOut = async () => {
        await authClient.signOut()
        void navigate({ to: '/sign-in' })
    }

    return (
        <Sidebar {...props} className="">
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-x-2">
                    <Avatar
                        isSquare
                        size="sm"
                        className=""
                        src="/logo.svg"
                    />
                    <SidebarLabel className="font-medium">
                        Open<span className="text-muted-fg">KYC</span>
                    </SidebarLabel>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarSectionGroup>
                    <SidebarSection label="Overview">

                        {
                            NavItem.map(({ href, label, icon: Icon }) => {
                                return (
                                    <SidebarItem className="
                                                group/sidebar-item relative col-span-full overflow-hidden focus-visible:outline-hidden 
                                                **:last:data-[slot=icon]:size-5 sm:**:last:data-[slot=icon]:size-4
                                                [&_[data-slot='icon']:not([class*='size-'])]:size-4 [&_[data-slot='icon']:not([class*='size-'])]:*:size-5
                                                w-full min-w-0 items-center rounded-lg text-left font-medium text-base/6 text-sidebar-fg
                                                grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] **:last:data-[slot=icon]:ml-auto supports-[grid-template-columns:subgrid]:grid-cols-subgrid sm:text-sm/5 gap-2 
                                                p-2 has-[a]:p-0
                                                hover:bg-sidebar-accent hover:text-sidebar-accent-fg hover:[&_[data-slot='icon']:not([class*='text-'])]:text-sidebar-accent-fg

                                                
                                                 " key={href} tooltip={label}
                                        to={href as any}
                                        activeProps={{
                                            "className": `   !font-semibold 
                                                            text-sidebar-primary-fg
                                                            hover:bg-sidebar-primary-bg
                                                            hover:text-sidebar-primary-fg
                                                            [&_.text-muted-fg]:text-fg/80
                                                            [&_[data-slot='icon']:not([class*='text-'])]:text-sidebar-primary-fg
                                                            hover:[&_[data-slot='icon']:not([class*='text-'])]:text-sidebar-primary-fg`,
                                        }}
                                        activeOptions={{ includeHash: true }}
                                    >
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
                                src={user.data.image}
                            />
                            <div className="in-data-[collapsible=dock]:hidden text-sm">
                                <SidebarLabel>{user.data.name}</SidebarLabel>
                                <span className="-mt-0.5 block text-muted-fg">{user.data.email}</span>
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
                                <span className="block">{user.data.name}</span>
                                <span className="font-normal text-muted-fg">{user.data.email}</span>
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
                        <MenuItem onClick={handleSignOut}>
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