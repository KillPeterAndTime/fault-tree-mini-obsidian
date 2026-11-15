# Fault Tree Mini

Draw, quantify, and store fault trees (FTA) directly inside your Obsidian vault. Click the ribbon icon to open the editor — your diagrams live in the vault, just like [draw.io for Obsidian](https://github.com/zapthudrawio?utm_source=obsidian).

> Standalone browser version (single HTML file): https://github.com/KillPeterAndTime/fault-tree-mini

## Features

- **Drag-and-drop drawing** — top events, intermediate events, basic events, undeveloped events, house events, and OR / AND / voting (k/n) gates with standard FTA symbols (IEC 61025 / GB/T 4888-2009 conventions) and orthogonal bus-style connectors
- **Exact quantification** — failure rate λ × mission time t conversion; OR sum / AND intersection / voting gate computation. When basic events are shared across gates, the tool switches automatically to **exact ROBDD** solving
- **ARP4761A target checking** — pick a failure condition class for the top event and compare the per-flight-hour probability target with a ✓/✗ badge
- **Vault storage** — projects are saved as `.fta.json` notes in a folder of your choice, ready to be referenced, synced, and version-controlled
- **Export** — SVG (vector) and PNG (2× resolution) exported into the vault for embedding in notes
- **Canvas navigation** — zoom controls, fit view (F), locate top event (T), middle-button pan, auto layout

## Installation

**Community plugins (recommended once approved)**

1. Open **Settings → Community plugins**
2. Turn off Restricted mode, click **Browse**, search for "Fault Tree Mini"
3. Click **Install**, then **Enable**

**BRAT**

```
BRAT → Add Beta plugin → KillPeterAndTime/fault-tree-mini-obsidian
```

**Manual installation**

1. Download `manifest.json`, `main.js`, `styles.css`, and `versions.json` from the latest release
2. Copy them to `<vault>/.obsidian/plugins/fault-tree-mini/`
3. Restart Obsidian → **Settings → Community plugins** → enable **Fault Tree Mini**

## Usage

1. Click the **fault tree icon** in the left sidebar (or run "Open Fault Tree Editor" from the command palette)
2. Drag nodes from the library on the left; drag the dot below a node to connect gates
3. `Ctrl+S` saves the project into the vault folder (you will be asked for a name the first time); **Open** lists all `.fta.json` projects in the vault
4. Exported PNG/SVG files are stored in the same folder — drag them straight into any note

## Settings

- **Save folder** — where projects and exported images are stored (vault root by default; e.g. `attachments/fault-trees`)

## Relation to the browser version

The editor core is identical to the [standalone browser version](https://github.com/KillPeterAndTime/fault-tree-mini) (`editor.html` is generated from the main repo's `index.html` by `build-editor.js`). The `.fta.json` file format is fully compatible in both directions.

## 中文说明

在 Obsidian 笔记库中直接绘制、计算和存储故障树（FTA）。左侧边栏点图标即可打开编辑器。

- **拖拽绘制**：顶事件、中间事件、基本事件、未展开事件、房形事件、OR / AND / 表决门（k/n），标准 FTA 符号（IEC 61025 / GB/T 4888-2009 惯例），直角总线式连线
- **定量计算**：失效率 λ + 任务时间 t 换算；存在共用底事件时自动切换 **ROBDD 精确求解**
- **ARP4761A 目标判定**：顶事件选失效状态等级后自动比对每飞行小时概率目标（✓/✗ 徽标）
- **Vault 存储**：项目以 `.fta.json` 保存到笔记库指定文件夹
- **导出**：SVG（矢量）与 PNG（2× 清晰度）导出到库

**安装**：设置 → 第三方插件 → 浏览 → 搜索 "Fault Tree Mini"；或用 BRAT 添加 `KillPeterAndTime/fault-tree-mini-obsidian`；或手动下载 Release 中的 `manifest.json`、`main.js`、`styles.css`、`versions.json` 放入 `<库>/.obsidian/plugins/fault-tree-mini/` 后启用。

**使用**：左侧边栏点击故障树图标 → 从元件库拖入节点并连接 → `Ctrl+S` 保存到库内文件夹 → 导出的 PNG/SVG 直接拖进笔记。

## Roadmap

- [ ] ` ```fta ` code block rendering (read-only preview inside notes)
- [ ] Minimal cut sets (MCS) and Fussell-Vesely importance
- [ ] Open-PSA Model Exchange Format import/export
- [x] Submit to the official Obsidian community plugin directory

## License

MIT — same as the main project.
