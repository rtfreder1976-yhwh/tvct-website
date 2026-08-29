# TVCT outreach operations

The public website repository contains campaign guidance and reusable messaging. It must not contain prospect exports, generated contact lists, CRM exports, or workflow snapshots with embedded contact records.

## Sources of truth

- Lead and contact records: the approved CRM or restricted operations storage
- Active ingestion automation: [TVCT Multi-Niche Lead Sync](https://singingriverai.app.n8n.cloud/workflow/3XRabjYiQUWMWl4l)
- GHL sequence logic and approved CTA: [`docs/OUTREACH_GHL_LOGIC.md`](docs/OUTREACH_GHL_LOGIC.md)
- Reusable GHL email markup: [`templates/`](templates/)
- End-to-end operating model: [`docs/GROWTH_ENGINE_SYSTEM_MAP.md`](docs/GROWTH_ENGINE_SYSTEM_MAP.md)

## Safe operating flow

1. Export lead data only to an approved local or restricted storage location.
2. Review the batch and prepare the fields expected by the active n8n workflow.
3. Run a pilot batch of 5–10 records and verify field mapping, tags, sender identity, links, and deliverability.
4. Use the active n8n/GHL systems for the campaign; do not copy contact data into this repository.
5. Send commercial traffic to `https://thevalleycleanteam.com/request-a-quote?service=commercial`.

The former repository workflow snapshot and April 2026 CSV exports were retired because they duplicated operational systems and exposed contact data in a public source repository. They are not website build inputs.
