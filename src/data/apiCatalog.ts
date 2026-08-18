export const SITE_ORIGIN = "https://thevalleycleanteam.com";
export const API_CATALOG_PATH = "/.well-known/api-catalog";
export const API_CATALOG_PROFILE = "https://www.rfc-editor.org/info/rfc9727";

export const API_CATALOG_MEDIA_TYPE =
  `application/linkset+json; profile="${API_CATALOG_PROFILE}"`;

export const API_CATALOG_LINK =
  `<${API_CATALOG_PATH}>; rel="api-catalog"; type="application/linkset+json"`;

/**
 * RFC 9727 API catalog. The site does not expose its retired form submission
 * endpoint or private admin integrations; only the public discovery API is
 * advertised here.
 */
export const API_CATALOG = {
  linkset: [
    {
      anchor: `${SITE_ORIGIN}${API_CATALOG_PATH}`,
      "service-desc": [
        {
          href: `${SITE_ORIGIN}/openapi.json`,
          type: "application/vnd.oai.openapi+json;version=3.1",
        },
      ],
      "service-doc": [
        {
          href: `${SITE_ORIGIN}/api-docs`,
          type: "text/html",
        },
      ],
    },
  ],
} as const;
