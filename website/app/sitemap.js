const BASE_URL = 'https://aiprovenanceprotocol.io'

export default function sitemap() {
  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly', lastModified: new Date('2026-04-18') },
    { path: '/docs', priority: 0.9, changeFrequency: 'weekly', lastModified: new Date('2026-04-18') },
    { path: '/docs/getting-started', priority: 0.9, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/docs/embedding-modes', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/docs/verification-protocol', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/docs/mcp-integration', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/docs/regulatory-mapping', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/docs/sdk', priority: 0.7, changeFrequency: 'weekly', lastModified: new Date('2026-04-18') },
    { path: '/specification', priority: 0.9, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/core-schema', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/embedding-modes', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/verification-protocol', priority: 0.8, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/content-hashing', priority: 0.7, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/extensions', priority: 0.7, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/security', priority: 0.7, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/json-schema', priority: 0.7, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/specification/versioning', priority: 0.6, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/community', priority: 0.7, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/community/contributing', priority: 0.6, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/community/governance', priority: 0.6, changeFrequency: 'monthly', lastModified: new Date('2026-04-18') },
    { path: '/community/roadmap', priority: 0.7, changeFrequency: 'weekly', lastModified: new Date('2026-04-18') },
  ]

  return pages.map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: lastModified || new Date('2026-04-18'),
    changeFrequency,
    priority,
  }))
}
