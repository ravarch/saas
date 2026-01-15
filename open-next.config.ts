import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  // ARCHITECT NOTE: Tiered Cache. 
  // 1. Tries local memory (super fast).
  // 2. Tries R2 (cheap, persistent).
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived", // ISR pages stay in memory longer
    bypassTagCacheOnCacheHit: true, // Perf optimization: skip tag check if content matches
  }),

  // Resilience: Use Durable Objects for ISR revalidation queueing
  queue: doQueue, 
});
