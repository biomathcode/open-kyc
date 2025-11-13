import { createFileRoute } from '@tanstack/react-router'

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { use, useMemo } from "react"
import { Autocomplete, AutocompleteStateContext, useFilter } from "react-aria-components"
import { api } from 'convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { Doc } from 'convex/_generated/dataModel'


import { Button } from '~/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "~/components/ui/menu"
import { SearchField, SearchInput } from "~/components/ui/search-field"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Modal, ModalContent, ModalTrigger } from '~/components/ui/modal'
import { SessionForm } from '~/components/forms/SessionForm'


export function VerificationTable({ sessions }: { sessions: Array<Doc<'sessions'>> }) {
  const { contains } = useFilter({
    sensitivity: "base",
  })
  return (
    <div className="rounded-lg border p-4">
      <Autocomplete filter={contains}>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>Click on the Session to get more information</CardDescription>
        </CardHeader>
        <div className="flex justify-end">
          <SearchField aria-label="Search">
            <SearchInput />
          </SearchField>
        </div>
        <Table className="mt-4" aria-label="Sessions">
          <TableHeader>
            <TableColumn className="w-0">#</TableColumn>
            <TableColumn isRowHeader>Username</TableColumn>
            <TableColumn>Email</TableColumn>
            {/* <TableColumn>Role</TableColumn> */}
            <TableColumn>Status</TableColumn>
            <TableColumn>Joined</TableColumn>
            <TableColumn />
          </TableHeader>
          <TableBody items={sessions}>
            {(item: Doc<'sessions'>) => (
              <TableRow id={item._id}>
                <TableCell>{item._id}</TableCell>
                <TableCell textValue={item.username}>
                  <AutocompleteHighlight>{item.username || ' '}</AutocompleteHighlight>
                </TableCell>
                <TableCell textValue={item.email}>
                  <AutocompleteHighlight>{item.email || ' '}</AutocompleteHighlight>
                </TableCell>
                {/* <TableCell textValue={item.status}>
                  <AutocompleteHighlight>{item.status}</AutocompleteHighlight>
                </TableCell> */}
                <TableCell textValue={item.status}>
                  <AutocompleteHighlight>{item.status}</AutocompleteHighlight>
                </TableCell>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Menu>
                      <MenuTrigger className="size-6">
                        <EllipsisVerticalIcon />
                      </MenuTrigger>
                      <MenuContent aria-label="Actions" placement="left top">
                        <MenuItem>View</MenuItem>
                        <MenuItem>Edit</MenuItem>
                        <MenuSeparator />
                        <MenuItem intent="danger">Delete</MenuItem>
                      </MenuContent>
                    </Menu>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Autocomplete>
    </div>
  )
}



function AutocompleteHighlight({ children }: { children: string }) {
  const state = use(AutocompleteStateContext)!
  const index = useMemo(() => {
    // TODO: use a better case-insensitive matching algorithm
    return children.toLowerCase().indexOf(state.inputValue.toLowerCase())
  }, [children, state.inputValue])

  if (index >= 0) {
    return (
      <>
        {children.slice(0, index)}
        <mark className="bg-primary text-primary-fg">
          {children.slice(index, index + state.inputValue.length)}
        </mark>
        {children.slice(index + state.inputValue.length)}
      </>
    )
  }

  return children
}



export const Route = createFileRoute('/_app/verifications/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.sessions.getSessions, {}))
  },
  pendingComponent: () => (<div>Loading...</div>),

})




function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.sessions.getSessions, {}));
  return <div>
    <div className="flex justify-between  items-center pb-4 px-2">
      <div className="text-xl font-semibold">
        Verification
      </div>
      <Modal>
        <ModalTrigger>
          <Button intent="primary"> + Session</Button>
        </ModalTrigger>

        <ModalContent className="p-6" size="4xl">

          <SessionForm />

        </ModalContent>

      </Modal>
    </div>


    <VerificationTable sessions={data} />
  </div>
}
