import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

/**
 * 构建统计插件
 * 在构建完成后打印构建时间和包大小信息
 */
export function buildStats(): Plugin {
  let startTime: number
  let outDir: string

  return {
    name: 'build-stats',
    configResolved(config) {
      outDir = config.build.outDir
    },
    buildStart() {
      startTime = Date.now()
      console.log('\n🚀 开始构建...\n')
    },
    writeBundle() {
      // writeBundle 在所有文件写入完成后调用，此时输出目录已存在
      // 使用 setTimeout 确保压缩插件也完成工作
      setTimeout(() => {
        const endTime = Date.now()
        const buildTime = ((endTime - startTime) / 1000).toFixed(2)
        
        // 计算输出目录大小
        const outputPath = path.resolve(process.cwd(), outDir)
        
        if (!fs.existsSync(outputPath)) {
          console.log(`❌ 输出目录不存在: ${outputPath}`)
          console.log(`   当前工作目录: ${process.cwd()}`)
          console.log(`   配置的输出目录: ${outDir}`)
          return
        }

        const stats = calculateDirSize(outputPath)
        
        console.log('\n' + '='.repeat(60))
        console.log('📦 构建统计')
        console.log('='.repeat(60))
        console.log(`⏱️  构建时间: ${buildTime}s`)
        console.log(`📁 输出目录: ${outDir}`)
        console.log('\n📊 文件大小统计:')
        console.log(`  总大小: ${formatSize(stats.totalSize)}`)
        console.log(`  文件数量: ${stats.fileCount}`)
        console.log(`  压缩文件 (.gz): ${stats.gzipCount} 个 (${formatSize(stats.gzipSize)})`)
        console.log(`  压缩文件 (.br): ${stats.brCount} 个 (${formatSize(stats.brSize)})`)
        console.log(`  原始文件: ${stats.originalCount} 个 (${formatSize(stats.originalSize)})`)
        console.log('='.repeat(60) + '\n')
      }, 100) // 延迟 100ms 确保压缩插件完成
    },
  }
}

/**
 * 计算目录大小
 */
function calculateDirSize(dirPath: string) {
  let totalSize = 0
  let fileCount = 0
  let gzipSize = 0
  let brSize = 0
  let originalSize = 0
  let gzipCount = 0
  let brCount = 0
  let originalCount = 0

  function traverseDir(currentPath: string) {
    const files = fs.readdirSync(currentPath)

    files.forEach((file) => {
      const filePath = path.join(currentPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        traverseDir(filePath)
      } else {
        const size = stat.size
        totalSize += size
        fileCount++

        if (file.endsWith('.gz')) {
          gzipSize += size
          gzipCount++
        } else if (file.endsWith('.br')) {
          brSize += size
          brCount++
        } else {
          originalSize += size
          originalCount++
        }
      }
    })
  }

  traverseDir(dirPath)

  return {
    totalSize,
    fileCount,
    gzipSize,
    brSize,
    originalSize,
    gzipCount,
    brCount,
    originalCount,
  }
}

/**
 * 格式化文件大小
 */
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

