"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#04050c] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(236,72,153,0.12),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.12),transparent_36%),linear-gradient(135deg,#04050c,#10051d_48%,#061421)]" />

      <div className="dashboard-grid pointer-events-none fixed inset-0 opacity-20" />

      <div className="relative z-10 flex min-h-screen">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />

          <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 md:px-6 lg:px-7">
            {children}
          </main>
        </div>
      </div>

      <style>{`
        .dashboard-grid {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.16) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(249,115,22,0.22) 0 1px, transparent 1.4px);
          background-size: 42px 42px, 78px 78px;
          background-position: 0 0, 24px 18px;
          mask-image: radial-gradient(circle at 50% 45%, black, transparent 74%);
        }
      `}</style>
    </div>
  )
}