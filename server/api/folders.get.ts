import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler(() => {
  // 1. 动态处理生产环境与开发环境的路径差异
  // 生产环境 (Docker): .output/public/gallery
  // 开发环境 (npm run dev): public/gallery
  const isProd = process.env.NODE_ENV === 'production'
  const baseDir = isProd
    ? resolve(process.cwd(), '.output/public/gallery')
    : resolve(process.cwd(), 'public/gallery')

  // 2. 从环境变量读取屏蔽列表
  const envExcluded = process.env.EXCLUDED_FOLDERS || ''
  const EXCLUDED_FOLDERS = envExcluded.split(',').map(item => item.trim()).filter(Boolean)

  // 检查基础目录
  if (!fs.existsSync(baseDir)) {
    console.warn(`[Gallery] 扫描路径不存在: ${baseDir}`)
    // 如果生产环境下依然找不到，尝试暴力兼容（直接找容器根部的挂载点）
    if (isProd && fs.existsSync('/app/public/gallery')) {
        return scanDirectory('/app/public/gallery', EXCLUDED_FOLDERS)
    }
    return []
  }

  return scanDirectory(baseDir, EXCLUDED_FOLDERS)
})

// 抽离扫描逻辑，方便复用和维护
function scanDirectory(baseDir: string, excluded: string[]) {
  try {
    const folderNames = fs.readdirSync(baseDir).filter(file => {
      const fullPath = join(baseDir, file)
      try {
        const stats = fs.statSync(fullPath)
        return (
          stats.isDirectory() &&
          !file.startsWith('.') &&
          !excluded.includes(file)
        )
      } catch {
        return false
      }
    })

    return folderNames.map(name => {
      const folderPath = join(baseDir, name)
      const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : []

      // 这里的正则表达式忽略大小写 (i)，解决 .PNG 404 问题
      const firstImg = files.find(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))

      return {
        name,
        // 返回给前端的 URL 始终是 /gallery/...
        cover: firstImg ? `/gallery/${name}/${firstImg}` : null
      }
    })
  } catch (error) {
    console.error('[Gallery] 扫描失败:', error)
    return []
  }
}