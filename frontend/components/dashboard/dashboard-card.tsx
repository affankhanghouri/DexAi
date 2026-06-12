export function DashboardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#e3d7c7] bg-white p-5 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-[#211a15]">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-[#6b5d52]">{children}</div>
    </section>
  )
}
