"use client"

import Link from "next/link"
import { createAccessRequest } from "@/lib/access-requests"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Check,
  Globe,
  ImagePlus,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  Store,
  WandSparkles,
} from "lucide-react"
import type React from "react"
import { useState } from "react"

type ContactMethod = "whatsapp" | "email"

export function RequestAccessSection() {
  const [contactMethod, setContactMethod] = useState<ContactMethod>("whatsapp")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [email, setEmail] = useState("")
  const [brandLink, setBrandLink] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productImageFile, setProductImageFile] = useState<File | null>(null)
  const [productImagePreview, setProductImagePreview] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const trimmedWhatsapp = whatsappNumber.trim()
    const trimmedEmail = email.trim()
    const trimmedBrandLink = brandLink.trim()

    if (contactMethod === "whatsapp" && !trimmedWhatsapp) {
      setError("Please enter the phone number where we should contact you.")
      return
    }

    if (contactMethod === "email" && !trimmedEmail) {
      setError("Please enter the email where you want the sample.")
      return
    }

    if (!trimmedBrandLink) {
      setError("Please enter your brand, store, Instagram, or website link.")
      return
    }

    setIsSubmitting(true)

    try {
      const contactValue =
        contactMethod === "whatsapp" ? trimmedWhatsapp : `email:${trimmedEmail}`

      const requestNotes = [
        `Preferred contact: ${contactMethod}`,
        trimmedWhatsapp ? `Phone: ${trimmedWhatsapp}` : "",
        trimmedEmail ? `Email: ${trimmedEmail}` : "",
        note.trim() ? `Brand note: ${note.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n")

      await createAccessRequest({
        whatsappNumber: contactValue,
        storeLink: trimmedBrandLink,
        productCategory: productCategory.trim(),
        note: requestNotes,
        productImageFile,
      })

      setSuccess(true)
      setWhatsappNumber("")
      setEmail("")
      setBrandLink("")
      setProductCategory("")
      setProductImageFile(null)
      setProductImagePreview("")
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
    <main className="relative min-h-screen overflow-hidden bg-[#070816] px-4 py-6 text-white md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(217,255,63,0.16),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(236,72,153,0.18),transparent_34%),linear-gradient(135deg,#070816_0%,#170720_52%,#061421_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#d9ff3f]/10 blur-[110px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1080px] flex-col">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-black text-white/72 backdrop-blur-2xl transition hover:bg-white/[0.11]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <span className="rounded-full border border-[#d4af37]/35 bg-white/[0.06] px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.26em] text-[#d4af37] backdrop-blur-2xl">
            DEX AI Studio
          </span>
        </div>

        <div className="grid flex-1 items-center gap-7 py-8 lg:grid-cols-[0.9fr_0.78fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9ff3f]/25 bg-[#d9ff3f]/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f] backdrop-blur-2xl">
              <Sparkles size={14} />
              Launching soon
            </div>

            <h1 className="dhoom-luxe-heading max-w-[650px] text-[clamp(2.7rem,5.8vw,5.7rem)]">
              DEX AI Studio
              <br />
              <span>is opening soon.</span>
            </h1>

            <p className="mt-5 max-w-[590px] text-[0.98rem] font-bold leading-8 text-white/62 md:text-base">
              Until the studio opens, you can get a free campaign sample from
              the actual DEX AI engine. Send your brand link and product photo;
              our team will contact you with the sample.
            </p>

            <div className="mt-7 max-w-[590px] rounded-[1.4rem] border border-white/14 bg-white/[0.075] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-3xl">
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
                  <WandSparkles size={18} />
                </div>

                <div>
                  <h2 className="text-xl font-black tracking-[-0.05em] text-white">
                    Concierge campaign sample
                  </h2>
                  <p className="mt-1 text-sm font-bold leading-6 text-white/50">
                    This is not dashboard access yet. It is a free sample made
                    for selected brands while DEX AI Studio prepares to launch.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 22, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="relative rounded-[2rem] border border-white/24 bg-white/[0.14] p-4 shadow-[0_32px_90px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-[34px]"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.22),rgba(255,255,255,0.055)_48%,rgba(217,255,63,0.075))]" />

            <div className="relative rounded-[1.55rem] border border-white/18 bg-[#070816]/74 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              {success ? (
                <SuccessState
                  onReset={() => {
                    setSuccess(false)
                  }}
                />
              ) : (
                <>
                  <div className="mb-5">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d4af37]">
                      Request free campaign sample
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
                      Where should we send it?
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <ContactToggle
                        active={contactMethod === "whatsapp"}
                        icon={<MessageCircle size={16} />}
                        label="Phone"
                        onClick={() => setContactMethod("whatsapp")}
                      />
                      <ContactToggle
                        active={contactMethod === "email"}
                        icon={<Mail size={16} />}
                        label="Email"
                        onClick={() => setContactMethod("email")}
                      />
                    </div>

                    {contactMethod === "whatsapp" ? (
                      <FormField
                        icon={<MessageCircle size={16} />}
                        label="Phone number"
                      >
                        <input
                          value={whatsappNumber}
                          onChange={(event) =>
                            setWhatsappNumber(event.target.value)
                          }
                          placeholder="+1 555 000 0000"
                          className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
                        />
                      </FormField>
                    ) : (
                      <FormField icon={<Mail size={16} />} label="Email">
                        <input
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@brand.com"
                          className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
                        />
                      </FormField>
                    )}

                    <FormField icon={<Globe size={16} />} label="Brand link">
                      <input
                        value={brandLink}
                        onChange={(event) => setBrandLink(event.target.value)}
                        placeholder="Instagram, Facebook, Shopify, website..."
                        className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
                      />
                    </FormField>

                    <FormField icon={<Store size={16} />} label="Product category">
                      <input
                        value={productCategory}
                        onChange={(event) =>
                          setProductCategory(event.target.value)
                        }
                        placeholder="Perfume, fashion, food, skincare..."
                        className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/28"
                      />
                    </FormField>

                    <label className="block">
                      <p className="mb-2 text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/38">
                        Product photo
                      </p>

                      <div className="relative rounded-2xl border border-dashed border-white/18 bg-white/[0.07] p-4 transition hover:border-[#d9ff3f]/45">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null
                            setProductImageFile(file)

                            if (productImagePreview) {
                              URL.revokeObjectURL(productImagePreview)
                            }

                            if (file) {
                              setProductImagePreview(URL.createObjectURL(file))
                            } else {
                              setProductImagePreview("")
                            }
                          }}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.08] text-[#d4af37]">
                            <ImagePlus size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">
                              {productImageFile
                                ? productImageFile.name
                                : "Upload one clean product photo"}
                            </p>
                            <p className="mt-0.5 text-xs font-bold text-white/38">
                              Optional. JPG, PNG, or WebP.
                            </p>
                          </div>
                        </div>
                        {productImagePreview && (
                          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                            <img
                              src={productImagePreview}
                              alt="Product preview"
                              className="h-40 w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </label>

                    <label className="block">
                      <p className="mb-2 text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/38">
                        Optional note
                      </p>

                      <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={3}
                        placeholder="Any offer, product detail, or style you want?"
                        className="w-full resize-none rounded-2xl border border-white/14 bg-white/[0.07] px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#d9ff3f]/45"
                      />
                    </label>

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
                      className="group relative inline-flex min-h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#d9ff3f] px-5 text-sm font-black text-[#070816] shadow-[0_0_55px_rgba(217,255,63,0.22)] transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-60"
                    >
                      <span className="relative z-10 inline-flex items-center gap-2">
                        {isSubmitting ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <Send size={17} />
                        )}
                        {isSubmitting
                          ? "Adding request..."
                          : "Get a free campaign sample"}
                      </span>

                      <span className="absolute inset-0 translate-x-[-110%] bg-white/35 blur-xl transition group-hover:translate-x-[110%]" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}

function ContactToggle({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-black transition ${
        active
          ? "border-[#d9ff3f]/45 bg-[#d9ff3f] text-[#070816]"
          : "border-white/14 bg-white/[0.07] text-white/62 hover:bg-white/[0.1]"
      }`}
    >
      {icon}
      {label}
    </button>
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
      <p className="mb-2 text-[0.58rem] font-black uppercase tracking-[0.18em] text-white/38">
        {label}
      </p>

      <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/14 bg-white/[0.07] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition focus-within:border-[#d9ff3f]/45">
        <div className="text-[#d4af37]">{icon}</div>
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

        <h2 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">
          Your request has been added.
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm font-bold leading-7 text-white/50">
          DEX AI team will contact you soon with your free campaign sample.
        </p>

        <button
          onClick={onReset}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.08] px-5 text-sm font-black text-white/72 transition hover:bg-white/[0.12]"
        >
          <WandSparkles size={16} />
          Submit another request
        </button>
      </div>
    </div>
  )
}
