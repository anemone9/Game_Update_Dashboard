import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '游戏更新聚合网站',
  description: '集中查看多个游戏更新时间、倒计时、更新摘要、历史更新记录',
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