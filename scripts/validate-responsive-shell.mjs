import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, relative } from "node:path";
import puppeteer from "puppeteer";

const root = new URL("../dist/client/", import.meta.url).pathname;
const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const requested = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const file = normalize(join(root, requested));

  if (relative(root, file).startsWith("..") || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(file)] || "application/octet-stream",
  });
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox"],
  ...(existsSync(macChrome) ? { executablePath: macChrome } : {}),
});

try {
  const page = await browser.newPage();
  const url = `http://127.0.0.1:${port}/`;

  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.evaluate(() => window.dispatchEvent(new Event("pointerdown")));
  await page.waitForFunction(
    () =>
      typeof window.va === "function" &&
      typeof window.si === "function" &&
      document.querySelector('script[src="/_vercel/insights/script.js"]') &&
      document.querySelector('script[src="/_vercel/speed-insights/script.js"]'),
    { timeout: 5000 },
  );
  const telemetry = await page.evaluate(() => ({
    analyticsQueueReady: typeof window.va === "function",
    speedInsightsQueueReady: typeof window.si === "function",
    analyticsScriptInjected: Boolean(
      document.querySelector('script[src="/_vercel/insights/script.js"]'),
    ),
    speedInsightsScriptInjected: Boolean(
      document.querySelector('script[src="/_vercel/speed-insights/script.js"]'),
    ),
    speedInsightsRoute: document.querySelector(
      'script[src="/_vercel/speed-insights/script.js"]',
    )?.dataset.route,
  }));
  const desktop = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    const desktopNav = nav?.querySelector(".hidden.xl\\:flex");
    const hero = document.querySelector(
      'img[alt="Professional cleaning team providing home cleaning services"]',
    );
    const logo = nav?.querySelector('img[alt="The Valley Clean Team"]');
    return {
      desktopNavVisible: desktopNav && getComputedStyle(desktopNav).display === "flex",
      heroLoaded: hero?.complete && hero.naturalWidth > 0,
      heroVisible: hero && getComputedStyle(hero).display === "block",
      navHeight: nav?.getBoundingClientRect().height || 0,
      logoHeight: logo?.getBoundingClientRect().height || 0,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    };
  });

  await page.setViewport({ width: 1024, height: 768 });
  await page.reload({ waitUntil: "networkidle0" });
  const tablet = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    const desktopNav = nav?.querySelector(".hidden.xl\\:flex");
    const menuButton = document.querySelector("#mobile-menu-btn");
    return {
      desktopNavHidden: desktopNav && getComputedStyle(desktopNav).display === "none",
      menuButtonVisible: menuButton && getComputedStyle(menuButton).display === "block",
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      overflow: [...document.querySelectorAll("body *")]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.right > window.innerWidth;
        })
        .slice(0, 5)
        .map((element) => ({
          className: element.className,
          id: element.id,
          parentClassName: element.parentElement?.className || "",
          tagName: element.tagName,
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) || "",
          ...(() => {
            const rect = element.getBoundingClientRect();
            return { left: rect.left, right: rect.right, width: rect.width };
          })(),
        })),
    };
  });

  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle0" });
  const mobile = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    const desktopNav = nav?.querySelector(".hidden.xl\\:flex");
    const menuButton = document.querySelector("#mobile-menu-btn");
    const desktopHero = document.querySelector(
      'img[alt="Professional cleaning team providing home cleaning services"]',
    );
    const mobileHero = document.querySelector(
      'img[alt="The Valley Clean Team cleaning a home"]',
    );
    return {
      desktopHeroHidden: desktopHero && getComputedStyle(desktopHero).display === "none",
      desktopNavHidden: desktopNav && getComputedStyle(desktopNav).display === "none",
      menuButtonVisible: menuButton && getComputedStyle(menuButton).display === "block",
      mobileHeroLoaded: mobileHero?.complete && mobileHero.naturalWidth > 0,
      mobileHeroVisible: mobileHero && getComputedStyle(mobileHero).display === "block",
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
    };
  });

  const failures = [
    [telemetry.analyticsQueueReady, "Vercel Web Analytics queue was not initialized"],
    [telemetry.speedInsightsQueueReady, "Vercel Speed Insights queue was not initialized"],
    [telemetry.analyticsScriptInjected, "Vercel Web Analytics script was not injected"],
    [telemetry.speedInsightsScriptInjected, "Vercel Speed Insights script was not injected"],
    [telemetry.speedInsightsRoute === "/", `Vercel Speed Insights route is ${telemetry.speedInsightsRoute}`],
    [desktop.desktopNavVisible, "desktop navigation is hidden"],
    [desktop.heroLoaded, "desktop hero image did not load"],
    [desktop.heroVisible, "desktop hero image is hidden"],
    [desktop.navHeight > 60 && desktop.navHeight < 100, `desktop header height is ${desktop.navHeight}px`],
    [desktop.logoHeight > 30 && desktop.logoHeight <= 48, `desktop logo height is ${desktop.logoHeight}px`],
    [desktop.noHorizontalOverflow, "desktop layout has horizontal overflow"],
    [tablet.desktopNavHidden, "desktop navigation remains visible at the tablet breakpoint"],
    [tablet.menuButtonVisible, "compact menu button is hidden at the tablet breakpoint"],
    [tablet.noHorizontalOverflow, "tablet layout has horizontal overflow"],
    [mobile.desktopHeroHidden, "desktop hero remains visible on mobile"],
    [mobile.desktopNavHidden, "desktop navigation remains visible on mobile"],
    [mobile.menuButtonVisible, "mobile menu button is hidden"],
    [mobile.mobileHeroLoaded, "mobile hero image did not load"],
    [mobile.mobileHeroVisible, "mobile hero image is hidden"],
    [mobile.noHorizontalOverflow, "mobile layout has horizontal overflow"],
  ].filter(([passed]) => !passed);

  if (failures.length) {
    failures.forEach(([, message]) => console.error(`Responsive shell failure: ${message}`));
    if (!tablet.noHorizontalOverflow) {
      console.error("Tablet overflow elements:", JSON.stringify(tablet.overflow));
    }
    process.exitCode = 1;
  } else {
    console.log("Responsive shell validation passed (Vercel telemetry plus desktop, tablet, and mobile navigation/hero invariants).");
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
