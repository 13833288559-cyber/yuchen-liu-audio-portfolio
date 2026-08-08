import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CloudBase 云托管使用 Next.js 的独立运行产物，避免把完整开发依赖
  // 一并装进线上容器。
  output: "standalone",
};

export default nextConfig;
