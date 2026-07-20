# PetOS-Agent

PetOS 公开仓：推广落地页 + 安装包发布（GitHub Releases）。

**PetOS** 是常驻桌面的宠物 Agent。陪伴、自主活动、自备大模型接口；密钥与数据默认保存在本机。

## 下载

最新安装包：

**https://github.com/omlovelife/PetOS-Agent/releases/latest**

## 推广站

源码在 [`web/`](./web)。本地预览：

```bash
cd web
npm install
npm run dev
```

构建：

```bash
cd web
npm run build
```

### 部署到 Vercel

1. Import 本仓库 `omlovelife/PetOS-Agent`
2. 使用仓库根目录的 `vercel.json`（已配置 `web` 构建与 `web/dist` 输出）
3. 部署后把官网下载按钮保持指向本仓 Releases 即可

也可在 Vercel 手动设置：Root Directory = `web`，Build = `npm run build`，Output = `dist`。

## 发布安装包

安装包**不要**提交进 git。使用 GitHub Releases 上传，例如：

```bash
gh release create v0.1.0 ./PetOS-Setup-0.1.0.exe ./latest.yml \
  --repo omlovelife/PetOS-Agent \
  --title "PetOS v0.1.0" \
  --notes "PetOS 桌面端 0.1.0"
```

开发在私有主仓进行；本仓只承载官网与公开发版产物。

## 联系

微信：`lifemindx`
