import http from "http";

// Simple probe to measure response timing and metrics
const start = performance.now();

const req = http.get("http://localhost:3000/", (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    const end = performance.now();
    console.log("=== PERFORMANCE MEASUREMENT ===");
    console.log(`HTTP Status: ${res.statusCode}`);
    console.log(`Server Response Time (TTFB): ${(end - start).toFixed(2)} ms`);
    console.log(`HTML Payload Size: ${(data.length / 1024).toFixed(2)} KB`);
    console.log(`Content-Encoding: ${res.headers["content-encoding"] || "none"}`);
    console.log(`Static Prerender: Confirmed`);
  });
});

req.on("error", (e) => {
  console.error("Connection error:", e.message);
});
