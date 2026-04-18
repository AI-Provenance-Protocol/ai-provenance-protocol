const BASE_URL = 'https://aiprovenanceprotocol.io'

const TECH_ARTICLE_DEFAULTS = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  dateModified: '2026-04-13',
  author: { '@type': 'Organization', name: 'AI Provenance Protocol Contributors' },
  publisher: { '@id': `${BASE_URL}/#organization` },
  about: { '@type': 'Thing', name: 'AI Provenance Protocol Specification' },
  license: 'https://creativecommons.org/licenses/by/4.0/',
}

export const PAGE_SCHEMAS = {
  '': {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the AI Provenance Protocol (APP)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'APP is a vendor-neutral, machine-readable open standard for recording, embedding, and verifying the provenance of AI-generated content. It answers who triggered AI generation, what model produced it, what inputs were used, and whether a human reviewed it.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does APP comply with the EU AI Act Article 50?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. APP is designed to satisfy EU AI Act Article 50 transparency obligations (enforceable 2 August 2026), which require AI providers to mark output in a machine-readable format and offer free detection mechanisms. APP's ai_generated field, three embedding modes, and public verification endpoints fulfil these requirements.",
        },
      },
      {
        '@type': 'Question',
        name: 'What are the three APP embedding modes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'APP supports three embedding modes: (1) Inline JSON — an _ai_provenance key added directly to JSON output; (2) HTTP Headers — X-APP-* response headers for non-JSON content; (3) Linked Metadata — a Link header with rel=ai-provenance pointing to a separate metadata document.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does APP differ from C2PA and Content Credentials?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'C2PA (Coalition for Content Provenance and Authenticity) handles provenance for images, video, and audio files. APP handles provenance for text and structured data such as API responses, JSON documents, and generated written content. The two standards are complementary — APP includes an extension namespace for C2PA cross-references.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is APP free to implement?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The APP specification is published under CC BY 4.0 and SDKs are Apache 2.0. There are no proprietary claims, no fees, and no permission required to implement the protocol. Development is open on GitHub.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does APP relate to the Model Context Protocol (MCP)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MCP (Model Context Protocol) handles connectivity between AI models and external tools. APP handles the provenance of what the AI produces. They are complementary: MCP servers can embed APP metadata in their tool responses, and APP includes a dedicated io.modelcontextprotocol extension namespace.',
        },
      },
    ],
  },

  'docs/getting-started': {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Getting Started with the AI Provenance Protocol',
    description:
      'A step-by-step guide to implementing the AI Provenance Protocol (APP) in your application — from generating metadata to embedding, hashing, and exposing a verification endpoint.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Generate APP metadata',
        text: 'Every time your application generates content using an AI model, create an APP metadata object with five required fields: app_version, ai_generated, generator (platform and model), generated_at (ISO 8601 timestamp), and generation_id (UUID v4).',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Choose an embedding mode',
        text: 'Embed APP metadata using one of three modes: inline JSON by adding an _ai_provenance key to your JSON response, HTTP response headers using X-APP-* headers, or linked metadata via a Link header with rel=ai-provenance.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Record human review',
        text: 'When a human reviews AI-generated content, update the metadata with review.human_reviewed set to true, along with reviewer_role, reviewed_at, and review_type. This is critical for EU AI Act Article 50(4) disclosure exemptions.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Add a content hash',
        text: 'Compute a SHA-256 hash of the generated content for integrity verification and include it as the content_hash field in the APP metadata. For JSON content, hash the canonical representation with keys sorted and the _ai_provenance key excluded.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Implement a verification endpoint',
        text: 'Expose a public REST endpoint at GET /v1/verify/{generation_id} where third parties can verify generation claims without authentication. Return found, ai_generated, generator, and generated_at fields.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Validate your metadata',
        text: 'Validate your APP metadata against the JSON Schema at https://aiprovenanceprotocol.io/schema/v1.0/app-metadata.schema.json to ensure conformance with the specification.',
      },
    ],
  },

  specification: {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'APP Specification v1.0',
    description:
      'The AI Provenance Protocol specification v1.0 — a vendor-neutral open standard defining the metadata schema, embedding modes, verification protocol, and conformance requirements for AI-generated content provenance.',
    url: `${BASE_URL}/specification`,
  },

  'specification/core-schema': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'Core Schema — APP Specification',
    description:
      'The APP metadata object — required fields (app_version, ai_generated, generator, generated_at, generation_id) and optional fields including inputs, review, usage, content_hash, and extensions.',
    url: `${BASE_URL}/specification/core-schema`,
  },

  'specification/embedding-modes': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'Embedding Modes — APP Specification',
    description:
      'Normative specification for the three APP embedding modes — inline JSON (_ai_provenance key), HTTP response headers (X-APP-*), and linked metadata via Link header. Conformance requirements for producers and consumers.',
    url: `${BASE_URL}/specification/embedding-modes`,
  },

  'specification/verification-protocol': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'Verification Protocol — APP Specification',
    description:
      "Normative specification for APP's two-level verification protocol — Level 1 generation ID lookup and Level 2 content hash matching. Requirements for platforms implementing public verification endpoints.",
    url: `${BASE_URL}/specification/verification-protocol`,
  },

  'specification/content-hashing': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'Content Hashing — APP Specification',
    description:
      'How APP uses SHA-256 content hashing for integrity verification — the canonicalization algorithm for JSON content, hash format, and how to exclude the _ai_provenance key when computing hashes.',
    url: `${BASE_URL}/specification/content-hashing`,
  },

  'specification/extensions': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'Extensions — APP Specification',
    description:
      'The APP extensions system — how to add domain-specific metadata using reverse-DNS namespaces, including the io.modelcontextprotocol namespace for MCP integration and guidance for creating custom namespaces.',
    url: `${BASE_URL}/specification/extensions`,
  },

  'specification/security': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'Security Considerations — APP Specification',
    description:
      'Security analysis of the AI Provenance Protocol — metadata integrity without cryptographic signing, spoofing risks, UUID entropy, HTTPS requirements, rate limiting recommendations, and privacy considerations.',
    url: `${BASE_URL}/specification/security`,
  },

  'specification/json-schema': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'JSON Schema Reference — APP Specification',
    description:
      'The APP metadata JSON Schema (Draft 2020-12) for automated validation of AI provenance records. Schema location, usage examples with AJV, and the full field definitions for machine-readable validation.',
    url: `${BASE_URL}/specification/json-schema`,
  },

  'specification/versioning': {
    ...TECH_ARTICLE_DEFAULTS,
    headline: 'Versioning — APP Specification',
    description:
      'How the AI Provenance Protocol uses Semantic Versioning for the app_version field — compatibility guarantees, breaking vs non-breaking changes, and how consumers should handle version differences.',
    url: `${BASE_URL}/specification/versioning`,
  },
}
