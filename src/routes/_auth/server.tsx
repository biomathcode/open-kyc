import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTransition } from 'react'
import { api } from 'convex/_generated/api'

import {
    AppContainer,
    AppHeader,
    AppNav,
    SettingsButton,
    UserProfile,
} from '~/components/server'
import { SignOutButton } from '~/components/client'
import { ModeToggle } from '~/components/mode-toggle'
import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/_auth/server')({
    component: ServerComponent,
})

function ServerComponent() {
    const navigate = useNavigate()
    const [isPending, startTransition] = useTransition()

    return (
        <AppContainer>
            <ModeToggle
                isServer={true}
                onSwitch={() => {
                    startTransition(() => {
                        void navigate({ to: '/dashboard' })
                    })
                }}
                isPending={isPending}
            />
            <Header />
            <Toaster />
        </AppContainer>
    )
}

function Header() {
    const user = useSuspenseQuery(convexQuery(api.auth.getCurrentUser, {}))
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await authClient.signOut()
        void navigate({ to: '/sign-in' })
    }

    return (
        <AppHeader>
            <UserProfile user={user.data} />
            <AppNav>
                <SettingsButton>
                    {/*
          <Link to="/settings">
            <SettingsButtonContent />
          </Link>
          */}
                </SettingsButton>
                <SignOutButton onClick={handleSignOut} />
            </AppNav>
        </AppHeader>
    )
}