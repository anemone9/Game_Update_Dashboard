import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function upsertGameWithUpdates(params: {
  name: string
  description: string
  coverImage: string
  officialUrl: string
  currentVersion: string
  updates: Array<{
    version: string
    summary: string
    releaseDate: string
  }>
}) {
  const game = await prisma.game.upsert({
    where: { name: params.name },
    update: {
      description: params.description,
      coverImage: params.coverImage,
      officialUrl: params.officialUrl,
      currentVersion: params.currentVersion,
    },
    create: {
      name: params.name,
      description: params.description,
      coverImage: params.coverImage,
      officialUrl: params.officialUrl,
      currentVersion: params.currentVersion,
    },
  })

  await prisma.update.deleteMany({
    where: { gameId: game.id },
  })

  await prisma.update.createMany({
    data: params.updates.map((update) => ({
      gameId: game.id,
      version: update.version,
      summary: update.summary,
      releaseDate: new Date(update.releaseDate),
    })),
  })
}

async function main() {
  await upsertGameWithUpdates({
    name: '鸣潮',
    description:
      '开放世界动作 ARPG。站内版本信息改为基于中文社区与平台公告整理，优先展示国服版本节点与核心更新内容。',
    coverImage: '/wuthering-waves.jpg',
    officialUrl: 'https://mc.kurogames.com/',
    currentVersion: '3.3 下半｜自星海尽处回响',
    updates: [
      {
        version: '3.4 预测｜未选择的梦',
        summary:
          '基于《鸣潮》TapTap 官方 3.4 预约专题与前瞻结束后的高可信汇总，3.4 版本「未选择的梦」将于 2026 年 6 月 8 日上线。当前已基本确认与《赛博朋克：边缘行者》联动，上半高可信角色信息为“露西”登场、“丽贝卡”可通过版本活动免费获取；下半卡池与武器排期截至 2026 年 5 月 31 日仍待库洛后续正式公告确认。',
        releaseDate: '2026-06-08T11:00:00+08:00',
      },
      {
        version: '3.3 下半｜自星海尽处回响',
        summary:
          '2026 年 5 月 21 日 10:00 开启；3.3 版本第二期角色/武器活动唤取已上线，角色池为「予明日以谎言」达妮娅、「曙暮一线之间」千咲复刻与「挽歌永不落幕」弗洛洛复刻，武器池同步开放「赝作的矮星」「昙切」「幽冥的忘忧章」概率提升，持续至 2026 年 6 月 7 日 11:59（服务器时间）。本阶段仍承接 3.3 版本新增区域“黯原”、第三章“愿系铃中”“昨夜群星”、二周年庆活动与常驻玩法“勘探悖论之域”等主内容。',
        releaseDate: '2026-05-21T10:00:00+08:00',
      },
      {
        version: '3.3 上半｜自星海尽处回响',
        summary:
          '2026 年 4 月 30 日上线；3.3 版本「自星海尽处回响」正式开启，新增拉海洛区域“黯原”，包含“落日堤屿”“封存地”“寂静断崖”“恒黯之原”，并开放第三章“愿系铃中”“昨夜群星”与常驻玩法“勘探悖论之域”。上半卡池时间为 2026 年 4 月 30 日更新后至 2026 年 5 月 21 日 09:59（服务器时间），角色为“绯雪”并复刻“莫宁”“尤诺”，武器池包含“灼霜”“宙算仪轨”“万物持存的注释”。',
        releaseDate: '2026-04-30T11:00:00+08:00',
      },
      {
        version: '3.2 下半｜于影中启明的决心',
        summary:
          '2026 年 4 月 9 日开启；下半复刻角色为琳奈、赞妮、菲比，对应专武同步复刻，延续 3.2 主线、终焉矩阵与版本活动内容。',
        releaseDate: '2026-04-09',
      },
      {
        version: '3.2 上半｜于影中启明的决心',
        summary:
          '2026 年 3 月 19 日开启；上半新增 5 星共鸣者“西格莉卡”，并复刻仇远，开放第三章第四幕“影下不落的黄金”、潮汐续闻“影面颠倒的兔影”与高难玩法“终焉矩阵”。',
        releaseDate: '2026-03-19',
      },
      {
        version: '3.1 下半｜赠予雪中的你',
        summary:
          '2026 年 2 月 26 日开启；下半新增 5 星共鸣者“陆·赫斯”，并复刻嘉贝莉娜，延续冰原地区探索与 3.1 版本活动。',
        releaseDate: '2026-02-26',
      },
      {
        version: '3.1 上半｜赠予雪中的你',
        summary:
          '2026 年 2 月 5 日开启；上半新增 5 星共鸣者“爱弥斯”，并复刻千咲、露帕，开放“罗伊冰原·冰原地表”与第三章第三幕相关内容。',
        releaseDate: '2026-02-05',
      },
      {
        version: '3.0 下半｜我们生而眺望',
        summary:
          '2026 年 1 月 15 日开启；下半新增 5 星共鸣者“莫宁”，并复刻奥古斯塔、尤诺，补充 3.0 下半任务与拉海洛后续内容。',
        releaseDate: '2026-01-15',
      },
      {
        version: '3.0 上半｜我们生而眺望',
        summary:
          '2025 年 12 月 25 日开启；上半新增 5 星共鸣者“琳奈”，并复刻卡提希娅、恰空，开放全新地区“拉海洛”与 3.0 主线篇章。',
        releaseDate: '2025-12-25',
      },
      {
        version: '2.8 下半',
        summary:
          '2025 年 12 月 11 日开启；下半复刻弗洛洛、坎特蕾拉，并新增 4 星角色“卜灵”，补充 2.8 下半任务与活动内容。',
        releaseDate: '2025-12-11',
      },
      {
        version: '2.8 上半',
        summary:
          '2025 年 11 月 20 日开启；上半新增 5 星共鸣者“千咲”，并复刻菲比，开放 2.8 版本主线与穗波相关探索内容。',
        releaseDate: '2025-11-20',
      },
      {
        version: '2.7 下半',
        summary:
          '2025 年 10 月 30 日开启；下半新增 5 星共鸣者“仇远”，并复刻赞妮，补充 2.7 下半活动与战斗内容。',
        releaseDate: '2025-10-30',
      },
      {
        version: '2.7 上半',
        summary:
          '2025 年 10 月 9 日开启；上半新增 5 星共鸣者“嘉贝莉娜”，并复刻露帕，推进 2.7 主线与版本活动。',
        releaseDate: '2025-10-09',
      },
      {
        version: '2.6 下半｜日以灼锋，月以流明',
        summary:
          '2025 年 9 月 17 日开启；下半新增 5 星共鸣者“尤诺”，并复刻恰空，延续“桑古伊斯狩原”与版本事件内容。',
        releaseDate: '2025-09-17',
      },
      {
        version: '2.6 上半｜日以灼锋，月以流明',
        summary:
          '2025 年 8 月 28 日开启；上半新增 5 星共鸣者“奥古斯塔”，并复刻珂莱塔、守岸人，开放“桑古伊斯狩原”并补充第二章第八幕与第九幕剧情。',
        releaseDate: '2025-08-28',
      },
      {
        version: '2.5 下半｜生命不灭的轻歌',
        summary:
          '2025 年 8 月 14 日开启；下半上线坎特蕾拉与布兰特卡池，延续 2.5 活动与彼岸之境相关内容。',
        releaseDate: '2025-08-14',
      },
      {
        version: '2.5 上半｜生命不灭的轻歌',
        summary:
          '2025 年 7 月 24 日开启；上半新增 5 星共鸣者“弗洛洛”，并复刻洛可可，开放 2.5 版本主线与活动。',
        releaseDate: '2025-07-24',
      },
      {
        version: '2.4 下半｜轻掷欢呼之冕',
        summary:
          '2025 年 7 月 3 日开启；下半新增 5 星共鸣者“露帕”，补充 2.4 下半探索、任务与战斗内容。',
        releaseDate: '2025-07-03',
      },
      {
        version: '2.4 上半｜轻掷欢呼之冕',
        summary:
          '2025 年 6 月 12 日开启；上半新增 5 星共鸣者“卡提希娅”，开放新区域与 2.4 版本主线内容。',
        releaseDate: '2025-06-12',
      },
      {
        version: '2.3 下半｜焰行夏曲庆“团”圆',
        summary:
          '2025 年 5 月 22 日开启；下半新增 5 星共鸣者“恰空”，并开启周年庆第二阶段复刻：今汐、长离、珂莱塔、洛可可、布兰特。',
        releaseDate: '2025-05-22',
      },
      {
        version: '2.3 上半｜焰行夏曲庆“团”圆',
        summary:
          '2025 年 4 月 29 日开启；上半新增 5 星共鸣者“赞妮”，并开启周年庆第一阶段复刻：忌炎、吟霖、折枝、相里要、菲比。',
        releaseDate: '2025-04-29',
      },
      {
        version: '2.2 下半｜真伪倒悬于高塔',
        summary:
          '2025 年 4 月 17 日开启；下半复刻守岸人，延续阿维纽林探索与 2.2 版本活动内容。',
        releaseDate: '2025-04-17',
      },
      {
        version: '2.2 上半｜真伪倒悬于高塔',
        summary:
          '2025 年 3 月 27 日开启；上半新增 5 星共鸣者“坎特蕾拉”，并复刻椿，开放新区域“阿维纽林”与 2.2 主线内容。',
        releaseDate: '2025-03-27',
      },
      {
        version: '2.1 下半｜飞鸟轻鸣，浪涛欢唱',
        summary:
          '2025 年 3 月 6 日开启；下半新增 5 星共鸣者“布兰特”，并复刻长离，补充 2.1 后续活动与剧情。',
        releaseDate: '2025-03-06',
      },
      {
        version: '2.1 上半｜飞鸟轻鸣，浪涛欢唱',
        summary:
          '2025 年 2 月 13 日开启；上半新增 5 星共鸣者“菲比”，开放 2.1 版本主线、海域玩法与活动内容。',
        releaseDate: '2025-02-13',
      },
      {
        version: '2.0 下半｜致缄默以欢歌',
        summary:
          '2025 年 1 月 23 日开启；下半新增 5 星共鸣者“洛可可”，并复刻今汐，延续黎那汐塔地区任务与探索。',
        releaseDate: '2025-01-23',
      },
      {
        version: '2.0 上半｜致缄默以欢歌',
        summary:
          '2025 年 1 月 2 日开启；上半新增 5 星共鸣者“珂莱塔”，并复刻折枝，开放黎那汐塔地区与 2.0 新篇章。',
        releaseDate: '2025-01-02',
      },
      {
        version: '1.4 下半｜暗夜叩响白昼之门',
        summary:
          '2024 年 12 月 12 日开启；下半复刻吟霖、相里要，延续 1.4 剧情与版本活动内容。',
        releaseDate: '2024-12-12',
      },
      {
        version: '1.4 上半｜暗夜叩响白昼之门',
        summary:
          '2024 年 11 月 14 日开启；上半新增 5 星共鸣者“椿”，推进 1.4 版本主线与角色内容。',
        releaseDate: '2024-11-14',
      },
      {
        version: '1.3 下半｜至海渊而远望',
        summary:
          '2024 年 10 月 24 日开启；下半复刻忌炎，延续黑海岸相关剧情与活动内容。',
        releaseDate: '2024-10-24',
      },
      {
        version: '1.3 上半｜至海渊而远望',
        summary:
          '2024 年 9 月 29 日开启；上半新增 5 星共鸣者“守岸人”，开放黑海岸区域与 1.3 主线内容。',
        releaseDate: '2024-09-29',
      },
      {
        version: '1.2 下半｜天上月华人如愿',
        summary:
          '2024 年 9 月 7 日开启；下半新增 5 星共鸣者“相里要”，并配套上线其专属活动与版本后续内容。',
        releaseDate: '2024-09-07',
      },
      {
        version: '1.2 上半｜天上月华人如愿',
        summary:
          '2024 年 8 月 15 日开启；上半新增 5 星共鸣者“折枝”，开启 1.2 版本活动与新剧情内容。',
        releaseDate: '2024-08-15',
      },
      {
        version: '1.1 下半｜往岁乘霄醒惊蛰',
        summary:
          '2024 年 7 月 22 日开启；下半新增 5 星共鸣者“长离”，延续 1.1 主线与版本活动内容。',
        releaseDate: '2024-07-22',
      },
      {
        version: '1.1 上半｜往岁乘霄醒惊蛰',
        summary:
          '2024 年 6 月 28 日开启；上半新增 5 星共鸣者“今汐”，开放 1.1 版本主线与相关活动。',
        releaseDate: '2024-06-28',
      },
      {
        version: '1.0 下半｜公测开服',
        summary:
          '2024 年 6 月 6 日开启；下半新增 5 星共鸣者“吟霖”，作为公测版本第二阶段卡池登场。',
        releaseDate: '2024-06-06',
      },
      {
        version: '1.0 上半｜公测开服',
        summary:
          '2024 年 5 月 23 日开启；鸣潮国服公测，上半首发 5 星角色为“忌炎”，同步开放主线、世界探索与基础系统。',
        releaseDate: '2024-05-23',
      },
    ],
  })

  await upsertGameWithUpdates({
    name: '三角洲行动',
    description:
      '战术射击游戏。站内赛季内容改为结合 TapTap、哔哩哔哩等中文平台整理，展示国服赛季名称、更新时间与重点玩法更新。',
    coverImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2507950/header.jpg',
    officialUrl: 'https://df.qq.com/',
    currentVersion: 'S9 回声',
    updates: [
      {
        version: 'S10 预测',
        summary:
          '基于 S7（2025 年 11 月 13 日）、S8（2026 年 1 月 29 日）、S9（2026 年 4 月 16 日）连续约 77 天的赛季更替节奏推算，《三角洲行动》下次大版本较高概率会落在北京时间 2026 年 7 月 2 日凌晨 3 点左右。若官方继续维持周四清晨更新习惯，新赛季大概率会带来新干员、新地图与一轮烽火地带/全面战场玩法轮换，但截至 2026 年 5 月 31 日尚无正式命名与前瞻公告。',
        releaseDate: '2026-07-02T03:00:00+08:00',
      },
      {
        version: 'S9 回声｜5 月 21 日季中平衡性调整',
        summary:
          '2026 年 5 月 21 日上线；S9「回声」赛季迎来季中平衡性调整，烽火地带与全面战场多把热门武器被重做强度曲线，包括 AK7、MK47、K437、MP7、QBZ95-1、M82 与复合弓；露娜、乌鲁鲁、伊织、威龙、蝶、深蓝等干员同步迎来技能冷却、伤害或功能修正。哈夫克河道与阿斯亚迪尔部分攻防点位也完成优化，并配套开放史诗武器外观与 520/季中福利活动。',
        releaseDate: '2026-05-21',
      },
      {
        version: 'S9 回声',
        summary:
          '2026 年 4 月 16 日上线；新赛季“回声”已开启，新增侦察干员“回响”、全面战场新地图“乌姆斯运河”、M82 狙击步枪与 AR57 突击步枪，并加入烽火地带新模式、新玩法、特勤处新系统、赛季通行证与大量平衡优化。官方后续确认了近战武器“坠星者”、脑机扫描任务结算、移动端跟随开火等异常问题的修复进度。',
        releaseDate: '2026-04-16T03:00:00+08:00',
      },
      {
        version: 'S8 蝶变时刻',
        summary:
          '2026 年 1 月 29 日上线；新增支援型干员“蝶”、全面战场新地图“余震”、烽火地带“航天基地 2.0”与新玩法“赤枭巡猎”。',
        releaseDate: '2026-01-29',
      },
      {
        version: 'S7 阿萨拉',
        summary:
          '2025 年 11 月 13 日上线；新增工程型干员“比特”、全面战场新地图“金字塔”、烽火地带事件“零号大坝-水淹”以及玩法“超感追查”。',
        releaseDate: '2025-11-13',
      },
      {
        version: 'S6 烈火冲天',
        summary:
          '2025 年 9 月 17 日上线；新增侦察干员“银翼”、全面战场新地图“断层”与潮汐监狱新首领“典狱长”，赛季主题围绕高机动与火力压制展开。',
        releaseDate: '2025-09-17',
      },
      {
        version: 'S5 破壁',
        summary:
          '2025 年 7 月 3 日上线；新增突击型干员“疾风”、烽火地带新地图“潮汐监狱”、全面战场新地图“风暴眼”，并加入“越狱玩法”、游泳系统、新载具与新武器。',
        releaseDate: '2025-07-03',
      },
      {
        version: 'S4 黑夜之子',
        summary:
          '2025 年 4 月 17 日上线；新增突击型干员“无名”、夜战玩法与“胜者为王”限时玩法。社区攻略同步确认本赛季加入 K437 等新枪内容。',
        releaseDate: '2025-04-17',
      },
      {
        version: 'S3 焰火',
        summary:
          '2025 年 1 月 15 日上线；新增工程型干员“阿列克谢”、限时玩法“红鼠窝竞技场”，官方前瞻同时提到新武器、新地图与大坝地下区域等内容同步开放。',
        releaseDate: '2025-01-15',
      },
      {
        version: 'S2 聚变',
        summary:
          '2024 年 11 月 21 日上线；新增支援型干员“佐娅”、烽火地带巴克什新区域“巴别塔”、全面战场新地图“堑壕战”与合作模式新地图“衔尾蛇”，并加入新武器。',
        releaseDate: '2024-11-21',
      },
      {
        version: 'S1 起源',
        summary:
          '2024 年 9 月 26 日随国服正式上线开启；开放全面战场、烽火地带与黑鹰坠落等核心玩法，起源赛季通行证奖励包含特战干员“麦晓雯”等首发内容。',
        releaseDate: '2024-09-26',
      },
    ],
  })

  await upsertGameWithUpdates({
    name: '无畏契约',
    description:
      '5v5 战术射击游戏版本信息，站内以 Riot 官方主线补丁说明为主，兼顾中文玩家常关注的地图轮换、Premier 赛段与系统改动。',
    coverImage: '/valorant.jpg',
    officialUrl: 'https://val.qq.com/',
    currentVersion: '12.10',
    updates: [
      {
        version: '12.10',
        summary:
          '2026 年 5 月 27 日上线；12.10 为轻量更新，新增“好友回放分享”功能，可直接从好友生涯页观看符合条件的回放；电竞侧同步上线 Masters London Pick’Ems。模式方面，Skirmish: Ascension 新增 D/E 两张地图并开放全部可选特务，同时修复 Miks、Harbor、商店与加赛计时器等一批问题。',
        releaseDate: '2026-05-27T21:00:00+08:00',
      },
      {
        version: '12.09',
        summary:
          '2026 年 5 月 13 日上线；12.09 核心为强力平衡补丁，重点削弱霓虹在空中的机动与滚雪球能力，并统一下调 Bucky、Judge、Shorty 等霰弹枪在移动、跳跃和绳索状态下的命中稳定性。PC 端还加入 AMD Anti-Lag 2 支持，并修复多名特务、每日任务、文本治理与模式显示相关问题。',
        releaseDate: '2026-05-13T01:00:00+08:00',
      },
      {
        version: '12.08｜V26 第三章',
        summary:
          '2026 年 4 月 29 日开启第三章；新增限时竞技模式“Skirmish: Ascension”，带来 1v1/2v2 阶梯式武器轮换对抗与 FTW 排行榜奖励；竞技与死斗地图池改为 Ascent 回归、Bind 暂离，Premier V26A3 赛段同步回归。',
        releaseDate: '2026-04-29T01:00:00+08:00',
      },
      {
        version: '12.06',
        summary:
          '2026 年 3 月 31 日上线；重点调整维蕾“浸染”的施放风险与联动强度，优化薇蝮大招稳定性，炫技跑速同步到近战速度，并修复商店、结算画面与多项特务交互问题。',
        releaseDate: '2026-03-31',
      },
      {
        version: '12.05｜V26 第二章',
        summary:
          '2026 年 3 月 18 日开启第二章；新控场特务“米克什”登场，新增助攻横幅、状态效果标签与击杀通知强化，莲华古城回归并调整 A 区结构，同时上线全新限时模式“歼灭战”，并对夜戮、珂乐芙、丝凯等特务做出平衡改动。',
        releaseDate: '2026-03-18',
      },
      {
        version: '12.00｜2026 赛季开幕',
        summary:
          '2026 年 1 月 7 日开启；官方将其定义为“内容相当庞大”的年度版本，推出 2026 赛季第一章、重做后的热带乐园、全新武器“盜賊”、自订大厅界面翻新与社交面板改版，并同步开启 V26 第一章 Premier 赛段。',
        releaseDate: '2026-01-07',
      },
      {
        version: '11.11',
        summary:
          '2025 年 12 月 2 日上线；作为年末收束版本，主要加入小型 UI 调整、错误修复、特务币赠礼功能以及节庆内容预告，为 2026 赛季切换做准备。',
        releaseDate: '2025-12-02',
      },
      {
        version: '11.02｜UE5 引擎升级',
        summary:
          '2025 年 7 月 29 日上线；游戏引擎正式从 Unreal Engine 4.27 升级到 Unreal Engine 5.3，安装体积下降、后续内容开发空间扩大，并同步修复一批地图、特务与 UI 问题。',
        releaseDate: '2025-07-29',
      },
      {
        version: '11.00｜第四章开幕',
        summary:
          '2025 年 6 月 24 日开启第四章；新地图“晶蚀之地”加入，竞技地图池与赛季节奏同步更新，年度中盘版本围绕地图轮换、战斗体验和赛段重置展开。',
        releaseDate: '2025-06-24',
      },
      {
        version: '10.00｜第五幕第一章',
        summary:
          '2025 年 1 月 7 日上线；新特务“戴侯”登场，竞赛结构与赛段奖励同步更新，并对战术回放、社交体验和部分武器/特务平衡做出年度首轮调整。',
        releaseDate: '2025-01-07',
      },
      {
        version: '9.00｜第九幕第一章',
        summary:
          '2024 年 6 月 25 日开启；第九幕第一章带来新赛段、英雄平衡与系统调校，重点围绕防守型英雄对局节奏、地图池与排位环境展开。',
        releaseDate: '2024-06-25',
      },
      {
        version: '8.11｜深窟幽境',
        summary:
          '2024 年 6 月 11 日上线；新地图“深窟幽境”进入竞技与死斗轮换，地图池同步洗牌，并伴随一轮常规平衡和体验修复。',
        releaseDate: '2024-06-11',
      },
      {
        version: '8.05｜珂乐芙登场',
        summary:
          '2024 年 3 月 26 日上线；全新控场特务“珂乐芙”实装，其“阵亡后仍可放烟与复活博弈”的独特机制成为该版本核心；同时更新 Premier 验证与语音标示显示逻辑。',
        releaseDate: '2024-03-26',
      },
      {
        version: '8.00｜第八幕第一章',
        summary:
          '2024 年 1 月 9 日开启；新武器“逃犯”上线，极地寒港与莲华古城同步大改回归，并正式支持第三方空间音效方案，成为 2024 年度内容起点。',
        releaseDate: '2024-01-09',
      },
      {
        version: '2023-07-12｜国服正式上线',
        summary:
          '2023 年 7 月 12 日，无畏契约国服正式开服。腾讯接入国服运营后，首批开放标准竞技、排位与商城体系，国服内容此后逐步追平全球主线版本。',
        releaseDate: '2023-07-12',
      },
    ],
  })

  await upsertGameWithUpdates({
    name: '异环',
    description:
      '超自然都市开放世界 RPG。站内信息以《异环》官方预约页与官方论坛公告为主，优先展示国服测试、公测节点与核心玩法变化。',
    coverImage: '/yihuan.jpg',
    officialUrl: 'https://www.taptap.cn/app/714119',
    currentVersion: '1.1 上半｜游梦洄廊',
    updates: [
      {
        version: '1.1 下半｜游梦洄廊',
        summary:
          '基于《异环》TapTap 官方 1.1 版本日历，1.1 下半阶段将于 2026 年 6 月 18 日开启。下半限定棋盘为「无烬路」，核心 S 级角色为“卡厄斯”，对应弧盘研募计划为「追猎特刊」，S 级弧盘“众人追寻之物”将同步概率提升，持续至 2026 年 7 月 2 日。版本主内容仍延续“向阳岛”、异象“洄廊”与 1.1 期间开放的各类联动活动。',
        releaseDate: '2026-06-18T06:00:00+08:00',
      },
      {
        version: '1.1 上半｜游梦洄廊',
        summary:
          '2026 年 5 月 28 日版本更新后开启；《异环》进入公测后的首个大版本 1.1「游梦洄廊」，新增正篇剧情、全新场景“向阳岛”与异象“洄廊”，并同步开放保时捷联动、格斗俱乐部、黑暗赛车等玩法内容。上半限定棋盘「久梦初醒时」开放至 2026 年 6 月 18 日 05:59，S 级角色为“安魂曲”，A级同池角色为“薄荷”“埃德嘉”“阿德勒”，配套 S 级弧盘为“最后一朵玫瑰”。',
        releaseDate: '2026-05-28T11:00:00+08:00',
      },
      {
        version: '1.0 上半｜全平台公测',
        summary:
          '2026 年 4 月 23 日 10:00 开启；《异环》1.0 国服全平台公测正式上线，主舞台为海特洛市，开放“海特洛·桥间地”等探索内容，可进行异象委托、拍照打卡与鬼火摩托相关收集。上半卡池时间为 2026 年 4 月 23 日至 2026 年 5 月 7 日，首期限定 UP 角色为“娜娜莉”；下半卡池时间为 2026 年 5 月 7 日至 2026 年 5 月 28 日，第二期 UP 角色为“浔”，配套 S 级弧盘为“行进于时间之外”。公测同步开放 PC、安卓、iOS 多端互通，以及都市探索、车辆驾驶与居住经营等核心玩法。',
        releaseDate: '2026-04-23T10:00:00+08:00',
      },
      {
        version: '共存测试',
        summary:
          '2026 年 2 月 4 日 10:00 开启；本次为限量计费删档测试，覆盖 PC、安卓与 iOS，并明确于 2026 年 2 月 18 日 23:59 结束。官方借这轮测试集中验证跨端体验、都市探索与商业化返还规则。',
        releaseDate: '2026-02-04T10:00:00+08:00',
      },
      {
        version: '收容测试',
        summary:
          '2025 年 6 月 26 日开启；《异环》首次大规模测试节点落地，围绕海特洛市探索、异能战斗、载具驾驶与都市沉浸感收集首轮系统反馈，也为后续优化清单与测试扩容打下基础。',
        releaseDate: '2025-06-26',
      },
      {
        version: '首曝 PV｜预约开启',
        summary:
          '2024 年 7 月 16 日公开；Hotta Studio 首次放出《异环》PV 与长段实机演示，并同步开启预约。官方首次完整展示“超自然都市开放世界”定位、海特洛市舞台、异象猎人设定，以及无缝城市穿梭与室内外切换等核心卖点。',
        releaseDate: '2024-07-16',
      },
    ],
  })

  await upsertGameWithUpdates({
    name: 'CS2',
    description:
      '《反恐精英 2》中文区信息聚合，优先展示 Valve 官方公告、Steam 社区更新与中文社区整理过的重点内容，不加入预测倒计时。',
    coverImage: '/cs2.jpg',
    officialUrl: 'https://www.csgo.com.cn/',
    currentVersion: '第四赛季',
    updates: [
      {
        version: '2026-02-25 更新',
        summary:
          '2026 年 2 月 25 日更新；这是目前官方可查的最新 CS2 更新，重点面向地图脚本与社区创作工具：新增 Workshop 地图存档读写、伤害回调和 hitgroup 相关接口，并修复 de_ancient 与 de_ancient_night 的地图导览兼容问题。作为第四赛季期间的后续维护，它延续了 Valve 对社区地图生态与底层工具链的持续更新。',
        releaseDate: '2026-02-25',
      },
      {
        version: '2026-01-22｜第四赛季',
        summary:
          'Valve 于北京时间 2026 年 1 月 22 日开启第四赛季；Anubis 回归并做出多处地图改动，SMG 价格与定位微调，新增社区地图 Stronghold、Alpine、Warren、Poseidon、Sanctum，周常补给包加入两套新收藏，军械库追加 AK-47 | Aphrodite。',
        releaseDate: '2026-01-22',
      },
      {
        version: '2025-11-05｜Introducing TrueView',
        summary:
          '北京时间 2025 年 11 月 5 日上线；官方为 Demo 回放加入 TrueView 视角，让观战与复盘能更准确跟随选手准星与视线，提升赛事分析和个人复盘体验。',
        releaseDate: '2025-11-05',
      },
      {
        version: '2025-10-22｜Re-Retakes',
        summary:
          '2025 年 10 月 22 日上线；Retakes 玩法回归官方更新主轴，围绕回防攻防的节奏、出生点与地图支持做出一轮集中调整，强化短局训练与娱乐匹配体验。',
        releaseDate: '2025-10-22',
      },
      {
        version: '2025-10-01｜Community Maps, Charms, and More',
        summary:
          '2025 年 10 月 1 日上线；加入一批新的官方社区地图，军械库同步扩充 charms、2025 社区贴纸和其他可兑换内容，并继续完善观战和地图脚本相关细节。',
        releaseDate: '2025-10-01',
      },
      {
        version: '2025-03-31｜Spring Forward',
        summary:
          '2025 年 3 月 31 日上线；周常补给包新增 Ascent、Boreal、Radiant 三套收藏，Inferno 与 Train 做了“春季清理”，军械库加入 Fever Case、Train 2025 Collection 和限时 XM1014 | Solitude。',
        releaseDate: '2025-03-31',
      },
      {
        version: '2025-01-29｜第二赛季调整',
        summary:
          '2025 年 1 月 29 日前后进入第二赛季主线；Train 回归取代 Vertigo，M4A4 降价，FAMAS 站立/蹲伏精度与价格同步调整，Premier 页面开始展示上一赛季的 CSR 与地图统计。',
        releaseDate: '2025-01-29',
      },
      {
        version: '2024-10-03｜The Armory',
        summary:
          '2024 年 10 月 3 日上线；“军械库”系统正式实装，开放 Armory Pass 与积分兑换，首发 3 套武器收藏、2 套挂饰收藏、2 套贴纸收藏、Gallery Case 与 Heat Treated Desert Eagle，同时首次把武器挂饰带进 CS2。',
        releaseDate: '2024-10-03',
      },
      {
        version: '2024-06-26｜社区地图轮换',
        summary:
          '2024 年 6 月 26 日上线；社区地图 Thera、Mills 进入 Competitive/Casual/Deathmatch，配合 MVP 面板与视频选项改进，延续 Source 2 上线后的地图池扩展节奏。',
        releaseDate: '2024-06-26',
      },
      {
        version: '2024-02-07｜A Call to Arms',
        summary:
          '2024 年 2 月 7 日上线；Arms Race 回归，Kilowatt Case 作为 CS2 首个新武器箱登场，Kukri Knife 与 Zeus 皮肤首次加入，贴纸改为自由摆放且最多可贴 5 张，同时带来 Baggage 与 Shoots 等地图内容更新。',
        releaseDate: '2024-02-07',
      },
      {
        version: '2023-11-03｜工坊与社区地图回归',
        summary:
          '2023 年 11 月 3 日前后，Valve 重新开放 CS2 地图工坊与社区地图支持，标志着自定义地图生态开始回到 CS2 主线版本中。',
        releaseDate: '2023-11-03',
      },
      {
        version: '2023-09-28｜CS2 正式上线',
        summary:
          '2023 年 9 月 28 日，CS2 取代 CS:GO 正式上线；Source 2、Sub-tick 网络架构、体积烟雾重做与画面升级成为版本核心，也为后续赛季与内容更新打下基础。',
        releaseDate: '2023-09-28',
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
