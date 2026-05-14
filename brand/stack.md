# Marketing Stack — The Valley Clean Team

_Generated 2026-05-13 by /start-here_

## Detected integrations

| Tool                 | Status              | Notes                                        |
| -------------------- | ------------------- | -------------------------------------------- |
| Replicate API        | ✗ not connected     | Needed for /creative (image + video)         |
| LeadConnector (GHL)  | ✓ connected (MCP)   | **Primary ESP + social scheduler.** Key at user-level `~/.claude/.mcp-secrets.env`. |
| Mailchimp            | ✗ not used          | Replaced by LeadConnector                    |
| ConvertKit           | ✗ not used          | Replaced by LeadConnector                    |
| HubSpot              | ✗ not used          | Replaced by LeadConnector                    |
| Beehiiv              | ✗ not connected     | Newsletter platform (not in use)             |
| GA4                  | ✗ not connected     | Web analytics                                |
| PostHog              | ✗ not connected     | Product analytics                            |
| Buffer               | ✗ not used          | LeadConnector handles social scheduling      |
| OpenAI / Anthropic   | ✗ not detected      | Fallback generation                          |

No `.env` file detected at project root. To unlock automation across `/email-sequences`, `/creative`, and `/content-atomizer`, add API keys to `.env`.

## MCP servers available in this session

| Server      | Enhances                                                          |
| ----------- | ----------------------------------------------------------------- |
| playwright  | /brand-voice (scrape site), /competitive-intel (screenshots)      |
| context7    | Library docs (not marketing-critical)                             |
| serena      | Code navigation (not marketing-critical)                          |
| vercel      | Deployment (site is on Vercel — useful for landing-page deploys)  |
| slack       | Distribution / team comms                                         |
| figma       | Design asset extraction                                           |
| google-maps | Local SEO / location verification                                 |

## Web platform

- Site: thevalleycleanteam.com (Astro on Vercel)
- Repo: C:\Users\rtfre\.claude\projects\tvct-website
- Recent SEO focus: thin-content fixes, CTR optimization, move-in/out pricing labels
