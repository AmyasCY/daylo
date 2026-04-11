# 项目目标
先完成一个可演示的 MVP：
- 用户能管理 goals 和 tasks
- 用户能输入可用时间块
- 系统能生成当天 schedule
- 每个 schedule 有可读的 reasoning
- 用户能基于反馈重新规划

# 阶段计划
1. 项目基础搭建
- 完成项目基础信息替换：站点标题、README、环境变量说明
- 建立最小目录约定：前端、数据模型、校验、服务层
- 配置 MongoDB 连接
- 定义统一 API 返回格式
- 确定数据实体：Goal、Task、Schedule、TimeBlock
- 输出结果：项目不再是脚手架默认页，而是有清晰开发骨架
2. 核心数据能力
- 实现 Goal CRUD
- 实现 Task CRUD
- 支持任务可选关联 Goal
- 为任务补齐关键字段：deadline、estimatedDuration、priority、status
- 用 Zod 做请求校验
- 输出结果：用户可以完整录入“目标”和“任务”
3. MVP 调度能力
- 增加用户可用时间块输入
- 实现基础排程逻辑
- 排序规则先按：
+ deadline urgency
+ priority
+ goal alignment
- 将任务分配进当天时间块，避免冲突
- 输出 schedule 的 reasoning
- 输出结果：第一次可用的“自动生成日程”
4. 动态重规划与展示
- 增加 schedule view
- 展示时间块、任务信息、可选 reasoning
- 支持用户反馈，例如“任务太满了”“把深度工作放上午”
- 基于反馈触发 re-plan
- 输出结果：形成闭环 MVP，可演示“生成 + 解释 + 调整”

# 工作优先级
1. 数据模型
2. CRUD
3. Schedule algorithm
4. reasoning
5. re-planning
6. UI polish

# 当前约束
- 先做单用户MVP，不处理登录和多用户
- 先只做“日计划”，不扩展到周计划
- Reasoning先基于规则生成，后续再接入AI
- re-planning先做简单反馈驱动，不做复杂对话式agent

