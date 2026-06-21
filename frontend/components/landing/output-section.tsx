const outputs = [
  {
    title: "Campaign Angle",
    text: "The main story your product should tell this week.",
    tag: "01",
  },
  {
    title: "Caption",
    text: "A ready Instagram/Facebook caption built around the campaign angle.",
    tag: "02",
  },
  {
    title: "Customer Message",
    text: "A direct selling message you can send to buyers immediately.",
    tag: "03",
  },
  {
    title: "Story Package",
    text: "Short story ideas for product reveal, urgency, and offer reminder.",
    tag: "04",
  },
  {
    title: "Offer Idea",
    text: "A simple campaign offer that makes sense for the product and moment.",
    tag: "05",
  },
  {
    title: "Poster Direction",
    text: "A premium creative direction for how the post should look.",
    tag: "06",
  },
]

export function OutputSection() {
  return (
    <section id="output" className="bg-[#070816] px-6 py-32 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-lime-300">
              Final output
            </p>

            <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.08em] md:text-7xl">
              Not content.
              <br />
              A complete campaign.
            </h2>
          </div>

          <p className="max-w-2xl text-lg font-semibold leading-8 text-white/65">
            Every DEX AI campaign is built so your team can copy it, send it,
            post it, or act on it immediately.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {outputs.map((item) => (
            <article key={item.title} className="dhoom-output-card">
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-[2rem] bg-lime-300 p-8 text-slate-950 md:p-10">
          <p className="text-3xl font-bold leading-tight">
            Your team does not need another blank page.
          </p>

          <h3 className="mt-3 max-w-4xl text-4xl font-black leading-none tracking-[-0.07em] md:text-6xl">
            Leave with something ready to post.
          </h3>
        </div>
      </div>
    </section>
  )
}
