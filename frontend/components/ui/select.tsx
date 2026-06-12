import { cn } from "@/lib/utils"

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("rounded-md border border-[#d8c8b5] p-3", className)} {...props} />
}
