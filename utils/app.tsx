import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { getConnInfo } from "hono/bun";
import Page from "./page";
import {
  generateFen,
  getPosition,
  getRandomId,
  positionToId,
  validateId,
} from "./get-position";
import { generateChessCoordinates } from "./get-instructions";
import { getCookie, setCookie } from "hono/cookie";
import { renderBoard, ThemeName, themes } from "./render-board";
import { getVideo } from "./get-video";
import { cache } from "hono/cache";
import { content } from "./content";
import { CookieOptions } from "hono/utils/cookie";
import { jsxRenderer } from "hono/jsx-renderer";
import { Suspense } from "hono/jsx";
import Layout from "./layout";
import {
  rateLimiter,
  type RateLimitInfo,
  Store as RateLimitStore,
} from "hono-rate-limiter";
import { type ConnInfo } from "hono/conninfo";

type Variables = {
  id: number;
  themeName: ThemeName;
  flipped: boolean;
  connInfo: ConnInfo;
  sessionId: string;
  rateLimit: RateLimitInfo;
  rateLimitStore: RateLimitStore;
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

app.use((c, next) => {
  let sessionId = getCookie(c, "sessionId");
  const connInfo = getConnInfo(c);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie(c, "sessionId", sessionId, {
      ...cookieOptions,
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30),
    });
  }

  c.set("sessionId", sessionId);
  c.set("connInfo", connInfo);

  return next();
});

app.use(
  "*",
  rateLimiter({
    windowMs: 1000 * 60,
    limit: process.env.NODE_ENV === "production" ? 100 : 1000,
    standardHeaders: "draft-6",
    keyGenerator: (c: Context<{ Variables: Partial<Variables> }>) => {
      const connInfo = c.get("connInfo");
      const sessionId = c.get("sessionId");

      if (!connInfo?.remote.address) {
        throw new Error("No IP address");
      }

      if (!sessionId) {
        throw new Error("No session ID");
      }

      return `${connInfo.remote.address}--${sessionId}--${c.req.path}`;
    },
  })
);

app.get("/", (c) => {
  c.header("Cache-Control", "no-store, max-age=0");
  return c.redirect("/random", 302);
});

app.get(
  "*",
  cache({
    cacheName: "chess960-visualizer",
    cacheControl: "max-age=3600",
    vary: ["Cookie"],
  })
);

app.get("/random", (c) => {
  c.header("Cache-Control", "no-store, max-age=0");
  const id = getRandomId();
  return c.redirect(`/${id}`);
});

app.get("*", (c, next) => {
  if (!c.res.headers.has("Vary")) {
    c.header("Vary", "Cookie");
  }

  const flipped =
    (getCookie(c, "flipped") as "true" | "false" | undefined) || "false";
  const themeName =
    (getCookie(c, "themeName") as ThemeName | undefined) || "merida";

  c.set("flipped", flipped === "true");
  c.set("themeName", themeName);

  return next();
});

app.get("/next-theme", (c) => {
  c.header("Cache-Control", "no-store, max-age=0");

  const themeIndex = Object.keys(themes).indexOf(c.get("themeName"));
  const firstTheme = Object.keys(themes)[0];
  const nextTheme =
    Object.keys(themes)[(themeIndex + 1) % Object.keys(themes).length] ||
    firstTheme;

  setCookie(c, "themeName", nextTheme, cookieOptions);

  return c.redirect(c.req.query("redirect") || "/");
});

app.get("/flip", (c) => {
  c.header("Cache-Control", "no-store, max-age=0");

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
  c.header("Cache-Control", "no-store, max-age=0");

  const body = await c.req.parseBody();
  const themeName = body.themeName as ThemeName;
  const id = body.id;

  setCookie(c, "themeName", themeName, cookieOptions);

  return c.redirect(`/${id}`, 302);
});

app.post("/change-position", async (c) => {
  c.header("Cache-Control", "no-store, max-age=0");

  const body = await c.req.parseBody();
  const id = validateId(body.id);
  return c.redirect(`/${id}`);
});

if (typeof Bun !== "undefined") {
  const { serveStatic } = await import("hono/bun");
  app.get("/public/*", serveStatic({}));
} else {
  app.get("/public/*", async (c) => {
    const path = c.req.path.replace("/public/", "");
    return c.redirect(`/_vercel/static/public/${path}`, 307);
  });
}

app.get("/api/v1/session-info", (c) => {
  c.header("Cache-Control", "no-store, max-age=0");

  const connInfo = c.get("connInfo");
  const sessionId = c.get("sessionId");
  const rateLimit = c.get("rateLimit");

  return c.json({ connInfo, sessionId, rateLimit });
});

app.get("/api/v1/position/:id", (c) => {
  const idParam = c.req.param("id");

  let id: number;

  try {
    if (idParam === "random") {
      id = getRandomId();
      c.header("Cache-Control", "no-store, max-age=0");
    } else if (idParam === "standard") {
      id = 518;
    } else if (idParam.length === 8) {
      id = positionToId(idParam);
    } else {
      id = validateId(idParam);
    }

    const position = getPosition(+id);
    const fen = generateFen(position);
    const board = renderBoard(fen, "merida");
    const instructions = generateChessCoordinates(position);

    return c.json({
      id,
      position,
      fen,
      board,
      instructions,
    });
  } catch (e) {
    return c.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      {
        status: 400,
      }
    );
  }
});

app.onError((err, c) => {
  console.error("Internal server error", err);
  return c.newResponse("Internal Server Error", {
    status: 500,
  });
});

export default app;
