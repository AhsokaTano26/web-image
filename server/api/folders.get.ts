import fs from 'node:fs'
import { join, resolve } from 'node:path'

const envExcluded = process.env.EXCLUDED_FOLDERS || ''
const EXCLUDED_FOLDERS = envExcluded.split(',').map(item => item.trim()).filter(Boolean)

export default defineEventHandler(() => {
  // 确保路径在不同操作系统下都能正确解析
  const baseDir = resolve(process.cwd(), 'public/gallery')

  if (!fs.existsSync(baseDir)) {
    console.warn(`[Gallery] 基础目录不存在: ${baseDir}`)
    return []
  }

  try {
    const folderNames = fs.readdirSync(baseDir).filter(file => {
      const fullPath = join(baseDir, file)
      // 必须加上 try-catch 或 check，防止在读取某些系统保护文件夹时权限报错
      try {
        return (
          fs.statSync(fullPath).isDirectory() &&
          !file.startsWith('.') &&
          !EXCLUDED_FOLDERS.includes(file)
        )
      } catch {
        return false
      }
    })

    return folderNames.map(name => {
      const folderPath = join(baseDir, name)
      // 增加一层保护，防止在读取子目录时该目录被意外删除
      const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : []

      // 找到第一张图片作为封面
      const firstImg = files.find(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))

      return {
        name,
        // 关键：确保路径始终以 / 开头，方便前端静态资源访问
        cover: firstImg ? `/gallery/${name}/${firstImg}` : null
      }
    })
  } catch (error) {
    console.error('[Gallery] 读取文件夹列表失败:', error)
    return []
  }
})