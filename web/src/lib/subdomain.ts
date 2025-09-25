/**
 * Constructs a subdomain URL based on the current environment
 * @param subdomain - The subdomain to use
 * @returns The full URL for the subdomain
 */
export function getSubdomainUrl(subdomain: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return `https://${subdomain}.kumiko.no`
  }

  const currentHost = window.location.hostname
  const currentPort = window.location.port
  const protocol = window.location.protocol

  // Determine the base domain
  let baseDomain = 'localhost'
  if (currentHost.includes('kumiko.no')) {
    baseDomain = 'kumiko.no'
  }

  // Construct the URL
  const portSuffix = currentPort ? `:${currentPort}` : ''
  return `${protocol}//${subdomain}.${baseDomain}${portSuffix}`
}

/**
 * Opens a subdomain URL in a new tab
 * @param subdomain - The subdomain to open
 */
export function openSubdomainUrl(subdomain: string): void {
  const url = getSubdomainUrl(subdomain)
  window.open(url, '_blank')
}
