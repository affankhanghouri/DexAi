export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-heading text-3xl font-semibold text-[#211a15]">{title}</h1>
      {description ? <p className="mt-2 text-sm text-[#6b5d52]">{description}</p> : null}
    </header>
  )
}
