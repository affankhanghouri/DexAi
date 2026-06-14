"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Check,
  ImageIcon,
  Loader2,
  Lock,
  ScanLine,
  Sparkles,
  UploadCloud,
  Wand2,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

const MAX_FILE_SIZE_MB = 8
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function ProductUploadScanner({
  isProcessing,
  onProductLocked,
}: {
  isProcessing: boolean
  onProductLocked: (file: File) => Promise<void> | void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  const previewUrl = useMemo(() => {
    if (!selectedFile) return ""

    return URL.createObjectURL(selectedFile)
  }, [selectedFile])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function validateFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a PNG, JPG, JPEG, or WEBP image."
    }

    const sizeMb = file.size / 1024 / 1024

    if (sizeMb > MAX_FILE_SIZE_MB) {
      return `Image is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
    }

    return ""
  }

  function selectFile(file: File) {
    const validationError = validateFile(file)

    if (validationError) {
      setError(validationError)
      setSelectedFile(null)
      setIsLocked(false)
      return
    }

    setError("")
    setSelectedFile(file)
    setIsLocked(false)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    selectFile(file)
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]

    if (!file) return

    selectFile(file)
  }

  async function handleLockProduct() {
    if (!selectedFile) {
      setError("Upload a product image first.")
      return
    }

    setError("")
    setIsLocked(true)

    try {
      await onProductLocked(selectedFile)
    } catch (err) {
      setIsLocked(false)
      setError(err instanceof Error ? err.message : "Could not lock product.")
    }
  }

  function resetImage() {
    setSelectedFile(null)
    setError("")
    setIsLocked(false)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative min-h-[520px] overflow-hidden rounded-[1.6rem] border border-dashed bg-[#070816]/70 p-4 transition md:p-5",
          isDragging
            ? "border-[#d9ff3f]/65 bg-[#d9ff3f]/10"
            : "border-white/15 hover:border-orange-400/35",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(217,255,63,0.15),transparent_42%),linear-gradient(315deg,rgba(249,115,22,0.12),transparent_48%)]" />

        <div className="relative z-10 grid h-full place-items-center">
          {previewUrl ? (
            <ProductPreview
              previewUrl={previewUrl}
              fileName={selectedFile?.name || "Product image"}
              isProcessing={isProcessing}
              isLocked={isLocked}
              onReset={resetImage}
            />
          ) : (
            <EmptyUploadState
              isDragging={isDragging}
              onBrowse={() => inputRef.current?.click()}
            />
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-4">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#d9ff3f] text-[#070816]">
            <ScanLine size={22} />
          </div>

          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-300">
            Product scanner
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-white">
            Product-first campaign
          </h3>

          <p className="mt-2 text-sm font-bold leading-6 text-white/48">
            Upload one clean product photo. Dhoom will use it as the campaign
            anchor for Product DNA, angles, variants, poster prompts, and final
            output.
          </p>

          <div className="mt-4 grid gap-2">
            <ScannerMiniStep
              active={Boolean(selectedFile)}
              label="Product image selected"
            />
            <ScannerMiniStep
              active={Boolean(selectedFile)}
              label="Ready for Product DNA"
            />
            <ScannerMiniStep
              active={isLocked || isProcessing}
              label="Campaign draft lock-in"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-[1.2rem] border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-200" />

              <p className="text-sm font-bold leading-6 text-red-200">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-[1.4rem] border border-[#d9ff3f]/20 bg-[#d9ff3f]/10 p-4">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Best image tips
          </p>

          <div className="mt-3 grid gap-2">
            <ImageTip text="Use a clear front-facing product photo." />
            <ImageTip text="Avoid heavy filters or busy backgrounds." />
            <ImageTip text="Make sure the product is visible and not cropped badly." />
            <ImageTip text="One product per campaign works best." />
          </div>
        </div>

        <button
          onClick={handleLockProduct}
          disabled={!selectedFile || isProcessing}
          className="group relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#d9ff3f] px-5 text-sm font-black text-[#070816] shadow-[0_0_45px_rgba(217,255,63,0.18)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {isProcessing ? (
              <Loader2 size={17} className="animate-spin" />
            ) : isLocked ? (
              <Lock size={17} />
            ) : (
              <Wand2 size={17} />
            )}

            {isProcessing
              ? "Locking product..."
              : selectedFile
                ? "Lock product and continue"
                : "Upload product first"}
          </span>

          <span className="absolute inset-0 translate-x-[-110%] bg-white/35 blur-xl transition group-hover:translate-x-[110%]" />
        </button>
      </div>
    </div>
  )
}

function EmptyUploadState({
  isDragging,
  onBrowse,
}: {
  isDragging: boolean
  onBrowse: () => void
}) {
  return (
    <motion.div
      animate={{
        scale: isDragging ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-lg text-center"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          boxShadow: [
            "0 0 0 rgba(217,255,63,0)",
            "0 0 52px rgba(217,255,63,0.22)",
            "0 0 0 rgba(217,255,63,0)",
          ],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-[1.4rem] border border-[#d9ff3f]/25 bg-[#d9ff3f]/10 text-[#d9ff3f]"
      >
        <UploadCloud size={34} />
      </motion.div>

      <h3 className="mt-6 text-4xl font-black tracking-[-0.08em] text-white">
        Drop product image here
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-7 text-white/48">
        Upload a clear product image. Dhoom will turn it into a campaign-ready
        product understanding flow.
      </p>

      <button
        onClick={onBrowse}
        className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#d9ff3f] px-6 text-sm font-black text-[#070816] transition hover:scale-[1.01]"
      >
        <ImageIcon size={17} />
        Browse product image
      </button>

      <p className="mt-4 text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/30">
        PNG · JPG · WEBP · Max 8MB
      </p>
    </motion.div>
  )
}

function ProductPreview({
  previewUrl,
  fileName,
  isProcessing,
  isLocked,
  onReset,
}: {
  previewUrl: string
  fileName: string
  isProcessing: boolean
  isLocked: boolean
  onReset: () => void
}) {
  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#d9ff3f]">
            Product preview
          </p>

          <h3 className="mt-1 truncate text-2xl font-black tracking-[-0.06em] text-white">
            {fileName}
          </h3>
        </div>

        <button
          onClick={onReset}
          disabled={isProcessing}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.065] text-white/58 transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={17} />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
        <img
          src={previewUrl}
          alt="Selected product"
          className="aspect-[4/5] w-full rounded-[1.1rem] object-cover"
        />

        <div className="pointer-events-none absolute inset-3 rounded-[1.1rem] bg-[linear-gradient(to_bottom,transparent,rgba(7,8,22,0.32))]" />

        {(isProcessing || isLocked) && (
          <motion.div
            animate={{
              y: ["-15%", "115%"],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="pointer-events-none absolute left-3 right-3 top-0 h-20 rounded-full bg-gradient-to-b from-[#d9ff3f]/0 via-[#d9ff3f]/35 to-[#d9ff3f]/0 blur-sm"
          />
        )}

        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#070816]/75 p-3 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#d9ff3f] text-[#070816]">
              {isProcessing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-black text-white">
                {isProcessing ? "Scanning product" : "Product image ready"}
              </p>
              <p className="text-xs font-bold text-white/42">
                {isProcessing
                  ? "Preparing campaign draft..."
                  : "Ready to lock into campaign"}
              </p>
            </div>
          </div>

          <Sparkles size={18} className="shrink-0 text-[#d9ff3f]" />
        </div>
      </div>
    </div>
  )
}

function ScannerMiniStep({
  active,
  label,
}: {
  active: boolean
  label: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-3 py-3 transition",
        active
          ? "border-[#d9ff3f]/25 bg-[#d9ff3f]/10"
          : "border-white/10 bg-white/[0.035]",
      )}
    >
      <div
        className={cn(
          "grid h-8 w-8 place-items-center rounded-xl",
          active
            ? "bg-[#d9ff3f] text-[#070816]"
            : "bg-white/[0.07] text-white/35",
        )}
      >
        {active ? <Check size={15} /> : <ScanLine size={15} />}
      </div>

      <p
        className={cn(
          "text-xs font-black",
          active ? "text-white" : "text-white/42",
        )}
      >
        {label}
      </p>
    </div>
  )
}

function ImageTip({ text }: { text: string }) {
  return (
    <div className="flex gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2">
      <Check size={14} className="mt-0.5 shrink-0 text-[#d9ff3f]" />
      <p className="text-xs font-bold leading-5 text-white/58">{text}</p>
    </div>
  )
}
