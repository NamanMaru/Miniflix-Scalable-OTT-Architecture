// ==========================================
// MINIFLIX: SCALABLE OTT ARCHITECTURE PROTOTYPE
// Simulating Load Balancing, Redis Caching, and DB Fallbacks
// ==========================================

// Mock Central Database (Slow: Mimics a disk-read latency bottleneck)
const centralizedDatabase = {
    "stranger-things-s5": { title: "Stranger Things Season 5", size: "4.2GB", resolution: "4K" },
    "squid-game-s2": { title: "Squid Game Season 2", size: "3.8GB", resolution: "4K" }
};

// Mock In-Memory Cache Layer (Fast Redis simulation: Key-Value storage in RAM)
const redisCache = {
    "stranger-things-s5": { title: "Stranger Things Season 5", size: "4.2GB", resolution: "4K" }
    // "squid-game-s2" is missing from cache to intentionally force a "Cache Miss"
};

// Mock Backend Server Cluster (Microservices available for our Load Balancer)
const backendWorkers = [
    { id: "Worker-Server-1", activeConnections: 0 },
    { id: "Worker-Server-2", activeConnections: 0 },
    { id: "Worker-Server-3", activeConnections: 0 }
];

/**
 * Pillar 1: Round-Robin Application Load Balancer
 * Distributes incoming requests evenly across the server cluster.
 */
let nextWorkerIndex = 0;
function loadBalancer() {
    const selectedWorker = backendWorkers[nextWorkerIndex];
    // Cycle to the next server node for the next request
    nextWorkerIndex = (nextWorkerIndex + 1) % backendWorkers.length;
    return selectedWorker;
}

/**
 * Pillars 2 & 3: Fast Metadata Lookup via Redis Cache with DB Fallback
 */
async function processStreamingRequest(videoId) {
    const assignedWorker = loadBalancer();
    console.log(`\n[🔄 Load Balancer] Routing request for '${videoId}' to [${assignedWorker.id}]`);

    // Step 1: Query the Fast In-Memory Cache Layer (Simulating ultra-low latency <10ms)
    console.log(`[⚡ Redis Cache Check] Looking up metadata for '${videoId}'...`);
    const cachedData = redisCache[videoId];

    if (cachedData) {
        return {
            status: "🚀 CACHE HIT (<50ms Playback)",
            processedBy: assignedWorker.id,
            data: cachedData
        };
    }

    // Step 2: Cache Miss Fallback (Simulating network hop to primary database)
    console.log(`[⚠️ Cache Miss] '${videoId}' not found in RAM. Querying core database...`);
    const dbData = centralizedDatabase[videoId];

    if (dbData) {
        // Hydrate the cache so subsequent users in this region experience a Cache Hit instantly
        redisCache[videoId] = dbData;
        console.log(`[📥 Cache Hydration] Saved '${videoId}' metadata into Redis for future requests.`);
        
        return {
            status: "🐢 CACHE MISS (Database Fetch Success)",
            processedBy: assignedWorker.id,
            data: dbData
        };
    }

    return { status: "❌ 404 Not Found", processedBy: assignedWorker.id, data: null };
}

// ==========================================
// 🚀 RUNNING THE HIGH-CONCURRENCY SIMULATION
// ==========================================
async function runSimulation() {
    console.log("=== Starting MiniFlix System Simulation ===");

    // User 1 requests a viral show (Should be a lightning fast Cache Hit)
    const request1 = await processStreamingRequest("stranger-things-s5");
    console.log("Result:", request1);

    // User 2 requests a show not currently cached in RAM (Triggers a Cache Miss & Hydration)
    const request2 = await processStreamingRequest("squid-game-s2");
    console.log("Result:", request2);

    // User 3 requests the same show right after User 2 (Should now be a fast Cache Hit!)
    const request3 = await processStreamingRequest("squid-game-s2");
    console.log("Result:", request3);
}

runSimulation();
