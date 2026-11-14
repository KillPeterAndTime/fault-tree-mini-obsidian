# Fault Tree Mini for Obsidian

在 Obsidian 笔记库中直接绘制、计算和存储故障树（FTA）。左侧边栏点图标即可打开编辑器，体验与 [draw.io 插件](https://github.com/zapthudrawio?utm_source=obsidian) 类似——图在笔记库里，不离开你的知识库。

> 主项目（浏览器单文件版）：https://github.com/KillPeterAndTime/fault-tree-mini

## 功能

- **拖拽绘制**：顶事件、中间事件、基本事件、未展开事件、房形事件、OR / AND / 表决门（k/n），标准 FTA 符号（IEC 61025 / GB/T 4888-2009 惯例），直角总线式连线
- **定量计算**：失效率 λ + 任务时间 t 换算，OR 求和 / AND 交集 / 表决门精确计算；存在共用底事件时自动切换 **ROBDD 精确求解**
- **ARP4761A 目标判定**：顶事件选失效状态等级后自动比对每飞行小时概率目标（✓/✗ 徽标）
- **Vault 存储**：项目以 `.fta.json` 保存到笔记库指定文件夹，可被其他笔记引用、同步、版本管理
- **导出**：SVG（矢量）与 PNG（2× 清晰度）导出到库，方便插入笔记
- **画布导航**：缩放控制条、适应视图（F）、顶事件定位（T）、中键平移、自动布局

## 安装

**方式一：手动安装（当前推荐）**

1. 下载本文件夹的全部文件（`manifest.json`、`main.js`、`styles.css`、`editor.html`、`versions.json`）
2. 放入你的笔记库：`<库>/.obsidian/plugins/fault-tree-mini/`
3. 重启 Obsidian → 设置 → 第三方插件 → 启用 **Fault Tree Mini**

**方式二：BRAT**

```
BRAT → Add Beta plugin → KillPeterAndTime/fault-tree-mini-obsidian
```

**方式三：社区市场（审核中）**

已提交至 Obsidian 官方社区插件市场，审核通过后可在 设置 → 第三方插件 → 浏览 中直接搜索 "Fault Tree Mini" 安装。

## 使用

1. 左侧边栏点击 **故障树图标**（或命令面板执行「打开故障树编辑器」）
2. 从左侧元件库拖入节点，拖动节点底部圆点建立逻辑连接
3. `Ctrl+S` 保存到库内文件夹（首次会要求命名）；「打开」会列出库内全部 `.fta.json`
4. 导出的 PNG/SVG 保存在同一文件夹，直接拖进笔记即可

## 设置

- **保存文件夹**：项目与导出图片的存放位置（默认库根目录），建议设为 `附件/故障树`

## 与浏览器版的关系

编辑器内核与 [浏览器单文件版](https://github.com/KillPeterAndTime/fault-tree-mini) 完全一致（`editor.html` 由主仓库 `index.html` 通过 `build-editor.js` 自动生成），文件格式互相兼容——浏览器版保存的 `.fta.json` 拖进库即可打开，反之亦然。

## Roadmap

- [ ] ` ```fta ` 代码块渲染只读预览（嵌入笔记正文）
- [ ] 最小割集（MCS）与 Fussell-Vesely 重要度
- [ ] Open-PSA Model Exchange Format 导入导出
- [x] 提交 Obsidian 官方社区插件市场（审核中）

## 许可

MIT — 同主项目。
