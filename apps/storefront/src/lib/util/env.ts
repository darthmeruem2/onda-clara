export const getBaseURL = () => {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  return process.env.NEXT_PUBLIC_BASE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:8000")
}
