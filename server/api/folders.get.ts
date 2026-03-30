import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler(() => {
  // 1. 环境路径适配：优先指向 Docker 挂载点，开发环境回退到 public/gallery
  const isProd = process.env.NODE_ENV === 'production'
  const baseDir = isProd
    ? '/app/.output/public/gallery'
    : resolve(process.cwd(), 'public/gallery')

  // 2. 从环境变量读取屏蔽列表
  const envExcluded = process.env.EXCLUDED_FOLDERS || ''
  const EXCLUDED_FOLDERS = envExcluded.split(',').map(item => item.trim()).filter(Boolean)

  if (!fs.existsSync(baseDir)) {
    console.warn(`[Gallery] 扫描路径不存在: ${baseDir}`)
    return []
  }

  try {
    const folderNames = fs.readdirSync(baseDir).filter(file => {
      const fullPath = join(baseDir, file)
      try {
        const stats = fs.statSync(fullPath)
        return (
          stats.isDirectory() &&
          !file.startsWith('.') &&
          !EXCLUDED_FOLDERS.includes(file)
        )
      } catch {
        return false
      }
    })

    return folderNames.map(name => {
      const folderPath = join(baseDir, name)
      const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : []

      // 这里的 /i 确保能识别 .jpg, .JPG, .PNG 等各种后缀
      const firstImg = files.find(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))

      return {
        name,
        // 返回给前端的路径始终以 /gallery 开头
        cover: firstImg ? `/gallery/${name}/${firstImg}` : null
      }
    })
  } catch (error) {
    console.error('[Gallery] 扫描文件夹失败:', error)
    return []
  }
})