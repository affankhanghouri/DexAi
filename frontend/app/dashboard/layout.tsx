import { DigitalBackground } from "@/components/shared/digital-background"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DigitalBackground />
      <DashboardShell>{children}</DashboardShell>
    </>
  )
}
