import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '~/components/landing'
import Client from '~/components/landing/client'
import CTA from '~/components/landing/cta'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {


  return (
    <div className="flex flex-col   w-full">
      <Navbar />
      <CTA />
      <Client />
    </div>
  )
}

