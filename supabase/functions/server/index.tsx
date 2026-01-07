import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Global error handler
app.onError((err, c) => {
  console.error(`Global error handler: ${err}`);
  return c.json({ error: "Internal server error", details: err.message }, 500);
});

// Health check endpoint
app.get("/make-server-3ea9e007/health", (c) => {
  return c.json({ status: "ok" });
});

// Lazy load KV store only when needed
let kv: any = null;
async function getKV() {
  if (!kv) {
    try {
      kv = await import("./kv_store.tsx");
      console.log("✅ KV store loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load KV store:", error);
      throw new Error("Database unavailable");
    }
  }
  return kv;
}

// Get all post-its
app.get("/make-server-3ea9e007/postits", async (c) => {
  try {
    const kvStore = await getKV();
    const postIts = await kvStore.getByPrefix("postit:");
    return c.json({ postIts });
  } catch (error) {
    console.log(`Error fetching post-its: ${error}`);
    return c.json({ error: "Database unavailable - use localStorage", details: String(error) }, 503);
  }
});

// Batch create or update multiple post-its (MUST be before the single post-it route)
app.post("/make-server-3ea9e007/postits/batch", async (c) => {
  try {
    const kvStore = await getKV();
    const postIts = await c.req.json();
    
    if (!Array.isArray(postIts)) {
      return c.json({ error: "Expected an array of post-its" }, 400);
    }
    
    const keys = postIts.map(p => `postit:${p.id}`);
    const values = postIts;
    
    await kvStore.mset(keys, values);
    return c.json({ success: true, count: postIts.length });
  } catch (error) {
    console.log(`Error batch saving post-its: ${error}`);
    return c.json({ error: "Database unavailable - using localStorage", details: String(error) }, 503);
  }
});

// Create or update a post-it
app.post("/make-server-3ea9e007/postits", async (c) => {
  try {
    const kvStore = await getKV();
    const postIt = await c.req.json();
    await kvStore.set(`postit:${postIt.id}`, postIt);
    return c.json({ success: true, postIt });
  } catch (error) {
    console.log(`Error saving post-it: ${error}`);
    return c.json({ error: "Database unavailable - using localStorage", details: String(error) }, 503);
  }
});

// Update post-it position
app.put("/make-server-3ea9e007/postits/:id/position", async (c) => {
  try {
    const kvStore = await getKV();
    const id = c.req.param("id");
    const { x, y } = await c.req.json();
    
    console.log(`📍 Updating position for post-it ${id} to (${x}, ${y})`);
    
    const postIt = await kvStore.get(`postit:${id}`);
    if (!postIt) {
      console.log(`❌ Post-it ${id} not found in database`);
      return c.json({ error: "Post-it not found" }, 404);
    }
    
    console.log(`✅ Found post-it ${id}, updating position...`);
    postIt.position = { x, y };
    await kvStore.set(`postit:${id}`, postIt);
    console.log(`💾 Position saved for post-it ${id}`);
    
    return c.json({ success: true, postIt });
  } catch (error) {
    console.log(`Error updating post-it position for id ${c.req.param("id")}: ${error}`);
    return c.json({ error: "Database unavailable - using localStorage", details: String(error) }, 503);
  }
});

// Update post-it color
app.put("/make-server-3ea9e007/postits/:id/color", async (c) => {
  try {
    const kvStore = await getKV();
    const id = c.req.param("id");
    const { color } = await c.req.json();
    
    const postIt = await kvStore.get(`postit:${id}`);
    if (!postIt) {
      return c.json({ error: "Post-it not found" }, 404);
    }
    
    postIt.color = color;
    await kvStore.set(`postit:${id}`, postIt);
    
    return c.json({ success: true, postIt });
  } catch (error) {
    console.log(`Error updating post-it color for id ${c.req.param("id")}: ${error}`);
    return c.json({ error: "Database unavailable - using localStorage", details: String(error) }, 503);
  }
});

// Delete a post-it
app.delete("/make-server-3ea9e007/postits/:id", async (c) => {
  try {
    const kvStore = await getKV();
    const id = c.req.param("id");
    await kvStore.del(`postit:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting post-it ${c.req.param("id")}: ${error}`);
    return c.json({ error: "Database unavailable - using localStorage", details: String(error) }, 503);
  }
});

console.log("🚀 Server starting...");
Deno.serve(app.fetch);