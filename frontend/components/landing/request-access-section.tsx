"use client"

import { createAccessRequest } from "@/lib/access-requests"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Check,
  Globe,
  Loader2,
  MessageCircle,
  PackageCheck,
  Send,
  Sparkles,
  Store,
  Wand2,
} from "lucide-react"
import { useState } from "react"

export function RequestAccessSection() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [storeLink, setStoreLink] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!whatsappNumber.trim()) {
      setError("Please enter your WhatsApp number.")
      return
    }

    if (!storeLink.trim()) {
      setError("Please enter your store, Instagram, Facebook, or website link.")
      return
    }

    setIsSubmitting(true)

    try {
      await createAccessRequest({
        whatsappNumber: whatsappNumber.trim(),
        storeLink: storeLink.trim(),
        productCategory: productCategory.trim(),
        note: note.trim(),
      })

      setSuccess(true)
      setWhatsappNumber("")
      setStoreLink("")
      setProductCategory("")
      setNote("")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit request. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="request-access"
      className="relative overflow-hidden bg-[#070816] px-5 py-24 text-white md:px-8 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-14%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#d9ff3f]/15 blur-[100px]" />
        <div className="absolute right-[-12%] top-[12%] h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-[110px]" />
        <div className="absolute bottom-[-18%] left-[35%] h-[380px] w-[380px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_28%,rgba(217,255,63,0.04))]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            <Sparkles size={14} />
            Early access
          </div>

          <h2 className="max-w-3xl text-5xl font-black tracking-[-0.09em] text-white md:text-7xl">
            Get a free Dhoom campaign sample.
          </h2>

          <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-white/55 md:text-lg">
            Send your store link. We’ll review your product and WhatsApp you a
            sample AI ad or campaign direction made for your brand.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <PromiseCard
              icon={<Store size={18} />}
              title="Send store"
              text="Instagram, Facebook, Shopify, Daraz, or website link."
            />

            <PromiseCard
              icon={<Wand2 size={18} />}
              title="We create"
              text="A sample campaign direction or ad preview for your product."
            />

            <PromiseCard
              icon={<MessageCircle size={18} />}
              title="WhatsApp reply"
              text="We contact you directly with your sample."
            />
          </div>

          <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
                <PackageCheck size={18} />
              </div>

              <div>
                <h3 className="text-lg font-black tracking-[-0.04em] text-white">
                  No dashboard needed yet.
                </h3>

                <p className="mt-1 text-sm font-bold leading-6 text-white/45">
                  Dhoom is currently giving selected sellers manual campaign
                  samples before full dashboard access opens.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.065] p-4 shadow-[0_32px_110px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,255,63,0.2),transparent_34%),radial-gradient(circle_at_90%_30%,rgba(249,115,22,0.16),transparent_36%)]" />

          <div className="relative z-10 rounded-[1.55rem] border border-white/10 bg-[#070816]/72 p-5">
            {success ? (
              <SuccessState
                onReset={() => {
                  setSuccess(false)
                }}
              />
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
                    Request access
                  </p>

                  <h3 className="mt-2 text-3xl font-black tracking-[-0.07em] text-white">
                    Let Dhoom review your store.
                  </h3>

                  <p className="mt-2 text-sm font-bold leading-6 text-white/45">
                    Fill this once. We’ll use your details only to contact you
                    about your campaign sample.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    icon={<MessageCircle size={16} />}
                    label="WhatsApp number"
                  >
                    <input
                      value={whatsappNumber}
                      onChange={(event) =>
                        setWhatsappNumber(event.target.value)
                      }
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
                    />
                  </FormField>

                  <FormField icon={<Globe size={16} />} label="Store link">
                    <input
                      value={storeLink}
                      onChange={(event) => setStoreLink(event.target.value)}
                      placeholder="Instagram, Facebook, Shopify, Daraz, website..."
                      className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
                    />
                  </FormField>

                  <FormField icon={<Store size={16} />} label="Product category">
                    <input
                      value={productCategory}
                      onChange={(event) =>
                        setProductCategory(event.target.value)
                      }
                      placeholder="Fashion, perfume, food, skincare, shoes..."
                      className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
                    />
                  </FormField>

                  <label className="block">
                    <p className="mb-2 text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/35">
                      Optional note
                    </p>

                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      rows={4}
                      placeholder="Tell us what product you want promoted, any offer, or what kind of ad you want..."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#d9ff3f]/35"
                    />
                  </label>

                  <div className="rounded-2xl border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-3">
                    <p className="text-xs font-bold leading-5 text-[#d9ff3f]">
                      By submitting, you agree that Dhoom may contact you on
                      WhatsApp with your sample campaign.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3">
                      <p className="text-sm font-bold leading-6 text-red-200">
                        {error}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex min-h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816] shadow-[0_0_55px_rgba(217,255,63,0.2)] transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-60"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {isSubmitting ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Send size={17} />
                      )}
                      {isSubmitting
                        ? "Submitting request..."
                        : "Request free sample"}
                    </span>

                    <span className="absolute inset-0 translate-x-[-110%] bg-white/35 blur-xl transition group-hover:translate-x-[110%]" />
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PromiseCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
        {icon}
      </div>

      <h3 className="text-xl font-black tracking-[-0.05em] text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs font-bold leading-5 text-white/45">{text}</p>
    </div>
  )
}

function FormField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <p className="mb-2 text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 transition focus-within:border-[#d9ff3f]/35">
        <div className="text-orange-300">{icon}</div>
        {children}
      </div>
    </label>
  )
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="grid min-h-[520px] place-items-center text-center">
      <div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]"
        >
          <Check size={30} />
        </motion.div>

        <h3 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Request received.
        </h3>

        <p className="mx-auto mt-3 max-w-sm text-sm font-bold leading-7 text-white/50">
          We’ll review your store and contact you on WhatsApp with your Dhoom
          campaign sample.
        </p>

        <button
          onClick={onReset}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.065] px-5 text-sm font-black text-white/70 transition hover:bg-white/[0.1]"
        >
          Submit another request
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}