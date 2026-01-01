import type { MiddlewareHandler } from 'astro';

const preferredOrigin = 'https://thevalleycleanteam.com';
const preferredHost = 'thevalleycleanteam.com';

const normalizePathname = (pathname: string) =>
  pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, url } = context;

  if (!['GET', 'HEAD'].includes(request.method)) {
    return next();
  }

  if (['localhost', '127.0.0.1'].includes(url.hostname)) {
    return next();
  }

  const normalizedPathname = normalizePathname(url.pathname);
  const shouldRedirect =
    url.hostname !== preferredHost ||
    url.search !== '' ||
    url.hash !== '' ||
    normalizedPathname !== url.pathname;

  if (!shouldRedirect) {
    return next();
  }

  const canonical = new URL(preferredOrigin);
  canonical.pathname = normalizedPathname;

  return Response.redirect(canonical, 308);
};
