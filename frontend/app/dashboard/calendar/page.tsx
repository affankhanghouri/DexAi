import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { PageHeader } from "@/components/shared/page-header"

export default function CalendarPage() {
  return (
    <>
      <PageHeader title="Calendar" description="Map campaigns across the selling week." />
      <DashboardCard title="Weekly calendar">Campaign scheduling will live here.</DashboardCard>
    </>
  )
}
