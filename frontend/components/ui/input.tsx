import { cn } from "@/lib/utils"

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("rounded-md border border-[#d8c8b5] p-3", className)} {...props} />
}
