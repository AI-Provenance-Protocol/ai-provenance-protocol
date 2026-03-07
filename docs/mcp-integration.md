# MCP Integration Guide

The AI Provenance Protocol (APP) and the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) are complementary standards. MCP defines how AI applications connect to external tools and data sources; APP records the provenance of AI-generated output. Together, they create a complete picture: MCP handles the *how* of AI interaction, APP handles the *what happened*.

## How They Fit Together

```
┌─────────────────────────────────────────────────┐
│                  AI Application                  │
│    (Claude, ChatGPT, custom agent, etc.)         │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌─────────────┐         ┌──────────────────┐  │
│   │     MCP     │         │       APP        │  │
│   │             │         │                  │  │
│   │  Connects   │         │   Records what   │  │
│   │  AI to      │────────▶│   the AI         │  │
│   │  tools &    │         │   produced and   │  │
│   │  data       │         │   how            │  │
│   └─────────────┘         └──────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

| Concern | MCP | APP |
|---------|-----|-----|
| AI-to-tool connectivity | Primary purpose | Not covered |
| Provenance of AI output | Not covered | Primary purpose |
| Content verification | Not covered | Verification protocol |
| Human review tracking | Not covered | Review object |
| EU AI Act compliance | Not directly addressed | Core design target |

---

## MCP Servers That Generate Content

If you build an MCP server that uses AI models to generate content (e.g., a content generation tool, code generator, or data transformation service), you should include APP metadata in your tool responses.

### Adding APP Metadata to Tool Responses

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { v4 as uuidv4 } from 'uuid';

const server = new McpServer({
  name: 'product-description-server',
  version: '1.0.0',
});

server.tool(
  'generate_description',
  { productName: { type: 'string' }, category: { type: 'string' } },
  async ({ productName, category }) => {
    const generatedText = await callAIModel(productName, category);
    const generationId = uuidv4();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            description: generatedText,
            _ai_provenance: {
              app_version: '1.0.0',
              ai_generated: true,
              generator: {
                platform: 'product-description-server',
                platform_version: '1.0.0',
                model: 'anthropic/claude-sonnet-4',
              },
              generated_at: new Date().toISOString(),
              generation_id: generationId,
              verification_uri: 'https://verify.example.com/v1/verify',
              inputs: {
                type: 'structured',
                description: 'Product name and category',
                items: [
                  { kind: 'data', ref: 'product_attributes', fields: ['name', 'category'] },
                ],
              },
            },
          }),
        },
      ],
    };
  }
);
```

### Using the MCP Extension Namespace

Store MCP-specific context in the `io.modelcontextprotocol` extension namespace:

```json
{
  "_ai_provenance": {
    "app_version": "1.0.0",
    "ai_generated": true,
    "generator": {
      "platform": "product-description-server",
      "model": "anthropic/claude-sonnet-4"
    },
    "generated_at": "2026-03-06T14:22:00Z",
    "generation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "extensions": {
      "io.modelcontextprotocol": {
        "server_name": "product-description-server",
        "server_version": "1.0.0",
        "tool_name": "generate_description",
        "session_id": "mcp-session-abc123"
      }
    }
  }
}
```

---

## MCP Clients Consuming APP Metadata

If you build an MCP client (host application), you can extract and use APP metadata from tool responses:

```typescript
function processToolResponse(response: ToolResponse) {
  for (const content of response.content) {
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text);
        if (parsed._ai_provenance) {
          // APP metadata found — record provenance
          storeProvenance(parsed._ai_provenance);

          if (parsed._ai_provenance.ai_generated && !parsed._ai_provenance.review?.human_reviewed) {
            // Flag for human review if required by policy
            flagForReview(parsed._ai_provenance.generation_id);
          }
        }
      } catch {
        // Not JSON, check for linked metadata in other content types
      }
    }
  }
}
```

---

## Provenance Chains with MCP

When an MCP workflow involves multiple AI generation steps, use `parent_generation_id` to create provenance chains:

```
Step 1: MCP tool "research" generates background data
        → generation_id: "aaa-111"

Step 2: MCP tool "write_draft" uses research to generate a draft
        → generation_id: "bbb-222"
        → parent_generation_id: "aaa-111"

Step 3: MCP tool "polish" refines the draft
        → generation_id: "ccc-333"
        → parent_generation_id: "bbb-222"
```

Each step in the chain has its own APP metadata, and the `parent_generation_id` links them together for full traceability.

---

## Architecture Patterns

### Pattern 1: MCP Server with Built-in Verification

The MCP server both generates content and hosts the verification endpoint:

```
MCP Client ──MCP──▶ MCP Server ──AI──▶ AI Model
                         │
                         ├── Returns content + APP metadata
                         │
                         └── Hosts /v1/verify endpoint
```

### Pattern 2: MCP Server with External APP Registry

The MCP server generates content and registers provenance with a separate APP registry:

```
MCP Client ──MCP──▶ MCP Server ──AI──▶ AI Model
                         │
                         ├── Returns content + APP metadata
                         │
                         └── Registers with APP Registry ──▶ Hosts /v1/verify
```

### Pattern 3: Client-Side APP Enrichment

The MCP client adds APP metadata after receiving tool responses:

```
MCP Client ──MCP──▶ MCP Server
     │
     ├── Receives raw content
     │
     └── Adds APP metadata
         (client knows the full context)
```

---

## Best Practices

1. **Always include APP metadata** when your MCP server uses AI models to generate content
2. **Use the MCP extension namespace** (`io.modelcontextprotocol`) for MCP-specific context
3. **Create provenance chains** when multiple MCP tools contribute to a final output
4. **Expose verification endpoints** if your MCP server is used in regulated contexts
5. **Record human review** when MCP tool output is reviewed before use
