/**
 * Demo policy values kept in region metadata. Review them in the Medusa
 * Admin under Configurações → Regiões → Metadados before going live.
 */
export const DEFAULT_REGION_STORE_POLICIES = {
  return_window_days: 7,
  free_returns: true,
  shipping_rate: 24.9,
  handling_days_min: 1,
  handling_days_max: 2,
  transit_days_min: 4,
  transit_days_max: 8,
}
