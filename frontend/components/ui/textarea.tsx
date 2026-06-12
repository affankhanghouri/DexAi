import { cn } from "@/lib/utils"

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-28 rounded-md border border-[#d8c8b5] p-3", className)} {...props} />
}
