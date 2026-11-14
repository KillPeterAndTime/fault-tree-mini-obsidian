#!/usr/bin/env node
/*
 * build-editor.js — 从主仓库 index.html 生成 Obsidian 内嵌版 editor.html
 *
 * 生成逻辑：
 * 1. 读取 ../GitHub/index.html（或命令行传入的路径）
 * 2. 补丁①：启动时 localStorage 访问加 try/catch（沙箱 iframe 中可能被禁止）
 * 3. 注入②：Obsidian 桥接脚本 —— 覆盖 saveFile/openFile/exportSvgFile/exportPng，
 *    通过 postMessage 把文件读写交给宿主插件（写入 Vault）
 * 4. 写出 fault-tree-mini/editor.html
 *
 * 用法：node build-editor.js [index.html 路径]
 * 主仓库 index.html 更新后，重新运行本脚本即可同步。
 */
"use strict";
const fs = require("fs");
const path = require("path");

const here = __dirname;
const defaultSrc = path.join(here, "..", "GitHub", "index.html");
const srcPath = process.argv[2] || defaultSrc;
const outPath = path.join(here, "fault-tree-mini", "editor.html");

let html = fs.readFileSync(srcPath, "utf8");

/* ---- 补丁①：localStorage 启动守卫 ---- */
const initGuardFrom = "const saved = localStorage.getItem(LS_KEY);";
const initGuardTo =
  "let saved = null; try { saved = localStorage.getItem(LS_KEY); } catch (e) {}";
if (!html.includes(initGuardFrom)) {
  console.error("✗ 未找到启动 localStorage 代码（index.html 可能已变更，请人工核对）");
  process.exit(1);
}
html = html.replace(initGuardFrom, initGuardTo);

/* ---- 注入②：Obsidian 桥接脚本 ---- */
const bridge = `<script>
/* ===== Obsidian 桥接：文件 IO 走宿主 Vault（仅嵌入模式生效，浏览器直开不受影响） ===== */
(function () {
  if (window.parent === window) return;
  const post = (m) => window.parent.postMessage(m, "*");

  window.addEventListener("message", (ev) => {
    const d = ev.data || {};
    if (d.type === "fta:load") {
      try {
        deserialize(d.content);
        fileHandle = null; savedOnce = true;
        clearDirty(); renderAll(); showProps(); fitView();
        $("st-msg").textContent = "\\u2713 已打开 " + fileName;
      } catch (e) { alert("打开失败：" + e.message); }
    } else if (d.type === "fta:save-done") {
      fileName = d.name; $("file-name").textContent = fileName;
      clearDirty();
      $("st-msg").textContent = "\\u2713 已保存 " + fileName;
    }
  });

  /* 保存：首次/另存为 → 弹出宿主命名对话框；之后 → 静默写回同一文件 */
  window.saveFile = function (saveAs) {
    if (!saveAs && savedOnce) post({ type: "fta:save", name: fileName, content: serialize() });
    else post({ type: "fta:save-as-dialog", suggested: fileName, content: serialize() });
  };
  window.openFile = function () { post({ type: "fta:open-dialog" }); };

  window.exportSvgFile = function () {
    if (!Object.keys(nodes).length) return warn("画布为空");
    const s = buildExportSvg();
    post({ type: "fta:export-svg", name: fileName.replace(/\\.json$/, ""), content: new XMLSerializer().serializeToString(s) });
  };

  window.exportPng = function () {
    if (!Object.keys(nodes).length) return warn("画布为空");
    try {
      const s = buildExportSvg();
      const xml = new XMLSerializer().serializeToString(s);
      const img = new Image();
      const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
      img.onload = () => {
        try {
          const scale = 2;
          const c = document.createElement("canvas");
          c.width = img.width * scale; c.height = img.height * scale;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          post({ type: "fta:export-png", name: fileName.replace(/\\.json$/, ""), dataUrl: c.toDataURL("image/png") });
        } catch (e) { alert("PNG 导出失败：" + e.message); }
      };
      img.onerror = () => alert("PNG 导出失败：SVG 渲染错误");
      img.src = url;
    } catch (e) { alert("PNG 导出失败：" + e.message); }
  };

  post({ type: "fta:bridge-ready" });
})();
</script>
</body>`;

if (!html.includes("</body>")) { console.error("✗ 未找到 </body>"); process.exit(1); }
html = html.replace("</body>", bridge);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log("✓ 已生成 " + outPath + " (" + fs.statSync(outPath).size + " bytes)");

/* ---- 注入③：把 editor.html 内嵌进 main.js ----
 * 社区市场安装插件时只会从 Release 下载 main.js / manifest.json / styles.css 三个文件，
 * editor.html 不会随装随有 —— 因此构建时把整个编辑器 HTML 作为字符串常量注入 main.js。
 * 本注入幂等：先清除旧注入块再重新注入，重复运行安全。
 */
const mainPath = path.join(here, "fault-tree-mini", "main.js");
let mainSrc = fs.readFileSync(mainPath, "utf8");
mainSrc = mainSrc.replace(/\/\*BUILD:EMBED_START\*\/[\s\S]*?\/\*BUILD:EMBED_END\*\/\n?/g, "");
const anchor = '"use strict";\n';
if (!mainSrc.includes(anchor)) { console.error("✗ main.js 缺少锚点 \"use strict\"，请人工核对"); process.exit(1); }
const embed = '/*BUILD:EMBED_START*/\n// 社区市场安装时不下载 editor.html，故将编辑器完整内嵌于此（由 build-editor.js 自动生成，勿手工编辑）\nconst EMBEDDED_EDITOR_HTML = ' + JSON.stringify(html) + ';\n/*BUILD:EMBED_END*/\n';
mainSrc = mainSrc.replace(anchor, anchor + "\n" + embed);
fs.writeFileSync(mainPath, mainSrc);
console.log("✓ 已内嵌编辑器到 main.js (" + fs.statSync(mainPath).size + " bytes)");
