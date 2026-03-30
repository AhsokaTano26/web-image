import fs from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler((event) => {
  try {
    const query = getQuery(event)
    const folderName = query.folder as string

    // 1. 获取环境变量屏蔽列表
    const envExcluded = process.env.EXCLUDED_FOLDERS || ''
    const EXCLUDED_FOLDERS = envExcluded.split(',').map(item => item.trim()).filter(Boolean)

    // 2. 如果请求的是屏蔽目录，直接拦截
    if (!folderName || EXCLUDED_FOLDERS.includes(folderName)) return []

    // 3. 环境路径适配：解决 Docker 生产环境下的路径偏移
    // 生产模式下 process.cwd() 通常在 /app，而 Nitro 静态资源在 .output/public
    const isProd = process.env.NODE_ENV === 'production'
    const baseDir = isProd
      ? resolve(process.cwd(), '.output/public/gallery')
      : resolve(process.cwd(), 'public/gallery')

    const targetDir = join(baseDir, folderName)

    // 4. 调试日志（仅在部署初期保留，确认路径是否正确）
    if (isProd) {
      console.log(`[Debug] 正在扫描目录: ${targetDir}`)
    }

    // 5. 检查目录是否存在
    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
      console.warn(`[Warning] 目录不存在或无法访问: ${targetDir}`)
      return []
    }

    // 6. 读取文件并返回相对路径
    const files = fs.readdirSync(targetDir)
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file))
      .map(file => `/gallery/${folderName}/${file}`)

  } catch (e) {
    console.error('[Error] 服务端读取图片失败:', e)
    return []
  }
})