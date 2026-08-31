import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

export function extractGtmId(content: string): string | null {
  const match = content.match(/(?:const|let|var|window\.)?\s*GTM_ID\s*[:=]\s*['"`]([^'"`]+)['"`]/)
  return match && match[1] ? match[1].trim() : null
}

export function googleAnalyticsPlugin(configFilePath?: string): Plugin {
  return {
    name: 'google-analytics-plugin',
    transformIndexHtml(html, ctx) {
      const configPath = configFilePath || path.resolve(process.cwd(), 'config.js')
      if (ctx?.server) {
        ctx.server.watcher.add(configPath)
      }
      if (fs.existsSync(configPath)) {
        try {
          const content = fs.readFileSync(configPath, 'utf-8')
          const gtmId = extractGtmId(content)
          if (gtmId) {
            return [
              {
                tag: 'script',
                attrs: {
                  async: true,
                  src: `https://www.googletagmanager.com/gtag/js?id=${gtmId}`,
                },
                injectTo: 'head-prepend',
              },
              {
                tag: 'script',
                children: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${gtmId}');`,
                injectTo: 'head-prepend',
              },
            ]
          }
        } catch (error) {
          console.warn('Failed to load GTM_ID from config.js:', error)
        }
      }
      return html
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    googleAnalyticsPlugin(),
  ],
})

