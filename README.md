# MiniFlix: Scalable OTT Architecture 🎬🚀
A High-Concurrency, Low-Latency Video Streaming System Design designed to handle massive traffic spikes without performance degradation.

## 📌 Project Overview
* **Project Focus:** Edge Caching, High Availability & Infrastructure Scalability
* **Target Concurrency:** 100,000+ Active Users (Scalable to millions via distributed nodes)
* **Architecture Style:** Cloud-Distributed Content Delivery Network (CDN)

When a centralized video streaming platform experiences sudden surges in traffic, traditional monolithic applications fail due to bandwidth exhaustion and database crashes. **MiniFlix** resolves this using a four-pillar distributed infrastructure inspired by production systems like Netflix Open Connect.

---

## 🏗️ System Architecture & Core Tech Stack

| Component | Technology Stack | Engineering Role & Function |
| :--- | :--- | :--- |
| **Cloud Storage** | AWS S3 / Google Cloud Storage | Stores raw master media files, HLS/DASH video segments, and encrypted assets safely off-premise. |
| **Content Delivery Network** | AWS CloudFront / Cloudflare | Caches static video segments at edge locations geographically closer to users to reduce latency (<50ms). |
| **In-Memory Cache Layer** | Redis / Memcached | Caches viral video metadata and trending lists, cutting direct database read load by up to 90%. |
| **Load Balancer & Auto-Scaler** | AWS ALB / NGINX / Node.js | Dynamically distributes incoming API traffic across scalable microservice instances to prevent single points of failure. |

---

## 🔄 End-to-End Request & Data Flow
1. **User Request:** The user hits 'Play' on the web/mobile player (HTML5/React).
2. **Edge CDN Check:** The request routes to the nearest Edge Location. On a **Cache Hit**, playback starts instantly (<50ms).
3. **Load Balanced Routing:** On a **Cache Miss**, traffic passes through an Application Load Balancer to an under-utilized backend microservice worker.
4. **Fast Metadata Lookup:** The worker queries the **Redis In-Memory Cache** instead of the main database, pulling metadata in under 10ms.
5. **Origin Fetch:** Media chunks are fetched from AWS S3, streamed to the user, and saved to the local CDN edge cache for future regional users.

---

## 📊 Key Architectural Takeaway
> "By implementing Edge Caching via CDNs alongside a Redis In-Memory Caching Layer, MiniFlix offloads over 90% of read traffic away from the central origin server. This ensures ultra-low latency, drastically cuts bandwidth overhead, and allows the system to effortlessly sustain 100,000+ concurrent viewers without performance degradation."

---

## 🛠️ Visualizing the Architecture
Below are the conceptual breakdowns generated during the architecture workshop:

![Architecture Details Part 1](architecture_part1.png)
![Architecture Details Part 2](architecture_part2.png)

---
*Developed during the NxtWave Case Study Workshop.*
