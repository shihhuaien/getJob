# 專案案例：Home Bar（居家調酒指南）

> 技術棧：Expo + TypeScript + Supabase + React Native Paper MD3
> 狀態：功能 100% 完成，準備上架
> 商業模式：一次性付費（App Store Tier 3，約 NT$90 / USD $2.99）

---

## 一、專案概述

### 產品願景

> 「不用去酒吧，在家就能調出有故事的雞尾酒。」

### 目標用戶

- **主要**：25–40 歲上班族，對生活品味有追求，偶爾在家招待朋友或獨自小酌
- **次要**：對調酒有興趣的新手入門者

### 核心功能

- 30 種精選雞尾酒食譜（含 AI 生成圖片、完整步驟、歷史故事）
- 4 維度篩選（基底烈酒、難度、風味、場合）
- 反向查詢（依手邊現有烈酒篩選可調酒譜）
- 購物清單（合併去重、勾選已購、分享、離線可用）
- 調酒日記（標記已嘗試、星級評分、品飲筆記）
- 收藏功能
- 探索頁（調酒知識卡片、經典故事）

---

## 二、技術架構

| 領域 | 技術 |
|------|------|
| 前端 | Expo + React Native + TypeScript |
| 後端 | Supabase（PostgreSQL + Auth + Storage + RLS） |
| UI 框架 | React Native Paper MD3（Dark Theme） |
| 狀態管理 | React Query（server state）+ AsyncStorage（local） |
| 資料驗證 | Zod |
| 登入 | Email + Apple Sign-in + Google Sign-in |
| 設計風格 | Midnight Lounge（琥珀金 + 深曜黑 + 毛玻璃） |

### Bundle ID

`com.thdg.homebar`

---

## 三、資料模型

| 資料表 | 說明 | RLS |
|--------|------|-----|
| `cocktails` | 雞尾酒主表 | 公開讀取 |
| `ingredients` | 原料主表（含台灣購買管道） | 公開讀取 |
| `cocktail_ingredients` | 關聯表 | 公開讀取 |
| `user_favorites` | 收藏 | 使用者只能讀寫自己的 |
| `cocktail_diary` | 品飲記錄 | 使用者只能讀寫自己的 |
| `tips` | 調酒知識 | 公開讀取 |

---

## 四、關鍵決策紀錄

| 決策 | 結果 | 理由 |
|------|------|------|
| 付費模式 | 一次性買斷 | 簡化商業邏輯，無需 StoreKit/RevenueCat |
| 狀態管理 | React Query | 自動快取、stale-while-revalidate、error state |
| 資料驗證 | Zod | 型別安全 + runtime 驗證，custom hook 層就做驗證 |
| 食譜圖片 | AI 生成（Gemini） | 快速內容建設、可控品質、1200×800 JPG、Supabase Storage |
| 分享方式 | 純文字格式 | 嘗試 `react-native-view-shot` 截圖不穩定，純文字在 LINE/IG 更可靠 |
| ESLint | v9 Flat Config | 新專案統一用新標準 |

---

## 五、獨特踩坑經驗

### 5.1 酒精 App 年齡驗證合規

- 必須有明確的「我已年滿 18 歲」確認按鈕（不能只用日期選擇器）
- 使用 AsyncStorage 記憶驗證狀態，不需每次重新確認
- 文案中不可出現「暢飲」等鼓勵過量飲酒的字眼
- App Store 截圖不可含未成年人視覺元素
- 年齡評級必須設為 17+

### 5.2 跨 Tab 購物清單狀態同步

- **問題**：在食譜頁加入購物清單後，切換到購物清單 Tab 看不到新項目
- **原因**：useState 在 Tab 切換時不會重新初始化
- **解法**：使用 `useFocusEffect` 在每次 Tab 聚焦時重新從 AsyncStorage 讀取

### 5.3 分享食譜方案選擇

- **方案 A**：`react-native-view-shot` 截圖 → iOS 不穩定，部分裝置截圖空白
- **方案 B（採用）**：純文字格式（標題 → 難度/基底 → 食材 → 步驟 → watermark）
- **結論**：純文字在 LINE、IG Notes 等 App 中更可靠且易讀

### 5.4 Zod 驗證的最佳位置

- 所有來自 Supabase 的資料都在 custom hook 層驗證
- Component 層不需重複驗證，信任 hook 回傳的型別

---

## 六、專案狀態

- ✅ 核心功能開發 100% 完成
- ✅ 30 筆食譜 + 30 張 AI 圖片 + 14 筆知識 tips
- ✅ Auth（Email + Apple + Google）
- ✅ Splash Screen + App Icon
- ⏳ Supabase Dashboard OAuth Provider 啟用
- ⏳ App Store Connect 素材與隱私標籤
