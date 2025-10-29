# 小宿AI助手项目开发文档

## 1. 项目概述

### 1.1 项目简介
小宿AI助手是一个集成多种AI功能的前端应用，基于Next.js框架开发，提供聊天、图像生成、视频生成和智能搜索等功能。

### 1.2 主要功能
- 聊天界面：支持与AI模型进行对话交互
- 图像生成：支持多种AI模型生成图像
- 视频生成：支持多种AI模型生成视频
- 智能搜索：支持普通搜索和全文搜索模式，可通过参数灵活控制
- 多主题支持：支持明暗两种主题切换
- API配置管理：支持用户配置不同服务的API端点和密钥

## 2. 项目架构

### 2.1 技术栈
- **前端框架**：Next.js 14.0.0
- **UI库**：React 18.2.0
- **编程语言**：TypeScript 5.0.0
- **状态管理**：Zustand 4.4.0
- **样式方案**：Tailwind CSS 3.3.0
- **动画库**：Framer Motion 12.23.20
- **HTTP请求**：Axios 1.6.0
- **图标库**：Lucide React 0.263.1
- **内容渲染**：React Markdown 9.0.0

### 2.2 项目结构
```
chatbot/
├── app/                    # Next.js应用目录
│   ├── api/                # API路由处理
│   ├── layout.tsx          # 应用布局
│   └── page.tsx            # 主页面
├── src/                    # 源代码目录
│   ├── components/         # React组件
│   ├── config/             # 配置文件
│   ├── contexts/           # React上下文
│   ├── hooks/              # 自定义钩子
│   ├── lib/                # 工具库
│   ├── store/              # 状态管理
│   ├── styles/             # 样式文件
│   ├── types/              # TypeScript类型定义
│   └── utils/              # 工具函数
├── public/                 # 静态资源
├── .env.example            # 环境变量示例
├── next.config.js          # Next.js配置
├── tailwind.config.js      # Tailwind配置
└── package.json            # 项目依赖和脚本
```

### 2.2.1 核心目录功能说明

#### src/lib/
**功能**：提供核心库函数和API客户端
- **api.ts**：定义`SkyRouterAPI`类，封装所有API调用
  - 主要功能：聊天完成、流式聊天、图像生成、模型获取等
  - 调用关系：被`src/components`目录下的各个功能组件调用
- **modelUtils.ts**：提供模型分类和处理工具函数
  - 主要功能：`categorizeModels`函数将模型分为聊天、图像、视频等类别
  - 调用关系：被`src/hooks/useModels.ts`调用，用于模型过滤和分类

#### src/store/
**功能**：使用Zustand管理全局状态
- **useStore.ts**：定义应用的状态管理store
  - 主要功能：管理API配置、当前标签页、会话、消息、生成的图像和视频、搜索结果等
  - 调用关系：被几乎所有功能组件调用
  - 持久化：使用`persist`中间件保存状态到localStorage

#### src/config/
**功能**：提供配置信息
- **endpoints.ts**：配置各种模型的endpoint映射
  - 主要功能：定义HL视频模型和MJ图像模型的endpoint配置
  - 调用关系：被视频生成和图像生成组件调用
  - 提供函数：`getHLEndpointForModel`、`getMJEndpointForModel`

#### src/hooks/
**功能**：提供自定义React Hooks
- **useModels.ts**：获取和管理AI模型列表
  - 主要功能：获取可用模型、分类模型、缓存配置等
  - 调用关系：被聊天、图像生成、视频生成组件调用
- **useHLEndpoints.ts**：管理HL模型的endpoint
- **useNotification.ts**：管理通知功能
- **useKeyboardShortcuts.ts**：处理键盘快捷键

#### src/contexts/
**功能**：提供React上下文
- **ThemeContext.tsx**：管理应用主题（浅色/深色/系统）
  - 主要功能：切换主题、响应系统主题变化、应用主题到DOM
  - 调用关系：在应用顶层Provider中被使用，影响全局样式
- **ErrorContext.tsx**：管理错误处理

#### src/types/
**功能**：定义TypeScript类型
- **index.ts**：包含所有类型定义
  - 主要类型：ApiConfig、ModelInfo、ChatMessage、Conversation、SearchResult等
  - 调用关系：被整个代码库引用，提供类型安全

#### src/utils/
**功能**：提供工具函数
- **errorUtils.ts**：错误处理工具
  - 主要功能：定义错误类型、创建和解析错误
  - 调用关系：在API调用和异常处理处使用

#### src/styles/
**功能**：提供样式文件
- **modern.css**：现代UI样式，包含文本选择样式
- **animations.css**：动画效果样式

### 2.2.2 状态管理架构
- **状态管理库**：Zustand 4.4.0
- **核心状态文件**：`src/store/useStore.ts`
- **状态持久化**：使用Zustand的persist中间件实现本地存储
- **主要状态模块**：
  - `apiConfig`：API配置信息
  - `currentTab`：当前激活的标签页（chat/image/video/search）
  - `conversations`：聊天会话列表
  - `currentConversation`：当前会话ID
  - `generatedImages`：生成的图像历史
  - `generatedVideos`：生成的视频历史
  - `searchResults`：搜索结果历史
- **核心动作（Actions）**：
  - API配置管理：`setApiConfig`
  - 会话管理：`addConversation`, `setCurrentConversation`, `deleteConversation`, `clearConversations`
  - 消息管理：`addMessage`, `updateMessage`, `updateConversationTimestamp`
  - 媒体生成记录：`addGeneratedImage`, `addGeneratedVideo`
  - 搜索结果管理：`addSearchResult`, `clearSearchResults`
  - 标签切换：`setCurrentTab`

### 2.3 核心功能模块

#### 2.3.1 搜索功能
- **前端实现**：`src/components/SearchInterface.tsx`
  - **主要功能**：提供智能搜索和全文搜索两种模式，支持多参数配置和搜索历史管理
  - **关键实现细节**：
    - **搜索模式控制**：通过`useFullText`参数控制搜索类型，替代传统的模型选择方式
    - **参数管理**：使用`SearchParameters`接口定义所有搜索参数，包括count、freshness、offset、mkt、cc、safeSearch、setLang和useFullText
    - **API调用**：构建统一的搜索请求，将参数传递给后端API
    - **结果处理**：实时展示搜索结果，并将结果保存到历史记录中
  - **核心流程**：
    1. 用户输入搜索查询和参数设置
    2. 前端构建包含查询和参数的请求
    3. 后端根据`useFullText`参数选择不同的搜索端点
    4. 返回搜索结果并在界面上展示
- **后端实现**：`app/api/search/route.ts`
  - **主要功能**：处理搜索请求，根据参数选择不同的搜索端点，调用外部搜索API
  - **关键实现细节**：
    - **请求验证**：验证必要的API配置和搜索参数
    - **搜索类型判断**：根据`useFullText`参数决定调用全文搜索或智能搜索
    - **搜索URL构建**：动态构建搜索API的URL和查询参数
    - **认证处理**：支持多种认证方式，首先尝试无认证，失败后尝试Bearer token
    - **错误处理**：完善的错误捕获和状态码返回
  - **端点路径**：
    - 全文搜索：`https://searchapi.cloudsway.net/search/{searchEndpointId}/full`
    - 智能搜索：`https://searchapi.cloudsway.net/search/{searchEndpointId}/smart`

#### 2.3.2 聊天功能
- **前端实现**：`src/components/ChatInterface.tsx`
  - **主要功能**：提供与AI模型的对话交互，支持会话管理和流式响应
  - **状态管理**：
    - 使用Zustand管理会话和消息状态
    - `currentConversation`：当前会话ID
    - `conversations`：所有会话列表
  - **关键实现细节**：
    - **会话管理**：支持创建新会话、切换会话和删除会话
    - **模型选择**：动态加载和选择可用的聊天模型
    - **流式响应**：使用Stream API处理AI模型的流式输出，实现打字效果
    - **消息渲染**：使用ReactMarkdown渲染AI生成的富文本内容
  - **核心函数**：
    - `createNewConversation()`：创建新会话
    - `handleSend()`：处理用户发送消息，包括创建会话、添加消息和调用API
    - `streamChatCompletion`：处理流式响应的API调用
- **后端实现**：`app/api/chat/completions/route.ts`
  - **主要功能**：代理聊天完成请求到外部AI服务，支持流式响应
  - **关键实现细节**：
    - **请求验证**：验证认证头和必要参数
    - **代理转发**：将请求转发到配置的API端点
    - **流式响应处理**：特别处理流式响应，设置适当的响应头
    - **错误处理**：捕获并转换API错误为友好的响应格式
  - **端点路径**：`https://genaiapi.cloudsway.net/v1/chat/completions`（可配置）

#### 2.3.3 图像生成功能
- **前端实现**：`src/components/ImageGenerator.tsx`
  - **主要功能**：支持通过不同模型生成图像，包括模型选择和配置管理
  - **状态管理**：
    - `generatedImages`：存储生成的图像历史
    - `selectedModel`：当前选择的模型
    - `prompt`：图像生成提示词
  - **关键实现细节**：
    - **模型可用性检查**：通过`isModelAvailable`函数验证模型是否可用
    - **配置验证**：使用`needsConfiguration`检查模型是否需要额外配置
    - **多模型支持**：特别处理MaaS-MJ模型，使用专门的API和端点配置
    - **统一配置管理**：使用统一的端点路径配置处理不同模型
  - **核心流程**：
    1. 用户输入提示词并选择模型
    2. 验证模型可用性和必要配置
    3. 调用相应的API生成图像
    4. 保存生成的图像到历史记录
- **后端实现**：
  - **主图像生成API**：`app/api/images/generations/route.ts`
    - **主要功能**：代理图像生成请求到外部AI服务
    - **关键实现细节**：
      - **请求验证**：验证认证信息和请求参数
      - **错误处理**：特别处理内容策略违规、配额不足等常见错误
      - **用户友好错误**：将API错误转换为用户友好的中文错误信息
      - **详细日志记录**：记录请求和响应信息以便调试
  - **MJ模型专用API**：`app/api/images/mj/route.ts`
    - **主要功能**：处理Midjourney模型的图像生成请求
    - **特点**：使用专用的MJ端点路径配置

#### 2.3.4 视频生成功能
- **前端实现**：`src/components/VideoGenerator.tsx`
  - **主要功能**：支持从文本、图像或语音生成视频，支持多种视频模型
  - **状态管理**：
    - `generatedVideos`：存储生成的视频历史
    - `inputType`：控制输入类型（text/image/speech）
    - `selectedModel`：当前选择的视频模型
  - **关键实现细节**：
    - **模型分类**：识别KL模型和HL模型，分别处理
    - **输入类型智能切换**：根据模型类型自动切换输入方式（文本、图像或语音）
    - **配置验证**：检查不同模型所需的特定端点配置
    - **文件处理**：支持图像和语音文件上传作为视频生成输入
  - **核心函数**：
    - `isKLModel()`：判断是否为KL模型
    - `needsConfiguration()`：检查模型是否需要额外配置
    - `getModelInputType()`：根据模型ID确定输入类型
    - `isModelAvailable()`：检查模型是否可用
  - **模型特性**：
    - T2V模型：从文本生成视频
    - I2V模型：从图像生成视频
    - S2V模型：从语音生成视频
- **后端实现**：
  - **主视频生成API**：`app/api/videos/generations/route.ts`
    - **主要功能**：处理通用视频生成请求
    - **关键实现细节**：
      - **参数处理**：支持多种输入类型（文本、图像、语音）
      - **动态请求构建**：根据输入类型构建不同的请求数据
      - **错误处理**：完善的错误捕获和转换
  - **KL模型专用API**：`app/api/videos/kl/route.ts`
    - **主要功能**：处理Keling模型的视频生成请求
  - **HL模型专用API**：`app/api/videos/hl/route.ts`
    - **主要功能**：处理HL模型的视频生成请求

#### 2.3.5 模型管理功能
- **前端实现**：通过`useModels`钩子实现
- **后端实现**：`app/api/models/route.ts`
  - **主要功能**：获取可用的AI模型列表
  - **模型配置API**：`app/api/models/config/route.ts`
    - **主要功能**：管理模型的配置信息

#### 2.3.6 端点管理功能
- **后端实现**：
  - **端点管理API**：`app/api/endpoints/route.ts`
    - **主要功能**：获取和管理API端点信息
  - **HL端点API**：`app/api/hl-endpoints/route.ts`
    - **主要功能**：管理HL模型专用端点

## 3. 开发规范

### 3.1 代码风格规范

#### 3.1.1 TypeScript规范
- 使用接口（interface）定义组件Props和复杂数据结构
- 为所有变量、函数参数和返回值添加类型注解
- 避免使用`any`类型，如必须使用应添加注释说明
- 使用`enum`定义枚举类型，提高代码可读性

#### 3.1.2 React组件规范
- 使用函数组件和Hooks
- 组件文件命名使用PascalCase（如`SearchInterface.tsx`）
- 组件内部函数使用camelCase命名
- 使用`useCallback`和`useMemo`优化性能
- 保持组件职责单一，避免创建过于复杂的组件

#### 3.1.3 CSS/Tailwind规范
- 优先使用Tailwind类进行样式设计
- 自定义样式使用`@layer utilities`在`globals.css`中定义
- 选择文本样式遵循统一标准，确保用户体验
- 颜色、间距等遵循设计系统规范，在`tailwind.config.js`中定义

### 3.2 开发工作流

#### 3.2.1 环境设置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 3.2.2 代码检查和格式化
```bash
# 代码检查
npm run lint

# TypeScript类型检查
npm run type-check

# 代码格式化
npm run format
```

#### 3.2.3 备份策略
- 在进行重大修改前，创建项目备份
- 使用时间戳命名备份文件夹，格式：`chatbot_backup_YYYYMMDD_HHmmss`
- 备份时排除`node_modules`、`.next`等大型目录

### 3.3 搜索功能开发特别规范

#### 3.3.1 参数管理规范
- 搜索参数应集中在`SearchParameters`接口中定义
- 参数变更需同步更新前端界面和后端API处理
- 新增参数时，需考虑默认值和向后兼容性

#### 3.3.2 搜索模式切换
- 搜索模式（智能搜索/全文搜索）通过`useFullText`参数控制
- 禁止通过模型选择切换搜索模式，统一使用参数控制
- 前端和后端逻辑需保持一致，确保参数正确传递和解析

## 4. 测试规范

### 4.1 测试类型

#### 4.1.1 单元测试
- 使用Jest进行组件和功能单元测试
- 测试文件与被测试文件位于同一目录，命名为`*.test.tsx`
- 覆盖核心功能函数，确保输入输出符合预期

#### 4.1.2 集成测试
- 测试组件间交互和API调用流程
- 使用`jest --config jest.integration.config.js`运行集成测试
- 验证数据流和状态更新的正确性

#### 4.1.3 E2E测试
- 使用Playwright进行端到端测试
- 模拟用户实际操作流程
- 测试文件位于`tests/e2e`目录

### 4.2 测试执行命令
```bash
# 运行单元测试
npm run test

# 运行单元测试（监视模式）
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage

# 运行集成测试
npm run test:integration

# 运行E2E测试
npm run test:e2e
```

### 4.3 测试覆盖率要求
- 核心功能模块覆盖率≥80%
- API接口处理逻辑覆盖率≥90%
- 状态管理逻辑覆盖率≥85%

## 5. 部署规范

### 5.1 部署前检查
```bash
# 运行部署前检查
npm run pre-deploy-check

# 运行所有检查（包含集成测试和安全审计）
npm run check-all
```

### 5.2 环境配置
- 根据`.env.example`创建`.env`文件
- 配置必要的API密钥和端点信息
- 生产环境配置HTTPS和适当的CORS设置

### 5.3 部署流程
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 6. 回滚策略

### 6.1 快速回滚
使用`npm run rollback:quick`命令执行快速回滚，恢复到上一个稳定版本。

### 6.2 版本回滚
使用`npm run rollback:version`命令指定版本进行回滚。

### 6.3 数据恢复
- 从备份恢复项目文件
- 重新安装依赖：`npm install`
- 重新构建项目：`npm run build`

## 7. 安全规范

### 7.1 API密钥管理
- 敏感信息存储在环境变量中
- 前端不直接存储API密钥，通过后端代理请求
- 定期轮换密钥，避免长期使用同一密钥

### 7.2 安全审计
定期运行`npm run security-audit`检查依赖包的安全漏洞，及时更新存在风险的依赖。

## 8. 性能优化

### 8.1 组件优化
- 使用React.memo避免不必要的重渲染
- 使用useCallback和useMemo缓存函数和计算结果
- 图片和媒体资源使用适当的格式和压缩

### 8.2 API调用优化
- 实现请求缓存机制
- 使用防抖和节流处理频繁触发的请求
- 合理设置请求超时和错误重试机制

## 9. 附录

### 9.1 常见问题处理
- **搜索功能异常**：检查API配置和searchEndpointId是否正确
- **文本选择不可见**：检查`::selection`样式定义，确保使用明显的背景色
- **模型不可用**：使用`isModelAvailable`函数检查模型状态

### 9.2 开发资源
- Next.js文档：https://nextjs.org/docs
- React文档：https://reactjs.org/docs/getting-started.html
- Tailwind CSS文档：https://tailwindcss.com/docs
- Zustand文档：https://zustand-demo.pmnd.rs/

---

文档版本：1.0.0  
最后更新：2025-10-29
