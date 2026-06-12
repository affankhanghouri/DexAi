export function CampaignMomentPicker() {
  return (
    <label className="grid gap-2 text-sm font-medium">
      Selling moment
      <select className="rounded-md border border-[#d8c8b5] p-3">
        <option>Weekend sale</option>
        <option>Pay-day push</option>
        <option>Eid collection</option>
      </select>
    </label>
  )
}
