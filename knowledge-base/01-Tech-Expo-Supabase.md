# 技術棧附錄：Expo + Supabase

> 搭配 `00-iOS-App-Framework-Universal.md` 使用。
> 經驗來源：Home Bar（TypeScript）、WedSnap（JavaScript + JSDoc）。

---

## 一、CLAUDE.md 技術棧專屬段落

### 1.1 AI 角色定義範例

```markdown
你是一位資深的 React Native (Expo) 與 Supabase 全端工程師。
```

### 1.2 語言規範

根據專案需求選擇 TypeScript 或 JavaScript：

```markdown
<!-- TypeScript 專案（如 Home Bar） -->
- TypeScript 嚴格模式：修改後執行 `npx tsc --noEmit` 確認無型別錯誤。

<!-- JavaScript 專案（如 WedSnap） -->
- 專案使用 JavaScript（非 TypeScript），以 JSDoc 進行型別註解。
- 新增或修改程式碼時，須補上 JSDoc 型別定義（@typedef、@param、@returns）。
```

### 1.3 Supabase 規範

```markdown
### Supabase 查詢規範
- 所有查詢集中在 `hooks/` 內的 custom hook，不直接在 component 中寫查詢。
- 所有查詢結果須對應型別定義。
- 撰寫查詢前必須先查看型別定義檔，嚴禁憑空猜測欄位名稱。
- RLS 政策已啟用，撰寫查詢時需考慮使用者身份與資料權限。

### Supabase Migration 規範
- 每次 schema 變更都必須建立 migration 檔案，不可直接在 Dashboard 手動修改。
- Schema 變更（DDL）與資料變更（DML）必須分開為不同 migration 檔案。
- 已上線的 migration 檔案不可修改或刪除；若需修正，建立新的 migration。
- 大型資料表的索引建立使用 `CREATE INDEX CONCURRENTLY`。
- 零停機變更採用 Expand-Contract 模式。

### Supabase Edge Functions 規範
- 需要 Admin 權限的操作（帳號刪除、webhook 處理）透過 Edge Functions 實作。
- Edge Functions 使用 `SUPABASE_SERVICE_ROLE_KEY`，透過 Dashboard Secret 設定。
- 外部 webhook endpoint 設定 `--no-verify-jwt`，並自行驗證 webhook secret。
```

### 1.4 前端狀態管理

- **Server State**：建議使用 TanStack Query (React Query) 處理 Supabase 資料拉取與快取。
- **Client State**：AsyncStorage 處理本地偏好設定、年齡驗證等。
- **若專案規模較小**：可先用 custom hooks + useEffect，但須在 TECHNICAL_DOCS.md 記錄此決策。

---

## 二、安全性規範（Supabase 專屬）

```markdown
- 使用參數化查詢，禁止字串拼接 SQL。
- RLS 為強制要求：所有涉及使用者資料的資料表必須啟用 Row Level Security。
- 數量限制必須在 DB 層實作 SECURITY DEFINER 函式，前端檢查僅為 UX 輔助。
- 定期執行 `npm audit` 檢查已知漏洞。
```

**SECURITY DEFINER 函式範例**：

```sql
CREATE OR REPLACE FUNCTION check_item_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT count(*) FROM items WHERE owner_id = p_user_id) < 10;
END;
$$;

-- 在 RLS 中使用
CREATE POLICY "limit_insert" ON items
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
    AND check_item_limit(auth.uid())
  );
```

---

## 三、程式碼品質規範

```markdown
- 圖片元件統一使用 `expo-image`（cachePolicy="disk"），不使用 React Native 的 `Image`。
- Immutable 資料更新：一律使用 spread operator 或 map/filter，不可直接 mutate state。
- Context 的 consumer 必須處理 null/undefined 初始值，不可直接 throw。
- 所有非同步操作（Auth、SDK 初始化、Realtime 訂閱、AsyncStorage）必須加 try-catch。
```

---

## 四、開發、測試、上線流程

### 4.1 開發階段

```bash
# 必須使用 development build，不可用 Expo Go（原生模組不支援）
npx expo start --dev-client -c
```

### 4.2 測試階段

```bash
npx expo lint                                    # Lint 檢查
eas build --platform ios --profile preview       # 內部測試版（Ad Hoc）
eas build --platform ios --profile preview --local  # 本地打包
```

### 4.3 上線

```bash
# 更新 app.json 的 version（Bug: 1.0.1 / 小功能: 1.1.0 / 大改版: 2.0.0）
# buildNumber 由 EAS autoIncrement 自動處理

eas build --platform ios --profile production    # 正式 build
eas submit --platform ios --latest               # 提交 App Store
```

### 4.4 Supabase Schema 變更流程

```bash
npx supabase migration new add_some_feature     # 1. 產生 migration
# 2. 撰寫 SQL（DDL 與 DML 分開）
npx supabase db push                             # 3. 部署 production
# 4. 重新產生型別（TypeScript 專案）
npx supabase gen types typescript --local > lib/database.types.ts
```

### 4.5 Edge Functions 部署

```bash
npx supabase functions serve                     # 本地測試
npx supabase functions deploy function-name      # 部署
npx supabase functions deploy webhook --no-verify-jwt  # Webhook（不驗 JWT）
npx supabase secrets set SECRET_NAME=value       # 設定 Secret
```

---

## 五、新專案啟動 Checklist（Expo + Supabase 專屬）

### 5.1 專案初始化

- [ ] `npx create-expo-app {app-name} --template`
- [ ] `eas init`（取得 EAS Project ID）
- [ ] 建立 `eas.json`（development / preview / production，production 開啟 `autoIncrement`）
- [ ] 設定 `app.json`：name、slug、scheme、bundleIdentifier、`ITSAppUsesNonExemptEncryption: false`、`supportsTablet: false`
- [ ] 安裝核心套件：`@supabase/supabase-js`、`expo-image`
- [ ] 建立 `lib/supabase.js`（或 `.ts`）
- [ ] 建立 `lib/theme.js`（設計系統）
- [ ] 建立 `.env`（本地）+ `eas env:create`（EAS 雲端）
- [ ] 設定 ESLint

### 5.2 Auth 設定

- [ ] 安裝 `expo-apple-authentication`
- [ ] 安裝 `@react-native-google-signin/google-signin`
- [ ] Apple Developer → 啟用 Sign in with Apple capability
- [ ] Google Cloud Console → 建立 OAuth 用戶端（Web + iOS 兩組）
- [ ] Supabase Dashboard → 啟用 Apple/Google Provider
- [ ] Supabase Google Provider → 開啟 **Skip nonce checks**

### 5.3 訂閱制（若需要）

- [ ] RevenueCat 建立專案 → 連接 App Store Connect
- [ ] 建立 Products → Entitlement → Offering
- [ ] 設定 Webhook → 指向 Supabase Edge Function
- [ ] 安裝 `react-native-purchases`
- [ ] Supabase 設定 `REVENUECAT_WEBHOOK_SECRET`

### 5.4 多語系（若需要）

- [ ] 安裝 `i18next`、`react-i18next`、`expo-localization`
- [ ] 建立 `lib/i18n/index.js`、翻譯資源檔
- [ ] 建立 iOS 權限本地化檔案 `locales/en.json`、`locales/zh-Hant.json`
- [ ] `app.json` → `expo.locales` 註冊

> **重要**：iOS locale code 為 `zh-Hant`（非 `zh-TW`）。i18n 初始化必須同步（不可 async），否則首次渲染閃現英文。

---

## 六、推薦目錄結構

### 6.1 純 Mobile App（如 Home Bar）

```
app/                        # Expo Router
  _layout.js                # Root layout
  index.js                  # 首頁或登入頁
components/                 # 可複用 UI 元件
  ui/                       # 設計系統基礎元件
contexts/                   # React Context
hooks/                      # Custom hooks（Supabase 查詢、Auth）
locales/                    # iOS 權限字串本地化
  en.json
  zh-Hant.json              # ⚠️ 非 zh-TW
lib/
  supabase.js               # Supabase client
  theme.js                  # 設計系統
  logger.js                 # 統一錯誤記錄
  i18n/                     # 多語系
supabase/
  functions/                # Edge Functions
  migrations/               # SQL migration
assets/                     # 靜態資源
```

### 6.2 Monorepo — Mobile + Web（如 WedSnap）

```
project-root/
├── mobile-admin/           # Expo React Native App
│   ├── app/                # Expo Router
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── locales/
│   ├── lib/
│   ├── app.json
│   └── eas.json
├── web-client/             # Next.js Web App
│   └── src/
│       ├── app/            # App Router
│       └── lib/
├── supabase/
│   ├── functions/
│   └── migrations/
├── CLAUDE.md
├── PRD.md
└── TODO.md
```

---

## 七、常見功能實作模式

### 7.1 訂閱制架構（RevenueCat + Supabase）

**推薦模式**：DB 為唯一真相來源。

```
App Store → RevenueCat → Webhook → Supabase DB → App 讀取
```

- RevenueCat SDK 僅用於：發起購買、取得方案列表、還原購買
- 訂閱狀態**只從 Supabase DB 讀取**，不從 RevenueCat SDK 判斷
- 支援 Admin Override：`subscription_override` 為 `true` 時，Webhook 不覆蓋
- 7 天 App 自管試用：`trial_ends_at` 欄位，到期後統一鎖定 UX

### 7.2 帳號刪除（Edge Function）

Apple 強制要求。Edge Function 使用 `SUPABASE_SERVICE_ROLE_KEY` 呼叫 Admin API：

1. 確認對話框 → 2. 呼叫 Edge Function → 3. 清除關聯資料 → 4. `auth.admin.deleteUser(userId)` → 5. 登出 → 6. 導回登入頁

**軟刪除 vs 硬刪除**：若有合規需求保留交易紀錄，應實作個資匿名化而非純粹刪除。

### 7.3 Realtime 即時同步

```javascript
const channel = supabase
  .channel('changes')
  .on('postgres_changes', {
    event: '*', schema: 'public', table: 'target_table',
    filter: `column=eq.${value}`
  }, (payload) => { /* 處理變更 */ })
  .subscribe()

// 清理訂閱（useEffect cleanup）
return () => { supabase.removeChannel(channel) }
```

### 7.4 i18n 多語系

- **語言偵測**（Mobile）：使用 `expo-localization` 的 `getLocales()`（同步 API）
- **i18next 初始化必須同步**：不可用 async/await，否則首次渲染閃現 fallback 語言
- **非中文裝置預設英文**
- **iOS 權限字串本地化**：locale code 必須用 `zh-Hant`（非 `zh-TW`）

---

## 八、踩坑紀錄（Expo + Supabase 專屬）

### 8.1 EAS Build & 環境變數

| # | 踩坑 | 說明 |
|---|------|------|
| 1 | EAS 環境變數必須手動設定 | 本地 `.env` 不帶入雲端 build。未設定 → Supabase 初始化失敗 → App crash。用 `eas env:create` 設定 |
| 2 | 本地打包使用本地 `.env` | `eas build --local` 從專案目錄讀取，不需 EAS 雲端設定 |
| 3 | `eas submit` 需要 `ascAppId` | 首次 submit 需互動模式登入。完成後將 `ascAppId` 寫入 `eas.json` |
| 4 | `buildNumber` 由 EAS 自動遞增 | `eas.json` production profile 設定 `"autoIncrement": true` |
| 5 | 只有 production profile 能上傳 TestFlight | development / preview 使用 Ad Hoc 簽署，上傳會被拒絕 |

### 8.2 原生模組 & Expo

| # | 踩坑 | 說明 |
|---|------|------|
| 6 | 必須用 Development Build | 原生模組（Apple Auth、Google Sign-In、RevenueCat）無法在 Expo Go 中運行 |
| 7 | 新增原生套件後必須重新打包 | 安裝 `react-native-purchases` 等後需重新 `eas build --profile development` |
| 8 | `expo-image` 取代 RN `Image` | 內建 Image 無磁碟快取。統一用 `expo-image` + `cachePolicy="disk"` |
| 9 | Splash Screen 控制 | `_layout.js` module scope 呼叫 `preventAutoHideAsync()`，待 Auth 完成再 `hideAsync()` |
| 10 | `npx expo install` 確保版本相容 | 手動 `npm install` 可能安裝不相容版本 |

### 8.3 第三方登入

| # | 踩坑 | 說明 |
|---|------|------|
| 11 | Google Sign-In idToken 結構變更 | v13+ 的 idToken 移到 `data` 物件內。需用 `userInfo?.data?.idToken \|\| userInfo?.idToken` |
| 12 | Supabase Google Provider 必須開 Skip nonce | React Native 無法傳遞 nonce，不開會驗證失敗 |
| 13 | Apple Sign-In 純 iOS 不需 .p8 密鑰 | 只需在 Apple Developer 啟用 capability + Supabase 填入 Bundle ID |

### 8.4 Supabase & 資料庫

| # | 踩坑 | 說明 |
|---|------|------|
| 14 | Migration DDL 與 DML 分開 | 混合 schema + 資料變更，中途失敗會導致難以回復 |
| 15 | 數量限制必須在 DB 層實作 | 前端檢查可被繞過，使用 SECURITY DEFINER 函式 |
| 16 | Webhook endpoint 用 `--no-verify-jwt` | 外部服務呼叫時不帶 JWT，需關閉驗證並自行驗證 secret |

### 8.5 閃退防護

| # | 踩坑 | 說明 |
|---|------|------|
| 17 | Auth 回呼中的 SDK 同步加 try-catch | RevenueCat 登入/登出失敗不可中斷 Auth 流程 |
| 18 | Context consumer 處理 null | 初始值為 null 時應返回安全預設值而非 throw |
| 19 | Realtime subscribe 加 try-catch | 訂閱失敗不應導致整頁閃退 |
| 20 | response.json() 加 try-catch | Edge Function 回傳非 JSON（如 500 HTML）時會 throw |
| 21 | optional chaining 存取深層物件 | SDK 回傳結構可能不完整，如 `entitlements?.active?.premium` |

### 8.6 本地打包（EAS Local Build）

| # | 踩坑 | 說明 |
|---|------|------|
| 22 | WWDR 中繼憑證 | 本地打包需安裝 Apple WWDR 憑證，依 Distribution Cert 的 issuer（G3 或 G4）下載對應版本 |
| 23 | Xcode 26+ 不內建 iOS SDK | 需手動至 Xcode → Settings → Components 下載 iOS 平台 |
| 24 | 本地打包需額外工具 | CocoaPods（`brew install cocoapods`）、Fastlane、EAS CLI |

### 8.7 其他

| # | 踩坑 | 說明 |
|---|------|------|
| 25 | 跨 Tab 狀態同步 | 使用 `useFocusEffect` 在 Tab 切換時重新讀取 AsyncStorage |
| 26 | 分享功能方案選擇 | `react-native-view-shot` 在 iOS 不穩定，純文字分享更可靠 |
| 27 | ESLint v9 Flat Config | 使用 `eslint.config.js` 替代 `.eslintrc.json`，需明確引入 parser |
| 28 | 訂閱狀態架構 | 不可同時依賴 RevenueCat SDK + DB，改為 DB 唯一真相來源 |
| 29 | Realtime 訂閱洩漏 | useEffect cleanup 必須呼叫 `subscription.unsubscribe()` |
