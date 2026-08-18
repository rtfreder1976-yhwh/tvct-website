# The Valley Clean Team auth.md

This document describes authentication and registration for automated agents accessing The Valley Clean Team's public machine-readable resources.

## Agent audience

This policy applies to automated agents acting for users, developers, or service integrators. It covers only public discovery and documentation resources hosted at `https://thevalleycleanteam.com`.

## Supported method: anonymous public access

No account, registration, API key, OAuth token, or other credential is required for the resources listed below. Agents may use anonymous HTTPS `GET` or `HEAD` requests.

- `https://thevalleycleanteam.com/.well-known/api-catalog` — API catalog
- `https://thevalleycleanteam.com/openapi.json` — OpenAPI description
- `https://thevalleycleanteam.com/api-docs` — human-readable API documentation
- `https://thevalleycleanteam.com/llms.txt` — site content guide for language models

## Registration and provisioning

The Valley Clean Team does not currently provide automated agent registration or credential provisioning. There is no `register_uri`, and agents must not probe or send requests to `/agent/auth`.

For a proposed business integration that requires non-public access, contact `hello@thevalleycleanteam.com`. Requests are reviewed by a person; contacting the business is not an automated registration flow and does not issue credentials.

## Credential use

Do not send an `Authorization` header, bearer token, API key, identity assertion, or other credential to the public resources above. The site does not advertise OAuth Protected Resource Metadata or OAuth Authorization Server metadata because these resources are not OAuth-protected.

Customer quoting, booking, and account access are provided by the separate BookingKoala service. Agents must not automate account creation, sign-in, or booking submission without the user's explicit authorization and compliance with that service's terms.
