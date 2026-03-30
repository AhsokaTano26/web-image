import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler(() => {
  const isProd = process.env.NODE_ENV === 'production'
  const baseDir = isProd
    ? '/app/.output/public/gallery'
    : resolve(process.cwd(), 'public/gallery')

  // 处理屏蔽列表（支持中文）
  const envExcluded = process.env.EXCLUDED_FOLDERS || ''
  const EXCLUDED_FOLDERS = envExcluded
    .split(',')
    .map(item => decodeURIComponent(item).trim())
    .filter(Boolean)

  if (!fs.existsSync(baseDir)) return []

  try {
    const folderNames = fs.readdirSync(baseDir).filter(file => {
      const fullPath = join(baseDir, file)
      try {
        return (
          fs.statSync(fullPath).isDirectory() &&
          !file.startsWith('.') &&
          !EXCLUDED_FOLDERS.includes(file) // 完美匹配中文名
        )
      } catch {
        return false
      }
    })

    return folderNames.map(name => {
      const folderPath = join(baseDir, name)
      const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : []
      const firstImg = files.find(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))

      return {
        name, // 界面显示的文字不需要 encode
        // 封面图 URL 必须 encodeURI
        cover: firstImg ? encodeURI(`/gallery/${name}/${firstImg}`) : null
      }
    })
  } catch (e) {
    return []
  }
})