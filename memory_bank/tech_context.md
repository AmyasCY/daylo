# 技术栈
- Next.js `16.2.3`
- React `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4`
- ESLint `^9`

# 当前代码结构
- `app/`：App Router 页面与全局样式
- `app/api/`：Route Handlers
- `public/`：默认静态资源
- `memory_bank/`：项目记忆与上下文文档
- `lib/`：共享基础设施与工具，当前已包含数据库连接入口
- `lib/api-response.ts`：统一 API success/error 返回工具
- `models/`：实体模型目录，占位已建立
- `schemas/`：校验 schema 目录，占位已建立
- `services/`：服务层目录，占位已建立

# 已知约束
- `AGENTS.md` 明确要求：在编写 Next.js 相关代码前，先阅读 `node_modules/next/dist/docs/` 中相关指南，因为当前版本可能和常见认知不同
- 当前仓库尚未完成数据库联调，仍等待用户稍后提供真实 `MONGODB_URI`
- 当前仓库尚未安装额外的校验依赖，例如 Zod

# 当前前端状态
- `app/page.tsx` 已替换为 Daylo 首页占位内容
- `app/layout.tsx` metadata 已替换为 Daylo
- `app/globals.css` 使用 Tailwind v4 的 `@theme inline`，但 `body` 仍写死为 `Arial, Helvetica, sans-serif`

# 后续技术方向
- 增加数据层：MongoDB 连接与实体模型
- 增加校验层：请求 schema 与统一 API 返回格式
- 增加服务层：goal/task/time block/schedule/re-plan 相关能力
- 增加调度规则实现与 reasoning 生成逻辑
