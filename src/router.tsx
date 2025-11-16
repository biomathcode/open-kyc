import { createRouter } from '@tanstack/react-router'
import { QueryClient, notifyManager } from '@tanstack/react-query'

import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import * as Sentry from "@sentry/tanstackstart-react";

import { useEffect } from 'react'
import { routeTree } from './routeTree.gen'




export function getRouter() {

  if (typeof document !== 'undefined') {
    notifyManager.setScheduler(window.requestAnimationFrame)
  }




  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!
  if (!CONVEX_URL) {
    throw new Error('missing VITE_CONVEX_URL envar')
  }
  const convex = new ConvexReactClient(CONVEX_URL, {
    unsavedChangesWarning: false,
    expectAuth: true,
  })
  const convexQueryClient = new ConvexQueryClient(convex)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      defaultErrorComponent: ({ error }) => {
        useEffect(() => {
          Sentry.captureException(error)
        }, [error])

        return (
          <div>
            Error occurred: {error.message}
          </div>
        )
      },


      routeTree,
      defaultPreload: 'intent',
      scrollRestoration: true,
      context: { queryClient, convexClient: convex, convexQueryClient },
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      ),
    }),
    queryClient,

  )


  if (!router.isServer) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      sendDefaultPii: true,
      integrations: [
      ],
    });
  }

  return router
}