const BASE_URL = 'https://aiprovenanceprotocol.io'

export default function sitemap() {
  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/docs', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/getting-started', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/docs/embedding-modes', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/verification-protocol', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/mcp-integration', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/regulatory-mapping', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/sdk', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/specification', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/specification/core-schema', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/specification/embedding-modes', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/specification/verification-protocol', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/specification/content-hashing', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/specification/extensions', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/specification/security', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/specification/json-schema', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/specification/versioning', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/community', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/community/contributing', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/community/governance', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/community/roadmap', priority: 0.7, changeFrequency: 'weekly' },
  ]

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
