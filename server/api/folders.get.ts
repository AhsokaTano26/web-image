import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler(() => {
  const baseDir = resolve(process.cwd(), 'public/gallery')

  if (!fs.existsSync(baseDir)) return []

  // 仅读取真正的目录，排除文件（如 apple-touch-icon.png）
  const folderNames = fs.readdirSync(baseDir).filter(file => {
    const fullPath = join(baseDir, file)
    return fs.statSync(fullPath).isDirectory() && !file.startsWith('.')
  })

  return folderNames.map(name => {
    const folderPath = join(baseDir, name)
    const files = fs.readdirSync(folderPath)

    // 找到第一张图片作为封面
    const firstImg = files.find(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))

    return {
      name,
      cover: firstImg ? `/gallery/${name}/${firstImg}` : null
    }
  })
})