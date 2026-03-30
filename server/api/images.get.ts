import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    const folderName = query.folder as string

    if (!folderName) return []

    // 使用 process.cwd() 绝对路径
    const targetDir = resolve(process.cwd(), 'public/gallery', folderName)

    // 检查目录是否存在且确实是目录
    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
      console.warn(`目录不存在: ${targetDir}`)
      return []
    }

    const files = fs.readdirSync(targetDir)
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file))
      .map(file => `/gallery/${folderName}/${file}`)
  } catch (e) {
    console.error('服务端读取错误:', e)
    return [] // 即使出错也返回空数组，防止 500
  }
})