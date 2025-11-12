import { Link, createFileRoute } from '@tanstack/react-router'
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

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 p-4 rounded-md h-28 overflow-auto">
      <a href={href} className="text-sm underline hover:no-underline">
        {title}
      </a>
      <p className="text-xs">{description}</p>
    </div>
  )
}
