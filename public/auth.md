# The Valley Clean Team auth.md

This document describes authentication and registration for automated agents accessing The Valley Clean Team's public machine-readable resources.

## Agent audience

This policy applies to automated agents acting for users, developers, or service integrators. It covers only public discovery and documentation resources hosted at `https://thevalleycleanteam.com`.

## Supported registration methods

### Anonymous public access

No account, API key, OAuth token, or other credential is required for the resources listed below. Anonymous access is provisioned automatically: agents may use HTTPS `GET` or `HEAD` requests without registering.

- `https://thevalleycleanteam.com/.well-known/api-catalog` — API catalog
- `https://thevalleycleanteam.com/openapi.json` — OpenAPI description
- `https://thevalleycleanteam.com/api-docs` — human-readable API documentation
- `https://thevalleycleanteam.com/llms.txt` — site content guide for language models

### Manual email review

Proposed non-public business integrations use the `manual_email` method. They are reviewed by a person; approval and private credentials are not guaranteed.

## Registration and provisioning endpoints

Fetch the safe, read-only provisioning instructions:

```http
GET https://thevalleycleanteam.com/agent/auth/register
Accept: application/json
```

The response provides the current `register_uri`, supported methods, and credential policy. The current `register_uri` is `mailto:hello@thevalleycleanteam.com?subject=Agent%20integration%20request`.

For manual review, include the agent name and software, operator name or business, purpose, and expected request rate. Sending a request does not create an account or issue a credential. Agents must not probe or send requests to `POST /agent/auth`; it is not a supported endpoint.

## Credential use

Do not send an `Authorization` header, bearer token, API key, identity assertion, or other credential to the public resources above. If a private integration is approved manually, use a credential only as instructed in the written integration terms. The site does not advertise OAuth Protected Resource Metadata or OAuth Authorization Server metadata because its published resources are not OAuth-protected.

Customer quoting, booking, and account access are provided by the separate BookingKoala service. Agents must not automate account creation, sign-in, or booking submission without the user's explicit authorization and compliance with that service's terms.
