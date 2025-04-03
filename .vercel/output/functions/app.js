import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import Page from "./page";
import { getRandomId, validateId } from "./get-position";
import { getCookie, setCookie } from "hono/cookie";
import { themes } from "./render-board";
import { getVideo } from "./get-video";
import { cache } from "hono/cache";
import { content } from "./content";
const app = new Hono();
app.get("*", cache({
    cacheName: "chess960-visualizer2",
    cacheControl: "max-age=3600",
}));
app.get("/", ({ redirect }) => {
    return redirect("/518");
});
app.get("/random", (c) => {
    const id = getRandomId();
    return c.redirect(`/${id}`);
});
app.get("/next-theme", (c) => {
    const themeName = getCookie(c, "themeName");
    const themeIndex = Object.keys(themes).indexOf(themeName || "merida");
    const firstTheme = Object.keys(themes)[0];
    const nextTheme = Object.keys(themes)[(themeIndex + 1) % Object.keys(themes).length] ||
        firstTheme;
    setCookie(c, "themeName", nextTheme);
    return c.redirect(c.req.query("redirect") || "/");
});
app.get("/flip", (c) => {
    const flipped = getCookie(c, "flipped") || "false";
    const redirect = c.req.query("redirect") || "/";
    setCookie(c, "flipped", flipped === "true" ? "false" : "true");
    return c.redirect(redirect, 302);
});
app.get("/:id", async (ctx) => {
    const themeName = getCookie(ctx, "themeName");
    const flipped = getCookie(ctx, "flipped") || "false";
    const video = await getVideo();
    try {
        const id = validateId(ctx.req.param("id"));
        return ctx.html(_jsx(Page, { id: id, themeName: themeName || "merida", flipped: flipped === "true", content: content, video: video }));
    }
    catch (e) {
        return ctx.redirect("/");
    }
});
app.post("/change-theme", async (c) => {
    const body = await c.req.parseBody();
    const themeName = body.themeName;
    const id = body.id;
    setCookie(c, "themeName", themeName);
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
    app.get("/favicon.ico", serveStatic({
        path: "./public/favicon.ico",
    }));
    // Route for homepage - default position
}
export default app;
