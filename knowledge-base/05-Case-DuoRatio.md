# 專案案例：DuoRatio（雙鏡頭同步錄影）

> 技術棧：Swift 6 + SwiftUI + AVFoundation（AVCaptureMultiCamSession）
> 狀態：v1.0 準備上架（2026-04）
> 商業模式：一次性付費 CA$3.99

---

## 一、專案概述

### 產品願景

> 「拍一次，得兩片」— 利用 iPhone 後置雙鏡頭，一次錄影同時輸出 portrait + landscape 兩個獨立影片檔。

### 目標用戶

- **主要**：台灣/港澳內容創作者（YouTuber、社群小編），需同時產出直式與橫式素材
- **次要**：活動拍攝者、自媒體經營者、影像工作室

### 獨特定位

後置雙鏡頭 → 直式 9:16 + 橫式 16:9（非前+後拍攝）。超廣角拍橫式、廣角拍直式。

### 核心功能

- 雙鏡頭模式：後置廣角 + 超廣角同時錄影 → 2 個同步影片
- 單鏡頭模式：前置/後置 → 從中央裁切輸出直式 + 橫式
- 解析度：4K / 1080p，幀率：24 / 30 / 60 fps，格式：MOV / MP4
- 即時儲存空間估算、手電筒、溫度監控、雙預覽

---

## 二、AVCaptureMultiCamSession 架構

### 2.1 Session 架構

```
AVCaptureMultiCamSession
├── Input: 廣角鏡頭（builtInWideAngleCamera）
│   └── Connection → VideoDataOutput A → AVAssetWriter A（直式 9:16）
├── Input: 超廣角鏡頭（builtInUltraWideCamera）
│   └── Connection → VideoDataOutput B → AVAssetWriter B（橫式 16:9）
└── Input: 麥克風（builtInMicrophone）
    └── AudioDataOutput → 兩個 Writer 共用
```

### 2.2 雙 AVAssetWriter 同步寫入

- 兩個 Writer 使用相同的 `sourceTime` 確保音視訊同步
- 錄影開始時先等到兩邊都收到第一個 video sample，再開始寫入
- 停止時先停止追加 sample，再依序 `markAsFinished` → `finishWriting`

### 2.3 關鍵時序

```
按下錄影 → 建立暫存檔 → 設定 Writer Input
→ startWriting → 等待首幀 → 開始追加 sample
→ ... 錄影中 ...
→ 按下停止 → 停止追加 → markAsFinished → finishWriting
→ 兩個檔案存入相簿「DuoRatio」自訂相簿
```

---

## 三、裝置相容性矩陣

### 3.1 MultiCamSession 支援（A12+）

| 機型 | 晶片 | 雙鏡頭模式 | 超廣角 |
|------|------|-----------|--------|
| iPhone XS/XR | A12 | ✅ | ✅ |
| iPhone 11 系列 | A13 | ✅ | ✅ |
| iPhone 12 系列 | A14 | ✅ | ✅ |
| iPhone 13 系列 | A15 | ✅ | ✅ |
| iPhone 14 系列 | A15/A16 | ✅ | ✅ |
| iPhone 15 系列 | A16/A17 | ✅ | ✅ |
| iPhone 16 系列 | A18 | ✅ | ✅（48MP） |
| iPhone SE | — | ❌ 單鏡頭降級 | ❌ |

### 3.2 48MP 超廣角特殊處理

iPhone 16 系列的超廣角升級為 48MP，`DeviceCapabilityService` 需偵測並納入可用格式組合。

### 3.3 降級策略

不支援 MultiCam 的裝置：
1. 自動切換為標準 `AVCaptureSession`
2. 使用 `CIImage` 從 sensor 原始畫面中央分別裁切出 16:9 與 9:16 區域
3. 顯示一次性提示告知使用者

---

## 四、熱管理與記憶體監控

### 4.1 thermalState 四級處理

| 等級 | 處理 |
|------|------|
| `.nominal` | 正常運作 |
| `.fair` | 正常運作，UI 不提示 |
| `.serious` | UI 警告橫幅「裝置溫度偏高」，建議但不強制停止 |
| `.critical` | 自動停止錄影（`emergencyStopRecording`），保存已錄內容 |

### 4.2 記憶體監控

- 使用 `os_proc_available_memory` 每秒檢查
- < 100MB → UI 警告
- < 50MB → 自動停止錄影

### 4.3 資料吞吐量參考

雙鏡頭 4K30fps 錄影約 ~1.5GB/min 的 raw 資料（壓縮後約 ~60MB/min/檔）。

---

## 五、影片輸出規格

### 5.1 解析度對照表

| 設定 | 直式（9:16） | 橫式（16:9） |
|------|-------------|-------------|
| 4K | 2160×3840 | 3840×2160 |
| 1080p | 1080×1920 | 1920×1080 |

### 5.2 編碼設定

- 編碼器：HEVC (H.265)
- 位元率：4K 約 15-20 Mbps，1080p 約 8-12 Mbps
- 檔案格式：MOV（預設）或 MP4

### 5.3 儲存

- 暫存：`FileManager.default.temporaryDirectory` 中的 UUID 命名檔案
- 最終：透過 `PHPhotoLibrary` 存入自訂「DuoRatio」相簿

---

## 六、中斷處理矩陣

| 事件 | 處理 |
|------|------|
| App 進入背景 | `emergencyStopRecording` → 安全保存 → 回前景 `restartSession` |
| 來電中斷 | `AVAudioSession.interruptionNotification` → 安全停止 |
| Session runtime error | 非錄影中自動重啟 session |
| 儲存空間不足 | 錄影前阻擋/警告 + 錄影中自動停止 |
| 記憶體不足 | `os_proc_available_memory` < 50MB → 自動停止 |
| 溫度過高 | `thermalState == .critical` → 自動停止 |

---

## 七、UI/UX 實作經驗

### 7.1 預覽模式三態滑動切換

使用 `TabView(.page)` 實現三種預覽模式：
1. **雙卡片**：直式 + 橫式並排預覽
2. **直式全寬**：直式預覽佔滿，右下角 PiP 顯示橫式
3. **橫式全寬**：橫式預覽佔滿，右下角 PiP 顯示直式

### 7.2 Onboarding 引導頁

- 3 頁引導，可跳過
- `@AppStorage("hasCompletedOnboarding")` 判斷是否首次
- 使用 `TabView(.page)` + 自訂頁面指示器

### 7.3 錄影完成預覽

- `AVAssetImageGenerator` 抓取影片第一幀作為縮圖
- 顯示雙縮圖 + 檔案資訊（解析度、時長、檔案大小）

---

## 八、莫蘭迪色系品牌設計

### 8.1 色彩計畫

| 角色 | 色名 | Hex | 用途 |
|------|------|-----|------|
| 主色 | 深石青 | `#4A5859` | 標題、導航列 |
| 背景 | 暖米白 | `#F5F0E8` | 主背景 |
| 強調色 | 柔珊瑚 | `#C4877A` | 錄製按鈕、CTA |
| 次要 | 霧灰綠 | `#8FA9A0` | 次要按鈕、標籤 |
| 文字 | 墨灰 | `#3A3A3A` | 內文 |

### 8.2 設計原則

- **70/20/10 法則**：70% 暖米白背景、20% 深石青結構、10% 柔珊瑚強調
- 所有色彩飽和度控制在 30% 以下
- 品牌個性：沉穩、專注、美學導向、溫暖陪伴、職人精神

---

## 九、專案決策紀錄

| 決策 | 結果 | 理由 |
|------|------|------|
| App 名稱 | DuoRatio（原 DualShot） | 更符合「雙比例」的產品定位 |
| 鏡頭分配 | 超廣角→橫式、廣角→直式 | 超廣角視野寬適合橫式，廣角拍人像自然適合直式 |
| 單鏡頭裁切 | 從中央裁切 | 簡單直覺，避免過度設計 |
| 定價 | CA$3.99 一次性付費 | 與同類型 App 定價一致 |
| 隱私權政策 | GitHub Pages 獨立網頁 | 專業且方便更新 |
| 48MP 超廣角 | 支援 | iPhone 16 用戶的關鍵差異化 |

---

## 十、版本路線圖

### v1.1（上架後快速迭代）

- 快速重錄（Quick Retake）
- 連續錄影模式
- 構圖輔助線（三分法、安全區域框）

### v2.0（差異化功能）

- 自訂比例組合（1:1+16:9、4:5+16:9）
- 自訂鏡頭分配（反轉、長焦）
- 拍照模式（Photo Mode）
- 影片浮水印/時間戳
- 即時濾鏡
- 外接麥克風音源選擇

### v3.0（生態擴展）

- Live Activity / Dynamic Island
- Shortcuts / 自動化整合
- iPad 支援
- 外接裝置（藍牙快門、外接螢幕）
- 慢動作錄影
- 影片剪輯（裁剪頭尾）
