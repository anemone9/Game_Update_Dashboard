# 游戏更新聚合

一个面向玩家的游戏更新信息站，聚合近期版本、倒计时、时间轴和历史记录。

当前项目主要展示：

- 鸣潮
- 三角洲行动
- 无畏契约
- CS2

## 功能概览

- 首页卡片展示当前版本、更新状态和简要摘要
- 时间轴页面查看近期更新节点
- 更新记录页面浏览历史版本内容
- 收藏功能，支持前端即时同步
- 后台可维护游戏信息和更新记录

## 技术栈

- Next.js
- React
- Prisma
- PostgreSQL
- Tailwind CSS

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

在项目根目录创建 `.env`，并至少提供以下变量：

```env
DATABASE_URL=
ADMIN_USERNAME=
ADMIN_PASSWORD=
AUTH_SECRET=
```

3. 初始化数据库

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. 启动开发环境

```bash
npm run dev
```

默认访问地址：

- 首页：`http://localhost:3000`
- 时间轴：`http://localhost:3000/timeline`
- 更新记录：`http://localhost:3000/updates`

## 构建

```bash
npm run build
```

## 部署

推荐部署组合：

- 前端：Vercel
- 数据库：Neon / Supabase / 其他 PostgreSQL 服务

部署时需要在平台配置以下环境变量：

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

## 项目结构

```txt
app/             页面与 API
components/      复用组件
lib/             Prisma 与鉴权逻辑
prisma/          数据模型与种子数据
public/          静态资源
```

## 说明

本项目中的游戏更新内容为站点展示数据，具体信息请以游戏官方公告为准。
