import Link from "next/link"

export function EmptyState({ title, description, actionHref, actionLabel }: { title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return (
    <section className="rounded-lg border border-dashed border-[#d8c8b5] bg-white p-8 text-center">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[#6b5d52]">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="mt-5 inline-flex rounded-md bg-[#211a15] px-4 py-2 text-sm font-semibold text-white">
          {actionLabel}
        </Link>
      ) : null}
    </section>
  )
}
