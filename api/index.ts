import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { handle } from "hono/vercel";
import { getVideo } from "../get-video";
import { validateId } from "../get-position";
import { content } from "../content";
import Page from "../page";
import { ThemeName } from "../render-board";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.redirect("/518");
});

app.get("/:id", async (ctx) => {
  const themeName = getCookie(ctx, "themeName") as ThemeName | undefined;
  const flipped =
    (getCookie(ctx, "flipped") as "true" | "false" | undefined) || "false";
  const video = await getVideo();

  try {
    const id = validateId(ctx.req.param("id"));

    return ctx.html(
      Page({
        content,
        flipped: flipped === "true",
        id,
        themeName: themeName || "merida",
        video,
      })
    );
  } catch (e) {
    return ctx.redirect("/");
  }
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
