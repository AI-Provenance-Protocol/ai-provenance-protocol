import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

const BASE_URL = 'https://aiprovenanceprotocol.io'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'AI Provenance Protocol (APP)',
    template: '%s — AI Provenance Protocol',
  },
  description:
    'An open standard for recording, embedding, and verifying the provenance of AI-generated content. EU AI Act Article 50 compliant.',
  keywords: [
    'AI provenance',
    'AI transparency',
    'EU AI Act',
    'Article 50',
    'AI-generated content',
    'content provenance',
    'AI metadata',
    'open standard',
    'MCP',
    'Model Context Protocol',
    'C2PA',
    'AI governance',
    'machine-readable',
    'verification protocol',
  ],
  authors: [{ name: 'AI Provenance Protocol Contributors' }],
  creator: 'AI Provenance Protocol',
  publisher: 'AI Provenance Protocol',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'AI Provenance Protocol',
    title: 'AI Provenance Protocol (APP)',
    description:
      'The open standard for AI-generated content provenance — machine-readable, verifiable, regulation-ready.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'AI Provenance Protocol logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'AI Provenance Protocol (APP)',
    description:
      'The open standard for AI-generated content provenance — machine-readable, verifiable, regulation-ready.',
    images: ['/icon-512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    'google-site-verification': '',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Provenance Protocol',
  alternateName: 'APP',
  url: BASE_URL,
  description:
    'An open standard for recording, embedding, and verifying the provenance of AI-generated content.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/docs?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const specJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  name: 'AI Provenance Protocol Specification v1.0',
  url: `${BASE_URL}/specification`,
  description:
    'The technical specification for the AI Provenance Protocol, an open standard for AI-generated content provenance.',
  author: {
    '@type': 'Organization',
    name: 'AI Provenance Protocol Contributors',
    url: BASE_URL,
  },
  license: 'https://creativecommons.org/licenses/by/4.0/',
  version: '1.0.0-draft',
  datePublished: '2026-03-06',
  inLanguage: 'en',
  about: {
    '@type': 'Thing',
    name: 'AI Content Provenance',
    description: 'Tracking and verifying the origin of AI-generated content',
  },
}

const navbar = (
  <Navbar
    logo={
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img
          src="/logo.png"
          alt="APP"
          width={28}
          height={28}
          style={{ borderRadius: '4px' }}
        />
        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
          AI Provenance Protocol
        </span>
      </div>
    }
    projectLink="https://github.com/AI-Provenance-Protocol/ai-provenance-protocol"
  />
)

const footer = (
  <Footer>
    Released under CC BY 4.0 (spec) and Apache 2.0 (code). Copyright{' '}
    {new Date().getFullYear()} AI Provenance Protocol Contributors.
  </Footer>
)

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(specJsonLd) }}
        />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/AI-Provenance-Protocol/ai-provenance-protocol/tree/main/website"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
