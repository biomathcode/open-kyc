import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '~/components/landing'
import CTA from '~/components/landing/cta'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {


  return (
    <>
      <Navbar />
      <CTA />
    </>
  )
}

