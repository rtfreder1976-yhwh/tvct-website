import type { APIRoute } from "astro";
import {
  API_CATALOG,
  API_CATALOG_LINK,
  API_CATALOG_MEDIA_TYPE,
} from "../../data/apiCatalog";

export const prerender = true;

const headers = {
  "Content-Type": API_CATALOG_MEDIA_TYPE,
  Link: API_CATALOG_LINK,
  "Cache-Control": "public, max-age=3600",
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(API_CATALOG, null, 2), {
    status: 200,
    headers,
  });

// RFC 9727 section 2 requires HEAD to advertise the api-catalog link relation.
export const HEAD: APIRoute = () =>
  new Response(null, {
    status: 200,
    headers,
  });
