# MCP 图层与页面关系台账

> 用途：记录 **通过 MCP 获取的图层** 与 **本地开发页面** 的映射关系。  
> 约定：**每个页面只保留 1 条最新生效记录**（不保留历史版本）。

## 维护规则

- 每次图层更新时，直接覆盖该页面原记录，只保留最新 `layer_id`。
- `status` 固定写 `active`（当前生效）。
- `relation_note` 用于说明页面子区块映射语义（如：列表页/详情页/模块子区块）。
- `updated_at` 使用 `YYYY-MM-DD`。

## 关系表

| page_key | 页面路径 | file_id | layer_id(node-id) | layer_name | status | relation_note | updated_at |
| --- | --- | --- | --- | --- | --- | --- | --- |
| homepage | `/` | `2026964440132292608` | `e0e02d60-d6bf-49b0-aee8-4fd40c393411` | 首页主画布 | active | 首页入口页 | 2026-02-28 |
| login | `/login.html` | `2026964440132292608` | `8ca4a7e6-397c-436a-bfe0-9fd80a749bf3` | 登录页 | active | 调试模式支持“无需输入登录” | 2026-02-28 |
| dashboard | `/dashboard.html` | `2026964440132292608` | `a3edc778-0542-4505-8721-c0b1fe9ea87a` | 概览仪表盘 | active | 概览页主图层 | 2026-02-28 |
| scenes_list | `/scenes.html` | `2026964440132292608` | `d2aeb5ab-8b11-4d78-86c8-586541b6cc68` | 产品场景库-列表页 | active | 场景列表页（最新） | 2026-03-01 |
| scene_detail | `/scenes/:id` | `2026964440132292608` | `d8f4ea8d-4244-4e1d-b09f-9332d5f93d9c` | 产品场景库详细页-供应商协同场景详情页 2 | active | 场景详情页基型（最新） | 2026-03-01 |
| solutions_list | `/solutions.html` | `2026964440132292608` | `fba722a5-cd8b-4549-8de3-79b8d20b2f81` | 产品解决方案列表页 2 | active | 解决方案列表页 | 2026-02-28 |
| solution_detail | `/solutions/:id` | `2026964440132292608` | `3bf3c89e-e3f2-45ad-8f64-7e5bf5546225` | 解决方案详情页-供应商协同 | active | 从解决方案列表进入的详情页（最新） | 2026-02-28 |
| cases_list | `/cases.html` | `2026964440132292608` | `41ad0c5a-62fd-4a71-a236-46d12866c98c` | 客户案例列表页 2 | active | 客户案例列表页 | 2026-02-28 |
| case_detail | `/cases/:id` | `2026964440132292608` | `待确认` | 客户案例详情页 | active | 客户案例详情图层待补充确认 | 2026-03-01 |
| users | `/users.html` | `2026964440132292608` | `e05b02c7-821a-439f-9950-0f5ea48fb1d3` | 用户管理页面 2 | active | 系统管理子页 | 2026-02-28 |
| permissions | `/permissions.html` | `2026964440132292608` | `047802fe-4c05-4c92-a8f4-572c57a9d31d` | 后台管理-权限管理页面 | active | 管理中心-权限管理（最新） | 2026-02-28 |
| settings | `/settings.html` | `2026964440132292608` | `fddb1787-4aa1-4198-8571-088c78ef040a` | 系统设置 | active | 系统设置页 | 2026-02-28 |
| open_management | `/open-management.html` | `2026964440132292608` | `4ab52c29-b5d3-44e3-8777-d5ac829341a9` | 后台管理-开放管理页面 | active | 管理中心-开放管理（最新） | 2026-03-01 |
| base_data_mgmt | `/prototype.html?node=758694ba-8efa-4aeb-9c22-64c66c35f5e1` | `2026964440132292608` | `758694ba-8efa-4aeb-9c22-64c66c35f5e1` | 基础数据管理/产品管理 | active | 当前走通用 prototype 渲染 | 2026-02-28 |
| role_mgmt | `/prototype.html?node=2ba3ce23-c775-4d50-bf02-2f394c6e3c60` | `2026964440132292608` | `2ba3ce23-c775-4d50-bf02-2f394c6e3c60` | 角色管理 | active | 当前走通用 prototype 渲染 | 2026-02-28 |
| operation_log | `/prototype.html?node=d2aeb5ab-8b11-4d78-86c8-586541b6cc68` | `2026964440132292608` | `d2aeb5ab-8b11-4d78-86c8-586541b6cc68` | 操作日志 | active | 当前走通用 prototype 渲染 | 2026-02-28 |

## 记录模板（覆盖更新）

```md
| <page_key> | <页面路径> | 2026964440132292608 | <layer_id> | <layer_name> | active | <关系说明> | YYYY-MM-DD |
```

