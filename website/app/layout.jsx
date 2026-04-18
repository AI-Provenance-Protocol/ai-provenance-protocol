import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
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
}


const navbar = (
  <Navbar
    logo={
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img
          src="/logo.svg"
          alt="APP"
          width={28}
          height={28}
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
    <span style={{ display: 'inline', whiteSpace: 'normal' }}>
      Originally created at <a href="https://merchi.ai" target="_blank" rel="noopener noreferrer" style={{ whiteSpace: 'nowrap' }}>merchi.ai</a>. Released under CC BY 4.0 (spec) and Apache 2.0 (code). Copyright {new Date().getFullYear()} AI Provenance Protocol Contributors.
    </span>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
