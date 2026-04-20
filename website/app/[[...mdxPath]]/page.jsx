import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { PAGE_SCHEMAS } from './page-schemas'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

const BASE_URL = 'https://aiprovenanceprotocol.io'

const SEGMENT_LABELS = {
  docs: 'Documentation',
  specification: 'Specification',
  community: 'Community',
  'getting-started': 'Getting Started',
  'embedding-modes': 'Embedding Modes',
  'verification-protocol': 'Verification Protocol',
  'mcp-integration': 'MCP Integration',
  'regulatory-mapping': 'Regulatory Mapping',
  sdk: 'SDKs & CLI',
  'core-schema': 'Core Schema',
  'content-hashing': 'Content Hashing',
  'json-schema': 'JSON Schema Reference',
  extensions: 'Extensions',
  security: 'Security Considerations',
  versioning: 'Versioning',
  contributing: 'Contributing',
  governance: 'Governance',
  roadmap: 'Roadmap',
}

function buildBreadcrumbLd(pathSegments) {
  if (!pathSegments || pathSegments.length === 0) return null
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
  ]
  let currentPath = BASE_URL
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label =
      SEGMENT_LABELS[segment] ||
      segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: label,
      item: currentPath,
    })
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

export async function generateMetadata(props) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  const pathSegments = params.mdxPath || []
  const path = pathSegments.length > 0 ? '/' + pathSegments.join('/') : '/'
  return {
    ...metadata,
    alternates: {
      canonical: `${BASE_URL}${path}`,
    },
  }
}

const Wrapper = getMDXComponents().wrapper

function SchemaScript({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default async function Page(props) {
  const params = await props.params
  const { default: MDXContent, toc, metadata, sourceCode } =
    await importPage(params.mdxPath)
  const pathSegments = params.mdxPath || []
  const pathKey = pathSegments.join('/')
  const breadcrumbLd = buildBreadcrumbLd(pathSegments)
  const pageSchema = PAGE_SCHEMAS[pathKey]
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      {breadcrumbLd && <SchemaScript data={breadcrumbLd} />}
      {pageSchema && <SchemaScript data={pageSchema} />}
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
