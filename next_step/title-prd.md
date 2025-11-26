# AI 内容生成功能 PRD - Title & Description 优化器

## 📋 文档信息

- **产品名称**：SEO Optimizer Pro - AI Title & Description Generator
- **版本**：v1.0
- **创建日期**：2024年
- **最后更新**：2024年
- **产品经理**：待定
- **开发负责人**：待定
- **设计负责人**：待定

---

## 1. 产品概述

### 1.1 功能定位

AI 内容生成功能是 SEO Optimizer Pro 的核心差异化功能，旨在从"指出问题"升级为"解决问题"。当用户进行 SEO 分析后，如果发现 Title 或 Meta Description 存在问题，系统不仅会指出问题，还会利用 AI 自动生成 3-5 个优化版本，用户可以直接使用。

### 1.2 目标用户

- **主要用户**：SEO 从业者、内容营销人员、网站管理员
- **使用场景**：
  - 完成 SEO 分析后，发现 Title/Description 需要优化
  - 需要快速生成多个优化版本进行 A/B 测试
  - 希望获得符合 SEO 最佳实践的高质量内容

### 1.3 核心价值

- ✅ **节省时间**：从手动优化到一键生成，节省 90% 的时间
- ✅ **提高质量**：AI 生成的内容符合 SEO 最佳实践
- ✅ **多方案选择**：提供 3-5 个版本，用户可以选择最适合的
- ✅ **即时可用**：生成的内容可以直接复制使用

---

## 2. 用户故事

### 2.1 主要用户故事

**作为** 一个 SEO 从业者  
**我希望** 在完成 SEO 分析后，能够一键生成优化的 Title 和 Description  
**以便** 我可以快速改进网站的 SEO 表现，而不需要手动思考和编写

**作为** 一个内容营销人员  
**我希望** 能够看到多个优化版本的 Title 和 Description  
**以便** 我可以选择最符合品牌调性的版本

**作为** 一个网站管理员  
**我希望** 生成的 Title 和 Description 符合 SEO 最佳实践  
**以便** 我可以提高网站在搜索引擎中的排名

### 2.2 用户流程

```
1. 用户访问 SEO Analyzer 页面
2. 输入网站 URL，点击"Analyze SEO"
3. 查看分析结果，发现 Title/Description 存在问题
4. 点击"Generate AI Optimized Versions"按钮
5. 系统显示生成中的加载状态
6. 3-5 秒后，显示 3-5 个优化版本
7. 用户查看每个版本的：
   - SEO 评分
   - 字符数
   - 关键词密度
   - 可读性评分
8. 用户选择喜欢的版本，点击"Copy"复制
9. 用户可以直接使用或进一步编辑
```

---

## 3. 功能需求

### 3.1 功能范围（MVP）

#### ✅ 必须实现（P0）

1. **AI Title 生成**
   - 输入：当前 Title + 目标关键词（可选）+ 页面内容摘要（可选）
   - 输出：3-5 个优化后的 Title
   - 要求：
     - 长度：50-60 字符（Google 推荐）
     - 包含目标关键词（如果提供）
     - 符合 SEO 最佳实践
     - 可读性强，吸引点击

2. **AI Description 生成**
   - 输入：当前 Description + 目标关键词（可选）+ 页面内容摘要（可选）
   - 输出：3-5 个优化后的 Description
   - 要求：
     - 长度：120-160 字符（Google 推荐）
     - 包含目标关键词（如果提供）
     - 包含行动号召（CTA）
     - 可读性强，吸引点击

3. **结果展示**
   - 显示每个版本的：
     - 完整文本
     - 字符数（实时显示）
     - SEO 评分（0-100）
     - 关键词密度
     - 一键复制功能

4. **用户交互**
   - 生成按钮（在 SEO 分析结果页面）
   - 加载状态提示
   - 错误处理（API 失败、超时等）
   - 复制成功提示

#### 🟡 重要但非必须（P1）

5. **版本对比**
   - 并排对比多个版本
   - 高亮显示差异

6. **编辑功能**
   - 允许用户编辑生成的版本
   - 实时更新字符数和评分

7. **历史记录**
   - 保存用户生成的历史版本
   - 支持查看和重新使用

#### 🟢 未来扩展（P2）

8. **批量生成**
   - 一次生成多个页面的 Title/Description

9. **A/B 测试建议**
   - 推荐最适合 A/B 测试的版本组合

10. **多语言支持**
    - 支持生成其他语言的 Title/Description

---

### 3.2 功能限制（按订阅计划）

| 功能 | 免费版 | Starter | Professional | Enterprise |
|------|--------|---------|--------------|------------|
| AI 生成次数/月 | 0 | 10 | 100 | 无限 |
| 每次生成版本数 | - | 3 | 5 | 5 |
| 历史记录 | ❌ | ❌ | ✅ | ✅ |
| 编辑功能 | ❌ | ❌ | ✅ | ✅ |
| 批量生成 | ❌ | ❌ | ❌ | ✅ |

---

## 4. 技术设计

### 4.1 技术栈

#### 后端
- **AI 服务**：OpenAI GPT-4 或 Anthropic Claude API
- **语言**：Node.js
- **框架**：Express.js（与现有后端一致）
- **缓存**：Redis（缓存相同输入的结果，降低成本）

#### 前端
- **语言**：JavaScript（与现有前端一致）
- **UI 框架**：原生 HTML/CSS/JavaScript
- **API 调用**：Fetch API

### 4.2 系统架构

```
用户浏览器
    ↓
前端 (seo-analyzer.html)
    ↓ (POST /api/generate-title-description)
后端 API (server/server.js)
    ↓
AI 服务模块 (server/services/aiContentGenerator.js)
    ↓
OpenAI/Claude API
    ↓ (返回生成内容)
后端处理（评分、格式化）
    ↓ (返回 JSON)
前端展示结果
```

### 4.3 API 设计

#### 端点：`POST /api/generate-title-description`

**请求体**：
```json
{
  "type": "title" | "description" | "both",
  "currentTitle": "string (可选)",
  "currentDescription": "string (可选)",
  "targetKeyword": "string (可选)",
  "pageContent": "string (可选，页面内容摘要)",
  "pageUrl": "string (可选)",
  "tone": "professional" | "casual" | "friendly" | "default",
  "count": 3-5 (生成版本数，默认 3)
}
```

**响应体**：
```json
{
  "success": true,
  "data": {
    "type": "title" | "description" | "both",
    "generated": [
      {
        "text": "生成的文本",
        "characterCount": 55,
        "seoScore": 92,
        "keywordDensity": 2.5,
        "readabilityScore": 85,
        "includesKeyword": true,
        "includesCTA": true,
        "recommendations": ["建议1", "建议2"]
      },
      // ... 更多版本
    ],
    "metadata": {
      "model": "gpt-4",
      "timestamp": "2024-01-01T00:00:00Z",
      "cost": 0.03,
      "cached": false
    }
  }
}
```

**错误响应**：
```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE"
}
```

### 4.4 数据模型

#### 生成请求记录
```javascript
{
  id: "uuid",
  userId: "user_id (如果登录)",
  type: "title" | "description" | "both",
  input: {
    currentTitle: "string",
    currentDescription: "string",
    targetKeyword: "string",
    pageContent: "string"
  },
  output: {
    generated: [...],
    metadata: {...}
  },
  timestamp: "ISO 8601",
  cached: boolean
}
```

### 4.5 AI Prompt 设计

#### Title 生成 Prompt
```
You are an SEO expert. Generate {count} optimized title tags for a webpage.

Current title: {currentTitle}
Target keyword: {targetKeyword}
Page content summary: {pageContent}
Page URL: {pageUrl}

Requirements:
1. Length: 50-60 characters (strict)
2. Include target keyword naturally (if provided)
3. Compelling and click-worthy
4. Follow SEO best practices
5. Tone: {tone}

Return JSON array with format:
[
  {
    "title": "generated title",
    "reasoning": "brief explanation"
  }
]
```

#### Description 生成 Prompt
```
You are an SEO expert. Generate {count} optimized meta descriptions for a webpage.

Current description: {currentDescription}
Target keyword: {targetKeyword}
Page content summary: {pageContent}
Page URL: {pageUrl}

Requirements:
1. Length: 120-160 characters (strict)
2. Include target keyword naturally (if provided)
3. Include a call-to-action (CTA)
4. Compelling and click-worthy
5. Follow SEO best practices
6. Tone: {tone}

Return JSON array with format:
[
  {
    "description": "generated description",
    "reasoning": "brief explanation"
  }
]
```

---

## 5. UI/UX 设计

### 5.1 页面布局

#### 位置：SEO 分析结果页面

在"On-Page SEO"部分，Title Tag 和 Meta Description 检查项旁边添加"Generate AI Version"按钮。

```
┌─────────────────────────────────────────────────┐
│ 📄 On-Page SEO                                   │
├─────────────────────────────────────────────────┤
│ ✅ Title Tag                                     │
│    Title tag is 45 characters. Recommended:     │
│    50-60 characters.                             │
│    [Generate AI Version] ← 新增按钮              │
├─────────────────────────────────────────────────┤
│ ⚠️ Meta Description                              │
│    Meta description is 80 characters.            │
│    Recommended: 120-160 characters.              │
│    [Generate AI Version] ← 新增按钮              │
└─────────────────────────────────────────────────┘
```

### 5.2 生成结果弹窗/面板

```
┌─────────────────────────────────────────────────┐
│ AI Generated Titles                    [×]      │
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Version 1                          [Copy]   │ │
│ │ ─────────────────────────────────────────── │ │
│ │ Best SEO Tools 2024 - Boost Your Rankings  │ │
│ │                                             │ │
│ │ 📊 SEO Score: 92/100                       │ │
│ │ 📏 Length: 55 characters ✅                 │ │
│ │ 🎯 Keyword: "SEO tools" (included)          │ │
│ │ 📖 Readability: 85/100                    │ │
│ │                                             │ │
│ │ 💡 Why this works:                         │ │
│ │ - Includes target keyword naturally        │ │
│ │ - Compelling and action-oriented           │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Version 2                          [Copy]   │ │
│ │ ... (类似结构)                              │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Version 3                          [Copy]   │ │
│ │ ... (类似结构)                              │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ [Generate More] [Close]                         │
└─────────────────────────────────────────────────┘
```

### 5.3 交互流程

1. **点击"Generate AI Version"按钮**
   - 按钮变为加载状态："Generating..."
   - 显示加载动画

2. **生成中**
   - 显示进度提示："AI is generating optimized versions..."
   - 禁用按钮，防止重复点击

3. **生成完成**
   - 弹出结果面板（Modal 或侧边栏）
   - 显示 3-5 个版本
   - 每个版本显示评分和详情

4. **用户操作**
   - 点击"Copy"：复制到剪贴板，显示"Copied!"提示
   - 点击"Generate More"：生成新的版本（消耗额外次数）
   - 点击"Close"：关闭面板

5. **错误处理**
   - API 失败：显示友好错误信息
   - 超时：提示重试
   - 配额用完：提示升级计划

### 5.4 响应式设计

- **桌面端**：Modal 弹窗，宽度 600px
- **移动端**：全屏弹窗或底部抽屉
- **平板**：适配中等屏幕

---

## 6. 评分算法

### 6.1 SEO 评分（0-100）

```javascript
function calculateSEOScore(text, type, targetKeyword) {
  let score = 0;
  
  // 长度评分 (40分)
  const idealLength = type === 'title' ? 55 : 140;
  const lengthDiff = Math.abs(text.length - idealLength);
  const lengthScore = Math.max(0, 40 - (lengthDiff * 2));
  score += lengthScore;
  
  // 关键词评分 (30分)
  if (targetKeyword) {
    const keywordIncluded = text.toLowerCase().includes(targetKeyword.toLowerCase());
    const keywordDensity = calculateKeywordDensity(text, targetKeyword);
    const keywordScore = keywordIncluded ? 30 : 0;
    score += keywordScore;
  } else {
    score += 15; // 如果没有关键词，给基础分
  }
  
  // 可读性评分 (20分)
  const readabilityScore = calculateReadability(text);
  score += readabilityScore * 0.2;
  
  // CTA 评分 (10分，仅 Description)
  if (type === 'description') {
    const hasCTA = checkForCTA(text);
    score += hasCTA ? 10 : 0;
  } else {
    score += 5; // Title 不需要 CTA
  }
  
  return Math.min(100, Math.round(score));
}
```

### 6.2 关键词密度计算

```javascript
function calculateKeywordDensity(text, keyword) {
  const words = text.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  const keywordCount = words.filter(w => w.includes(keywordLower)).length;
  return (keywordCount / words.length) * 100;
}
```

### 6.3 可读性评分

使用 Flesch Reading Ease 算法（简化版）：
- 句子长度
- 单词长度
- 复杂度

---

## 7. 成本控制

### 7.1 API 成本估算

- **GPT-4**：每次生成约 $0.01-0.05（取决于输入长度）
- **Claude**：每次生成约 $0.008-0.04

### 7.2 缓存策略

```javascript
// 缓存键：hash(input + type + count)
const cacheKey = `ai_generate_${hash(input)}_${type}_${count}`;

// 检查缓存
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}

// 调用 AI API
const result = await callAIAPI(input);

// 缓存结果（24小时）
await redis.setex(cacheKey, 86400, JSON.stringify(result));
```

### 7.3 使用限制

- **免费版**：0 次/月
- **Starter**：10 次/月
- **Professional**：100 次/月
- **Enterprise**：无限

---

## 8. 安全与隐私

### 8.1 数据安全

- **输入验证**：验证所有输入参数
- **速率限制**：防止滥用（每个用户每分钟最多 5 次请求）
- **API 密钥**：后端存储，不暴露给前端

### 8.2 隐私保护

- **不存储敏感内容**：不存储用户输入的完整页面内容
- **数据加密**：传输使用 HTTPS
- **日志脱敏**：日志中不包含完整用户输入

---

## 9. 错误处理

### 9.1 错误类型

| 错误代码 | 错误信息 | 处理方式 |
|---------|---------|---------|
| `AI_API_ERROR` | AI API 调用失败 | 重试 3 次，仍失败则返回错误 |
| `AI_TIMEOUT` | AI API 超时 | 提示用户重试 |
| `QUOTA_EXCEEDED` | 配额已用完 | 提示升级计划 |
| `INVALID_INPUT` | 输入无效 | 返回具体错误信息 |
| `RATE_LIMIT` | 请求过于频繁 | 提示稍后重试 |

### 9.2 用户提示

- **友好错误信息**：不使用技术术语
- **解决方案建议**：提供具体的解决建议
- **联系支持**：严重错误提供支持联系方式

---

## 10. 测试计划

### 10.1 功能测试

- [ ] 生成 Title（有/无关键词）
- [ ] 生成 Description（有/无关键词）
- [ ] 同时生成 Title 和 Description
- [ ] 不同长度输入的处理
- [ ] 特殊字符处理
- [ ] 多语言输入处理

### 10.2 性能测试

- [ ] API 响应时间 < 5 秒
- [ ] 并发请求处理（10+ 用户同时使用）
- [ ] 缓存命中率 > 50%

### 10.3 用户体验测试

- [ ] 加载状态清晰
- [ ] 错误提示友好
- [ ] 复制功能正常
- [ ] 移动端适配良好

---

## 11. 实施计划

### 11.1 开发阶段（3 周）

#### 第 1 周：后端开发
- [ ] 创建 AI 服务模块 (`server/services/aiContentGenerator.js`)
- [ ] 实现 OpenAI/Claude API 集成
- [ ] 实现缓存机制
- [ ] 实现评分算法
- [ ] 创建 API 端点
- [ ] 单元测试

#### 第 2 周：前端开发
- [ ] 设计 UI 组件
- [ ] 实现生成按钮
- [ ] 实现结果展示面板
- [ ] 实现复制功能
- [ ] 实现加载状态
- [ ] 实现错误处理

#### 第 3 周：集成与测试
- [ ] 前后端集成
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 文档编写

### 11.2 发布计划

1. **内部测试**（1 周）
   - 团队内部测试
   - 修复发现的问题

2. **Beta 测试**（1 周）
   - 邀请 10-20 个 Beta 用户
   - 收集反馈
   - 优化功能

3. **正式发布**
   - 发布到生产环境
   - 监控错误和性能
   - 收集用户反馈

---

## 12. 成功指标

### 12.1 产品指标

- **使用率**：> 30% 的 SEO 分析用户使用 AI 生成功能
- **生成成功率**：> 95%（成功生成结果的比例）
- **用户满意度**：> 4.5/5（用户评分）

### 12.2 商业指标

- **转化率提升**：使用 AI 生成功能的用户付费转化率提升 20%
- **留存率**：使用 AI 生成功能的用户留存率 > 80%
- **功能价值**：用户认为这是最有价值的功能之一

### 12.3 技术指标

- **API 响应时间**：< 5 秒（P95）
- **错误率**：< 1%
- **缓存命中率**：> 50%

---

## 13. 未来扩展

### 13.1 功能扩展

1. **H1/H2 标签生成**（第 2 阶段）
2. **整段内容重写**（第 3 阶段）
3. **内容新鲜度建议**（第 3 阶段）
4. **多语言支持**（第 4 阶段）

### 13.2 技术优化

1. **更智能的 Prompt**：根据行业、页面类型定制
2. **A/B 测试集成**：推荐最适合测试的版本
3. **批量处理**：一次生成多个页面

---

## 14. 附录

### 14.1 参考资源

- [Google Title Tag Guidelines](https://developers.google.com/search/docs/appearance/title-link)
- [Google Meta Description Guidelines](https://developers.google.com/search/docs/appearance/snippet)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API Documentation](https://docs.anthropic.com/)

### 14.2 相关文档

- `next_step/MVP_ANALYSIS.md` - MVP 分析文档
- `next_step/IMPLEMENTATION_ROADMAP.md` - 实施路线图
- `md/FIREBASE_ANALYTICS.md` - Firebase 分析集成

---

**文档版本**：v1.0  
**创建日期**：2024年  
**下次更新**：根据开发进展和用户反馈调整

