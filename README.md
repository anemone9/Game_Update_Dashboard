# 游戏更新聚合站

这是一个基于 `Next.js + Prisma + PostgreSQL` 的游戏更新聚合网站，目前主要维护：

- 鸣潮
- 三角洲行动

网站支持公开展示游戏版本历史，也支持管理员登录后在后台维护游戏资料与更新记录。

## 长期维护方案

当前项目已经调整为适合长期维护的结构：

- 数据库使用 `PostgreSQL`
- 后台通过管理员账号密码登录
- `/admin` 和相关写入接口默认受保护
- 可以部署到云端后持续更新，不需要每次只依赖本地 `seed`

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 复制环境变量模板

```bash
copy .env.example .env
```

3. 修改 `.env`

你至少需要配置：

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

示例：

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/game_update_web?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-strong-password"
AUTH_SECRET="a-long-random-secret"
```

4. 同步数据库结构

```bash
npm run db:generate
npm run db:push
```

5. 导入基础数据

```bash
npm run db:seed
```

6. 启动开发环境

```bash
npm run dev
```

打开：

- 前台：`http://localhost:3000`
- 后台登录：`http://localhost:3000/login`
- 后台管理：`http://localhost:3000/admin`

## 日常维护内容

### 方式一：后台维护

适合日常更新，例如三角洲 4 月 16 日新赛季上线。

操作步骤：

1. 登录 `/login`
2. 进入 `/admin`
3. 在“管理游戏”里更新当前版本
4. 在“管理更新”里新增一条记录

例如三角洲行动新赛季更新：

- 游戏：`三角洲行动`
- 版本：`S9 回声`
- 日期：`2026-04-16`
- 摘要：`新增侦察干员“回响”、全面战场新地图“乌姆斯运河”，并上线赛季活动与玩法调整。`

### 方式二：批量整理历史版本

适合一次性整理很多历史数据。

编辑文件：

- `prisma/seed.ts`

改完后执行：

```bash
npm run db:seed
```

注意：当前 `seed` 逻辑会先清除该游戏已有更新，再重新写入，适合“重建历史版本”。

## 推荐维护流程

### 三角洲行动

- 赛季前瞻阶段：先新增一条“前瞻”更新
- 正式上线当天：把 `currentVersion` 改成新赛季名
- 再新增一条正式更新，写清：新干员、新地图、新武器、新玩法、平衡性调整

### 鸣潮

- 大版本前瞻时：新增“上半 / 下半 / 前瞻”信息
- 卡池切换时：更新 `currentVersion`
- 如果只是补历史：优先改 `seed.ts`

## 对外发布

推荐部署方式：

- 前端：`Vercel`
- 数据库：`Neon / Supabase Postgres / Railway Postgres`

### 部署步骤

1. 把项目上传到 GitHub
2. 在云数据库平台创建一个 PostgreSQL 数据库
3. 拿到 `DATABASE_URL`
4. 在 Vercel 导入 GitHub 项目
5. 在 Vercel 配置环境变量：
   - `DATABASE_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
6. 首次部署后执行数据库初始化：

```bash
npm run db:push
npm run db:seed
```

如果你是在本地连线上数据库，也可以直接本地执行这两条命令。

## 以后怎么更新并让别人看到

部署完成后，你的流程会变成：

1. 打开线上网站的 `/login`
2. 登录后台
3. 修改游戏资料或新增更新记录
4. 保存后，别人访问你的网址就能直接看到最新内容

这就是长期维护模式，不需要每次重发代码。

## 后续建议

下一步很建议继续做这几项：

1. 给更新记录增加“来源链接”
2. 区分“正式更新”和“前瞻爆料”
3. 给 `/admin` 再加一层更严格的权限保护
4. 修复页面里还残留的中文乱码文本
