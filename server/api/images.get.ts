import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    const folderName = decodeURIComponent(query.folder as string || '').trim()

    // 1. 安全拦截：检查是否在屏蔽列表中
    const envExcluded = process.env.EXCLUDED_FOLDERS || ''
    // 处理屏蔽列表
    const EXCLUDED_FOLDERS = envExcluded
      .split(',')
      .map(item => item.trim().normalize()) // 标准化
      .filter(Boolean)

    // 对比时也进行标准化
    if (!folderName || EXCLUDED_FOLDERS.includes(folderName.normalize())) {
      return []
    }

    // 2. 路径对齐：与文件夹接口保持一致
    const isProd = process.env.NODE_ENV === 'production'
    const baseDir = isProd
      ? '/app/.output/public/gallery'
      : resolve(process.cwd(), 'public/gallery')

    const targetDir = join(baseDir, folderName)

    // 3. 检查目录有效性
    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
      console.warn(`[Gallery] 目标目录无效: ${targetDir}`)
      return []
    }

    // 4. 读取图片文件
    const files = fs.readdirSync(targetDir)
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file))
      .map(file => `/gallery/${folderName}/${file}`)

  } catch (e) {
    console.error('[Gallery] 读取图片列表失败:', e)
    return []
  }
})