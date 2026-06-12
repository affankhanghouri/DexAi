import Link from "next/link"

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#f7f2ea] px-6 py-10 text-[#1f1a17]">
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center gap-6">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em]">
          Dhoom AI
        </Link>
        <div className="rounded-lg border border-[#dfd2c0] bg-white p-6 shadow-sm">
          <h1 className="font-heading text-3xl font-semibold">Welcome back</h1>
          <p className="mt-3 text-sm text-[#6f6258]">
            Authentication will connect here when Supabase auth is wired in.
          </p>
        </div>
      </section>
    </main>
  )
}
