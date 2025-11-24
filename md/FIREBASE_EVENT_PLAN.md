# Firebase Analytics 埋点方案（待确认）

## 1. 目标与范围
- **目标**：衡量 `SEO Optimizer Pro` Web 站点的核心转化漏斗（浏览 → 体验 → 注册/购买）、工具使用深度和内容参与度。
- **范围**：当前 `index.html` 主站页面及跳转至 `seo-analyzer.html` 等工具入口，覆盖所有主要交互模块。
- **数据合规**：不采集 PII（个人身份识别信息），遵守 GDPR / CCPA；若启用 Cookie Consent，需在用户同意后再执行埋点。

## 2. 事件设计原则
1. **命名规范**：`snake_case`，见名知义。
2. **参数限制**：不超过 10 个，高价值优先。
3. **层级清晰**：页面级 → 模块级 → 动作级。
4. **可复用**：同一事件用于多处按钮，依靠 `button_name`、`section` 参数区分。

## 3. 关键事件一览

| 序号 | 事件名称 | 触发节点 | 关键参数 | 目的 | 状态 |
| --- | --- | --- | --- | --- | --- |
| E01 | `hero_cta_click` | Hero 区「Start Free Analysis」「Watch Demo」按钮 | `cta_type` (`analysis`/`demo`), `section` (`hero`), `page_path` | 衡量首屏转化能力 | ✅ 首期上线 |
| E02 | `nav_menu_click` | 顶部导航点击锚点 | `destination_section`, `page_path` | 了解导航使用偏好 | ✅ 首期上线 |
| E03 | `feature_card_view` | Features 区元素进入视窗一次 | `feature_key`, `sequence` | 评估卖点吸引力（需 IntersectionObserver） | ✅ 首期上线 |
| E04 | `tool_cta_click` | Tools 区各卡片按钮、`seo-analyzer.html` 链接 | `tool_name`, `cta_label`, `page_path` | 衡量工具入口点击率 | ✅ 首期上线 |
| E05 | `pricing_interaction` | Pricing 区按钮点击（Start Trial / Contact Sales） | `plan_name`, `cta_label`, `billing_cycle` | 量化不同套餐兴趣度 | ✅ 首期上线 |
| E06 | `contact_form_submit` | Contact 表单提交事件（成功/失败） | `status` (`success`/`error`), `error_type`?, `page_path` | 追踪线索提交质量 | ⏸ 暂缓，保留方案 |
| E07 | `contact_form_field_focus` | 联系表单关键字段聚焦一次 | `field_name`, `sequence` | 识别表单流失环节 | ⏸ 暂缓，保留方案 |
| E08 | `footer_time_view` | Footer 时间信息渲染完成 | `timezone_label`, `page_path` | 验证地域化信息曝光 | ⏸ 暂缓，保留方案 |
| E09 | `seo_demo_start` | `showDemo()` 被调用 | `source` (`hero_cta`/`other`), `page_path` | 追踪 Demo 观看意向 | ⏸ 暂缓，保留方案 |
| E10 | `page_view_manual` | 单页应用路由切换（若后续 SPA 化） | `page_title`, `page_path`, `referrer` | 兜底页面浏览 | ⏸ 暂缓，保留方案 |

> 当前仅实现 E01-E05，其余事件保留在文档中，后续需要时可快速启用。

## 4. 参数字典

| 参数 | 类型 | 示例 | 说明 |
| --- | --- | --- | --- |
| `cta_type` | string | `analysis` | Hero CTA 类型 |
| `section` | string | `hero` | 页面模块标识 |
| `page_path` | string | `/` | `window.location.pathname` |
| `destination_section` | string | `pricing` | 导航跳转锚点 |
| `tool_name` | string | `seo_analyzer` | 工具英文标识 |
| `cta_label` | string | `Try Free Analyzer` | 按钮文案 |
| `plan_name` | string | `Professional` | 价格卡名称 |
| `billing_cycle` | string | `monthly` | 计费周期 |
| `status` | string | `success` | 表单提交结果 |
| `error_type` | string | `validation` | 若失败，记录具体错误 |
| `field_name` | string | `email` | 表单字段名 |
| `timezone_label` | string | `EST` | Footer 显示的时区 |
| `source` | string | `hero_cta` | 事件触发来源 |

## 5. 用户属性（User Properties）
- `region`：默认 `US`
- `plan_interest`：`starter`/`professional`/`enterprise`，根据最近一次 Pricing 点击推断
- `lead_status`：`anonymous`/`form_submitted`
- `device_type`：`desktop`/`mobile`（JS 判断 `window.innerWidth`）

## 6. 数据上报策略
1. **初始化**：`firebase-init.js` 在 DOMContentLoaded 前加载，暴露 `window.firebaseAnalytics`。
2. **工具函数**：实现 `analytics-helper.js`（下一阶段），封装 `logEvent`、`setUserProperties`、`logPageView`。
3. **触发方式**：
   - 按钮/链接：在现有 `onclick` 或事件监听中调用 `trackButtonClick()`。
   - 表单：在 `handleSubmit` 内部调用，成功/失败分别上报。
   - 曝光类：使用 IntersectionObserver，出现一次即上报并取消观察。
4. **防抖/去重**：对快速重复操作（如导航多次点击）可增加 300ms 防抖；表单字段聚焦仅记录第一次。

## 7. 实施步骤（建议顺序）
1. **确认方案**（当前阶段）
2. **实现 `analytics-helper.js`**：封装事件触发函数
3. **绑定关键 CTA**：Hero、Pricing、Tools
4. **扩展表单埋点**：提交与字段聚焦
5. **增强曝光埋点**：Features 卡片 & Footer
6. **验证与调试**：启用 `localStorage.setItem('firebase:debug','true')`，在控制台核查事件

## 8. 待确认事项
- 是否需要追踪 `seo-analyzer.html` 内部步骤？（若需要需补充页面级事件）
- 是否存在登录/注册流程？目前页面无账号体系，如后续加入需新增 `login`、`sign_up` 等 GA4 推荐事件。
- 是否需要关联 Ads 转化？若有需在 GA4 中创建转化并与 Google Ads 关联。

确认无误后，我将按照本方案实现埋点代码。

