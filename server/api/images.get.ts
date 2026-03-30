import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    // 注意：Nuxt 自动处理了 URL 参数解码，这里的 folderName 已经是中文
    const folderName = query.folder as string

    // 1. 安全拦截：支持中文屏蔽列表
    const envExcluded = process.env.EXCLUDED_FOLDERS || ''
    const EXCLUDED_FOLDERS = envExcluded
      .split(',')
      .map(item => decodeURIComponent(item).trim()) // 处理可能的 URL 编码和空格
      .filter(Boolean)

    if (!folderName || EXCLUDED_FOLDERS.includes(folderName)) return []

    // 2. 路径对齐：指向 Docker 挂载点
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

    // 4. 读取图片文件并进行 URL 编码
    const files = fs.readdirSync(targetDir)
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file))
      .map(file => {
        // 关键：对包含中文和特殊字符的路径进行编码，防止浏览器 404
        return encodeURI(`/gallery/${folderName}/${file}`)
      })

  } catch (e) {
    console.error('[Gallery] 读取图片列表失败:', e)
    return []
  }
})