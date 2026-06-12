import { cn } from "@/lib/utils"

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("rounded-md bg-[#211a15] px-4 py-2 text-sm font-semibold text-white", className)} {...props} />
}
