# Meta Pixel and Conversions API

Pixel: 3195858410596854. Browser code is owned by the repository, not GTM. Do not install a second Meta tag in GTM.

Vercel server-only variables:
- META_ACCESS_TOKEN: Conversions API credential; never commit or expose to browser code.
- META_GRAPH_VERSION: defaults to v23.0.
- META_TEST_EVENT_CODE: optional, for Events Manager test sessions only. Remove for normal production events.

Pixel and CAPI initialize automatically, without an advertising consent banner or stored advertising choice. This does not record or infer visitor consent. CRM registration remains independent of measurement. PageView is emitted once per page load, ViewContent once after actual YouTube playback, and Lead only after CRM accepts. Shared event_name/event_id deduplicate browser and server events. Lead context is sent only to the CRM relay; CRM destination payload and n8n do not receive this tracking context.

Names, email, phone, country from selected telephone flag and external_id are SHA-256 normalized. fbp/fbc/IP/user-agent are not hashed. City and postal code are omitted. No contact data enters dataLayer or logs. The CAPI token is read only from Vercel environment variables.

The public PageView/ViewContent endpoint checks origin, input size, event names and a per-instance rate limit (not a global distributed limiter). Lead cannot be submitted through that endpoint. CRM response waits at most two seconds for CAPI and remains successful if Meta fails. Server logs contain event/status/error codes only.

Local mocked tests: work/test-meta.mjs and work/test-crm-independent.mjs in the task workspace. Validate real browser/server receipt and deduplication in Meta Events Manager before claiming end-to-end completion.
