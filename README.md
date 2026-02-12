# 马拉松配速助手

专业的马拉松配速计算工具，帮助跑步爱好者计算全马、半马、10K 的完赛时间和配速。支持跑步机速度转换，提供等效路跑配速计算。

## 功能特性

- 🏃 马拉松配速计算（全马/半马/10K）
- 🏃‍♀️ 跑步机速度转换
- 📊 等效路跑配速计算
- 🌍 支持中英文双语
- 📱 响应式设计，支持移动端

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## Cloudflare Pages 部署配置

### 构建设置

在 Cloudflare Pages 项目设置中配置：

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (留空或使用 `/`)

### 环境变量

无需特殊环境变量。

### 注意事项

1. 确保 `package-lock.json` 已提交到仓库
2. 构建输出目录必须是 `dist`
3. `_redirects` 文件（`/* /index.html 200`）用于 SPA 回退，由 `public` 复制到 `dist`
4. Node 版本：建议使用 Node 18.18.0+（项目包含 `.nvmrc` 文件）

## 项目结构

```
├── public/          # 静态资源
│   ├── _redirects   # Cloudflare Pages 重定向规则
│   ├── robots.txt   # SEO robots 文件
│   └── sitemap.xml  # SEO 站点地图
├── src/
│   ├── components/  # React 组件
│   ├── lib/         # 工具库和 i18n
│   └── pages/       # 页面组件
└── dist/            # 构建输出（不提交到 git）
```

## 许可证

MIT
