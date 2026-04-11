# 專案案例：WedSnap（婚禮照片牆）

> 技術棧：Expo + JavaScript/JSDoc + Supabase + Next.js 16（Monorepo）
> 狀態：已送審 App Store（2026-03-26）
> 商業模式：免費下載 + 訂閱制（RevenueCat），月 $9.99 / 年 $49.99

---

## 一、專案概述

### 產品願景

一站式婚禮照片即時互動平台，解決新人與賓客在婚禮現場的照片收集困難。

### 目標用戶

- **主要**：即將舉辦婚禮的新人（活動管理者）
- **次要**：婚禮賓客（照片上傳者）、婚禮企劃公司

### 核心使用流程

1. 新人在 iOS App 建立活動 → 生成 QR Code
2. 賓客掃碼進入 Web 上傳頁面 → 上傳照片 + 祝福留言
3. App 即時在投影螢幕上輪播（Display 模式，3 套主題：拍立得/精靈之森/夜空）
4. 活動結束 → 一鍵 ZIP 打包下載所有照片
5. 分享活動回憶頁（Recap）作為永久紀念

---

## 二、技術架構

| 領域 | 技術 |
|------|------|
| Mobile 前端 | Expo SDK 54+（React Native）、JavaScript + JSDoc |
| Web 前端 | Next.js 16（App Router）、Tailwind CSS、Framer Motion |
| 後端 | Supabase PostgreSQL + RLS + Auth + Storage + Edge Functions |
| 認證 | Sign in with Apple + Google OAuth + Email |
| 訂閱 | RevenueCat SDK + Webhook → Supabase DB |
| 多語系 | i18next + react-i18next（繁中/英文） |
| UI 風格 | Soft Neumorphism（米白底 + 柔和陰影） |
| 架構 | Monorepo（Yarn Workspaces：mobile-admin + web-client + supabase） |

### Bundle ID

`com.thdg.weddingadmin`

---

## 三、資料模型

| 資料表 | 關鍵欄位 | RLS |
|--------|---------|-----|
| `profiles` | subscription_status, subscription_expires_at, trial_ends_at, subscription_override | 公開讀取 |
| `events` | owner_id, name, slug(UNIQUE), theme | 公開讀取 + 擁有者 CRUD + 數量限制 |
| `photos` | event_id, url, message(≤100字), is_visible | 公開 INSERT（有限制）+ 公開讀取 |

### 安全輔助函式（SECURITY DEFINER）

| 函式 | 用途 |
|------|------|
| `is_active_subscriber(user_id)` | 判斷有效訂閱者（active 或 trial 未過期） |
| `check_photo_limit(event_id)` | 檢查照片上限（< 500 張/場） |
| `check_event_limit(user_id)` | 檢查活動上限（免費 1 場 / 訂閱 3 場） |

---

## 四、訂閱制架構詳解

### 架構原則：DB 為唯一真相來源

```
用戶購買 → App Store → RevenueCat → Webhook → Supabase Edge Function → DB 更新
                                                                           ↓
App 啟動 → 讀取 DB subscription_status → 判斷功能權限
```

### 訂閱狀態值

| 狀態 | 說明 |
|------|------|
| `free` | 免費用戶（試用已過期或從未試用） |
| `active` | 訂閱中 |
| `cancelled` | 已取消但未到期 |
| `expired` | 已到期 |

### 7 天 App 自管試用

- `trial_ends_at` 欄位記錄試用到期時間
- 不依賴 Apple 的 Trial Offer（需付費方案）
- 試用期間所有功能開放（同 active）
- 到期後統一鎖定所有功能

### Admin Override

- `subscription_override` 為 `true` 時，Webhook 不覆蓋該用戶狀態
- 支援手動升級/降級測試帳號

### RevenueCat SDK 用途限制

- ✅ 發起購買（`purchasePackage`）
- ✅ 取得方案列表（`getOfferings`）
- ✅ 還原購買（`restorePurchases`）
- ❌ 不用於判斷訂閱狀態（改從 DB 讀取）

---

## 五、關鍵決策紀錄

| 決策 | 結果 | 理由 |
|------|------|------|
| 架構 | Monorepo（Yarn Workspaces） | 共享 i18n、統一依賴管理、Mobile + Web 同時迭代 |
| 語言 | JavaScript + JSDoc（非 TypeScript） | 初期快速迭代，上架時間緊迫 |
| UI 風格 | Soft Neumorphism（StyleSheet） | 品牌差異化、婚禮感、RN 原生效能更好 |
| 訂閱狀態 | Supabase DB 唯一真相 | 避免 RevenueCat SDK + DB 不一致 |
| 試用 | 7 天 App 自管 | 不依賴 Apple Trial Offer，邏輯簡潔 |
| 活動上限 | 3 場 | 防止濫用、降低成本、支援主場景（訂婚+婚禮+歸寧） |
| 照片上限 | 500 張/場 | DB 層 SECURITY DEFINER 強制限制 |
| 留言長度 | 100 字元 | 視覺平衡，DB CHECK constraint 強制 |

---

## 六、獨特踩坑經驗

### 6.1 訂閱狀態架構重構

- **問題**：初期同時依賴 RevenueCat SDK + Supabase DB 判斷訂閱狀態，兩邊不一致
- **解法**：改為 DB 唯一真相來源。RevenueCat SDK 僅用於購買動作，狀態一律從 DB 讀取
- **教訓**：訂閱狀態有且只有一個真相來源，決不雙軌並行

### 6.2 Realtime 訂閱記憶體洩漏

- **問題**：照片列表 Realtime 訂閱未在 component unmount 時清理，導致記憶體洩漏
- **解法**：useEffect cleanup 中明確呼叫 `supabase.removeChannel(channel)`

### 6.3 RevenueCat Webhook 驗證

- **問題**：Edge Function 無法驗證 Webhook Secret
- **解法**：確保 `REVENUECAT_WEBHOOK_SECRET` 在 Supabase Secret 正確設定，Edge Function 使用 `--no-verify-jwt` 並自行驗證 secret

### 6.4 Distribution Certificate WWDR 憑證

- **問題**：本地打包時 `Distribution certificate hasn't been imported successfully`
- **解法**：根據 Distribution Cert 的 issuer 版本（G3 或 G4）下載對應 WWDR 中繼憑證並安裝至系統 Keychain

### 6.5 Math.random() Next.js Lint 錯誤

- **問題**：`Math.random()` 在 display/page.js 被認為是 impure function
- **解法**：將隨機值移至 `useState` 初始化階段

---

## 七、多語系架構

| 平台 | 語言偵測 | 方案 |
|------|---------|------|
| Mobile | `NativeModules.SettingsManager`（後改用 `expo-localization`） | i18next 同步初始化 |
| Web | `i18next-browser-languagedetector` | 自動偵測瀏覽器語言 |

- 非中文裝置預設英文
- iOS 權限字串 locale code：`zh-Hant`（非 `zh-TW`），否則 fallback 到英文

---

## 八、專案狀態

- ✅ MVP + v2.0 核心功能 100% 完成
- ✅ App Store 20 項防退件檢查清單全部通過
- ✅ TestFlight 真機測試驗證
- ✅ 已送審 App Store（2026-03-26）
- ⏳ 等待 Apple 審核結果

### 未來規劃

- AI 自動過濾不當照片
- Push Notification（新照片通知）
- Lifetime Pass 定價方案
- Android 支援評估
