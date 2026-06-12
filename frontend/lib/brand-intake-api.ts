import type { BrandSourceType } from "@/lib/brand-dna-api"

export type BrandIntakeStep = {
  id: string
  label: string
  description: string
  status: "pending" | "processing" | "completed" | "failed"
}

export type BrandIntakeJob = {
  id: string
  sourceUrl: string
  sourceType: BrandSourceType
  status: "queued" | "processing" | "completed" | "failed"
  currentStep: string | null
  progress: number
  steps: BrandIntakeStep[]
  brandProfileId: string | null
  errorMessage: string | null
}

type BrandIntakeJobApi = {
  id: string
  source_url: string
  source_type: BrandSourceType
  status: BrandIntakeJob["status"]
  current_step: string | null
  progress: number
  steps: BrandIntakeStep[]
  brand_profile_id: string | null
  error_message: string | null
}

function mapJob(job: BrandIntakeJobApi): BrandIntakeJob {
  return {
    id: job.id,
    sourceUrl: job.source_url,
    sourceType: job.source_type,
    status: job.status,
    currentStep: job.current_step,
    progress: job.progress,
    steps: job.steps || [],
    brandProfileId: job.brand_profile_id,
    errorMessage: job.error_message,
  }
}

export async function startBrandIntake(input: {
  sourceUrl: string
  sourceType: BrandSourceType
}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/brand-dna/intake/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_url: input.sourceUrl,
      source_type: input.sourceType,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not start brand intake.")
  }

  return {
    job: mapJob(data.job as BrandIntakeJobApi),
  }
}

export async function getBrandIntakeJob(jobId: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  if (!backendUrl) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL")
  }

  const response = await fetch(`${backendUrl}/api/v1/brand-dna/intake/${jobId}`, {
    cache: "no-store",
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Could not load brand intake job.")
  }

  return {
    job: mapJob(data.job as BrandIntakeJobApi),
  }
}
