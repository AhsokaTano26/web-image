# 使用轻量级 Node 镜像
FROM node:20-slim as builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm install

# 复制所有源代码
COPY . .

# 执行打包命令 (生成 .output 文件夹)
RUN npm run build

# --- 运行阶段 ---
FROM node:20-slim

WORKDIR /app

# 只从打包阶段复制生成的 .output
COPY --from=builder /app/.output ./.output

# 关键：创建一个持久化目录
RUN mkdir -p /app/public/gallery

# 暴露端口 (Nuxt 默认 3000)
EXPOSE 3000

# 运行生产环境服务
# 设置 HOST 为 0.0.0.0 确保外部能访问
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]