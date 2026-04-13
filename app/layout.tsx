import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '游戏更新聚合',
  description: '集中查看多款游戏的版本更新、倒计时、重点摘要与历史记录。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
