"use server"

import { getRegionPolicies, StorePolicies } from "@lib/util/store-policies"
import { listRegions } from "./regions"

export const getStorePolicies = async (countryCode: string) => {
  const regions = await listRegions()
  const current = regions.find((region) =>
    region.countries?.some((country) => country.iso_2 === countryCode.toLowerCase())
  )

  return {
    current: getRegionPolicies(current),
    currencyCode: current?.currency_code ?? "",
    regions: regions.flatMap((region) => {
      const policies = getRegionPolicies(region)
      return policies ? [{ id: region.id, name: region.name, policies }] : []
    }) as { id: string; name: string; policies: StorePolicies }[],
  }
}

export const getPolicyParagraphs = async (
  countryCode: string,
  key: "privacy_copy" | "terms_copy" | "returns_copy",
  fallback: readonly string[],
): Promise<readonly string[]> => {
  const regions = await listRegions()
  const region = regions.find((region) =>
    region.countries?.some(({ iso_2 }) => iso_2 === countryCode.toLowerCase())
  )
  const text = region?.metadata?.[key]
  if (typeof text !== "string" || !text.trim()) return fallback

  return text.trim().split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.trim())
}
