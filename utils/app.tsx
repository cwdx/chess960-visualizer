import { Hono } from "hono";
import { logger } from "hono/logger";
import Page from "./page";
import { getRandomId, validateId } from "./get-position";
import { getCookie, setCookie } from "hono/cookie";
import { ThemeName, themes } from "./render-board";
import { getVideo } from "./get-video";
import { cache } from "hono/cache";
import { content } from "./content";
import { CookieOptions } from "hono/utils/cookie";
import { jsxRenderer } from "hono/jsx-renderer";
import { Suspense } from "hono/jsx";
import Layout from "./layout";

type Variables = {
  id: number;
  themeName: ThemeName;
  flipped: boolean;
};

const app = new Hono<{
  Variables: Variables;
}>();

const cookieOptions: CookieOptions =
  process.env.NODE_ENV === "production"
    ? {
        secure: true,
        sameSite: "strict",
      }
    : {};

app.use(logger());

app.get(
  "*",
  cache({
    cacheName: "chess960-visualizer",
    cacheControl: "max-age=3600",
  })
);

app.get("*", (c, next) => {
  c.header("Cache-Control", "max-age=3600");
  c.header("Vary", "Cookie");

  const flipped =
    (getCookie(c, "flipped") as "true" | "false" | undefined) || "false";
  const themeName =
    (getCookie(c, "themeName") as ThemeName | undefined) || "merida";

  c.set("flipped", flipped === "true");
  c.set("themeName", themeName);

  return next();
});

app.get("/", ({ redirect }) => {
  return redirect("/518");
});

app.get("/next-theme", (c) => {
  const themeIndex = Object.keys(themes).indexOf(c.get("themeName"));
  const firstTheme = Object.keys(themes)[0];
  const nextTheme =
    Object.keys(themes)[(themeIndex + 1) % Object.keys(themes).length] ||
    firstTheme;

  setCookie(c, "themeName", nextTheme, cookieOptions);

  return c.redirect(c.req.query("redirect") || "/");
});

app.get("/flip", (c) => {
  const redirect = c.req.query("redirect") || "/";

  setCookie(c, "flipped", c.get("flipped") ? "false" : "true", cookieOptions);

  return c.redirect(redirect, 302);
});

app.get("/:id", async (c, next) => {
  try {
    const id = validateId(c.req.param("id"));
    c.set("id", id);
    return next();
  } catch (e) {
    const text = e instanceof Error ? e.message : "Unknown error";
    return c.newResponse(text, {
      status: 404,
    });
  }
});

app.get(
  "/:id",
  jsxRenderer(
    ({ children }, c) => {
      return (
        <Layout id={c.get("id")} themeName={c.get("themeName")}>
          {children}
        </Layout>
      );
    },
    { stream: true }
  )
);

app.get("/:id", async (c) => {
  const video = await getVideo();
  const randomId = getRandomId();

  return c.render(
    <Suspense fallback={<div>loading...</div>}>
      <Page
        id={c.get("id")}
        randomId={randomId}
        themeName={c.get("themeName")}
        flipped={c.get("flipped")}
        content={content}
        video={video}
      />
    </Suspense>
  );
});

app.post("/change-theme", async (c) => {
  const body = await c.req.parseBody();
  const themeName = body.themeName as ThemeName;
  const id = body.id;

  setCookie(c, "themeName", themeName, cookieOptions);

  return c.redirect(`/${id}`, 302);
});

app.post("/change-position", async (c) => {
  const body = await c.req.parseBody();
  const id = validateId(body.id);
  return c.redirect(`/${id}`);
});

if (typeof Bun !== "undefined") {
  const { serveStatic } = await import("hono/bun");
  app.get("/public/*", serveStatic({}));
} else {
  // For Vercel environment
  app.get("/public/*", async (c) => {
    const path = c.req.path.replace("/public/", "");
    return c.redirect(`/_vercel/static/public/${path}`, 307);
  });
}

export default app;
