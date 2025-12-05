# Google 网站验证设置指南

本指南将帮助你在 Google Search Console 和 Google Analytics 中添加域名并获取验证码。

## 方法一：Google Search Console 验证（推荐）

### 步骤 1：访问 Google Search Console

1. 打开浏览器，访问：https://search.google.com/search-console
2. 使用你的 Google 账号登录

### 步骤 2：添加属性（网站）

1. 在左侧菜单中，点击**"属性"**下拉菜单
2. 选择**"添加属性"**
3. 选择**"网址前缀"**（推荐，更简单）
4. 输入你的完整域名，例如：
   ```
   https://circlecropimage.qzboat.com
   ```
5. 点击**"继续"**按钮

### 步骤 3：选择验证方法

Google 会显示多种验证方法，选择**"HTML 标签"**方法：

1. 在验证方法列表中，找到**"HTML 标签"**
2. 你会看到类似这样的代码：
   ```html
   <meta name="google-site-verification" content="abc123xyz4567890" />
   ```
3. **复制 `content` 属性中的值**（例如：`abc123xyz4567890`）
   - 这就是你的验证码！

### 步骤 4：配置验证码到项目

1. 打开项目的 `.env.local` 文件（如果不存在，从 `env.example` 复制）

2. 添加以下配置：
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="你的验证码"
   ```
   
   例如：
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="abc123xyz4567890"
   ```

3. 保存文件

### 步骤 5：部署到生产环境

1. 提交代码更改：
   ```bash
   git add .
   git commit -m "Add Google Search Console verification"
   git push
   ```

2. 如果使用 Vercel，还需要在 Vercel 项目设置中添加环境变量：
   - 进入 Vercel 项目设置
   - 找到 "Environment Variables"
   - 添加 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`，值为你的验证码

3. 等待部署完成

### 步骤 6：验证网站

1. 回到 Google Search Console
2. 点击**"验证"**按钮
3. 如果验证成功，你会看到"验证成功"的消息
4. 现在你的网站已经添加到 Google Search Console 了

---

## 方法二：Google Analytics 设置

### 步骤 1：访问 Google Analytics

1. 打开浏览器，访问：https://analytics.google.com
2. 使用你的 Google 账号登录

### 步骤 2：创建属性（如果还没有）

1. 点击左下角的**"管理"**（齿轮图标）
2. 在"属性"列中，点击**"创建属性"**
3. 填写属性信息：
   - **属性名称**：例如 "Circle Crop Image"
   - **报告时区**：选择你的时区
   - **货币**：选择你的货币
4. 点击**"下一步"**

### 步骤 3：配置数据流

1. 选择**"网站"**
2. 填写网站信息：
   - **网站网址**：例如 `https://circlecropimage.qzboat.com`
   - **数据流名称**：例如 "Circle Crop Image Website"
3. 点击**"创建数据流"**

### 步骤 4：获取 Google Analytics ID

1. 创建数据流后，你会看到一个**"测量 ID"**
   - 格式类似：`G-XXXXXXXXXX`
2. **复制这个测量 ID**

### 步骤 5：配置 Google Analytics ID 到项目

1. 打开项目的 `.env.local` 文件

2. 添加以下配置：
   ```bash
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="你的测量ID"
   ```
   
   例如：
   ```bash
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-ABC123XYZ4"
   ```

3. 保存文件

### 步骤 6：部署到生产环境

1. 提交代码更改并推送到仓库
2. 在 Vercel 中添加环境变量（如果使用 Vercel）
3. 等待部署完成

---

## 验证配置是否生效

### 检查 Google Search Console 验证码

1. 部署完成后，访问你的网站
2. 右键点击页面，选择"查看页面源代码"
3. 搜索 `google-site-verification`
4. 你应该能看到类似这样的代码：
   ```html
   <meta name="google-site-verification" content="你的验证码" />
   ```

### 检查 Google Analytics

1. 部署完成后，访问你的网站
2. 打开浏览器开发者工具（F12）
3. 切换到 "Network" 标签
4. 刷新页面
5. 你应该能看到向 `google-analytics.com` 发送的请求

---

## 常见问题

### Q: 验证失败怎么办？

**A:** 检查以下几点：
1. 确保验证码已正确添加到 `.env.local` 文件
2. 确保环境变量已部署到生产环境
3. 等待几分钟后重试（DNS 和缓存可能需要时间）
4. 确保网站可以正常访问（没有 404 错误）

### Q: 本地开发环境需要设置吗？

**A:** 不需要。验证码只在生产环境生效。本地开发时，即使设置了环境变量，也不会影响验证。

### Q: 可以同时使用 Google Search Console 和 Google Analytics 吗？

**A:** 可以！这两个服务是互补的：
- **Google Search Console**：用于网站搜索优化和索引管理
- **Google Analytics**：用于网站流量分析和用户行为追踪

### Q: 验证码会过期吗？

**A:** 不会。一旦验证成功，验证码会一直有效，除非你删除属性或重新验证。

---

## 总结

1. **Google Search Console**：用于网站验证和 SEO
   - 获取验证码：`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   
2. **Google Analytics**：用于网站分析
   - 获取测量 ID：`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`

两个服务可以同时使用，互不冲突。

---

**需要帮助？** 如果遇到问题，请检查：
- 环境变量是否正确设置
- 代码是否已部署到生产环境
- 网站是否可以正常访问

