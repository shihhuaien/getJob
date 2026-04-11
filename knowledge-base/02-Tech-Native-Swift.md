# 技術棧附錄：原生 Swift / SwiftUI

> 搭配 `00-iOS-App-Framework-Universal.md` 使用。
> 經驗來源：DuoRatio 專案（Swift 6 + SwiftUI + AVFoundation）。

---

## 一、CLAUDE.md 技術棧專屬段落

### 1.1 AI 角色定義範例

```markdown
你是一位資深的 iOS 原生開發工程師，精通 Swift、AVFoundation、SwiftUI 與 Apple 相機框架。
```

### 1.2 Swift 專案技術棧原則

```markdown
### 專案技術棧原則
- 專案使用 Swift（Strict Concurrency），所有新程式碼須遵循 Swift 6 concurrency 規範。
- 使用 SwiftUI 建構 UI，搭配 UIKit 處理需要底層控制的元件（如相機預覽）。
- 善用 Swift 的型別系統，避免使用 `Any`、force unwrap（`!`）或隱式解包。
- 禁止 `print()` 出現在正式程式碼中，使用 `os.Logger` 或自訂 Logger 替代。
- 所有非同步操作必須妥善處理錯誤，使用 Swift 的 `async/await` + `do-catch`。
- 使用 `@MainActor` 標註所有 UI 更新邏輯。
```

### 1.3 安全性規範（原生 Swift 專屬）

```markdown
- 金鑰與憑證透過 Xcode Configuration 或環境變數管理，絕不寫入程式碼。
- 使用 Keychain 儲存敏感資料（若需要）。
- 影片/照片等使用者資料僅存於裝置本地（相簿），不上傳伺服器（若為離線 App）。
```

---

## 二、測試框架

### 2.1 XCTest + Swift Testing 雙軌

- **XCTest**：成熟穩定，適合 UI 測試與整合測試
- **Swift Testing**（Xcode 16+）：新一代框架，`@Test`、`#expect` 語法更簡潔，適合單元測試

### 2.2 測試金字塔

| 層級 | 比例 | 內容 |
|------|------|------|
| 單元測試 | 60% | Model、Utility、ViewModel（搭配 Mock） |
| 整合測試 | 20% | ViewModel + 真實 Service、UserDefaults 持久化 |
| UI 測試 | 10% | XCUITest 基礎流程 |
| 真機手動 | 10% | 硬體相關功能（相機、感測器） |

### 2.3 Mock 策略

使用 Protocol-based Dependency Injection：

```swift
protocol CameraServiceProtocol {
    func startSession() async throws
    func stopSession()
}

// 真實實作
final class CameraService: CameraServiceProtocol { ... }

// 測試用 Mock
final class MockCameraService: CameraServiceProtocol { ... }
```

### 2.4 模擬器 vs 真機

- **模擬器可測**：UI 佈局、ViewModel 邏輯、UserDefaults、網路請求
- **必須真機**：相機、麥克風、多鏡頭、GPS、藍牙、NFC、效能/熱管理

---

## 三、Archive 上傳流程

```
Xcode → Product → Archive → Distribute App → App Store Connect
```

- **版本號管理**：Xcode Build Settings → `MARKETING_VERSION`（版本）+ `CURRENT_PROJECT_VERSION`（Build Number）
- 每次送審必須遞增其中之一

---

## 四、新專案啟動 Checklist（原生 Swift 專屬）

- [ ] 建立 Xcode 專案（或使用 XcodeGen + `project.yml`）
- [ ] 設定 Build Settings：
  - `TARGETED_DEVICE_FAMILY = 1`（iPhone only，⚠️ 預設值含 iPad）
  - `IPHONEOS_DEPLOYMENT_TARGET = 17.0`（或所需最低版本）
  - `SWIFT_VERSION = 6.0`
- [ ] 建立 MVVM 架構骨架（Views / ViewModels / Models / Services / Utilities / Extensions）
- [ ] 建立 `Theme.swift`（設計系統程式化：色彩、字型、間距、動畫、按鈕樣式）
- [ ] 設定 Info.plist：
  - `ITSAppUsesNonExemptEncryption = false`
  - 權限字串（NSCameraUsageDescription 等）
- [ ] 建立 `Logger.swift`（統一日誌系統，使用 `os.Logger`）
- [ ] 設定 `.gitignore`（排除 xcuserdata、DerivedData 等）

---

## 五、推薦目錄結構（MVVM）

```
AppName/
├── App/
│   ├── AppNameApp.swift          # App 入口（@main）
│   └── AppDelegate.swift         # App 生命週期（若需要）
├── Views/
│   ├── MainView.swift            # 主畫面
│   ├── SettingsView.swift        # 設定畫面
│   └── Components/               # 可複用 UI 元件
├── ViewModels/
│   ├── MainViewModel.swift
│   └── SettingsViewModel.swift
├── Models/
│   ├── Configuration.swift       # 設定模型
│   └── AppState.swift            # 狀態模型
├── Services/
│   ├── CoreService.swift         # 核心業務邏輯
│   ├── PermissionService.swift   # 權限管理
│   └── StorageService.swift      # 儲存服務
├── Utilities/
│   ├── Logger.swift              # 統一日誌
│   └── Theme.swift               # 設計系統
├── Extensions/
│   └── Foundation+Extensions.swift
├── Resources/
│   ├── Assets.xcassets
│   ├── Localizable.xcstrings     # 多語系字串
│   └── InfoPlist.xcstrings       # 權限字串本地化
└── Info.plist
```

---

## 六、SwiftUI + UIKit Bridge 技巧

### 6.1 UIViewRepresentable 最佳實踐

**何時需要 Bridge**：相機預覽、地圖、複雜手勢等需要底層控制的場景。

```swift
struct CameraPreview: UIViewRepresentable {
    let session: AVCaptureSession

    func makeUIView(context: Context) -> UIView {
        let view = UIView()
        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        // 調整 previewLayer frame
    }
}
```

### 6.2 AVCaptureVideoPreviewLayer 同步問題

**問題**：Session 切換時（如單鏡頭 ↔ 雙鏡頭），不能依賴 SwiftUI 反應式更新切換 session。SwiftUI 的更新時序無法保證在 session 操作完成前執行。

**解法**：ViewModel 持有 `weak var previewView` 直接引用 UIView，在 session 切換前同步執行 `previewLayer.session = nil`。

---

## 七、多語系架構（原生 Swift）

### 7.1 String Catalogs（Xcode 15+）

- 使用 `.xcstrings` 檔案取代傳統的 `.strings` + `.stringsdict`
- Xcode 自動偵測程式碼中的字串並加入 Catalog

### 7.2 使用方式

```swift
// 程式碼中使用
Text(String(localized: "recording_started"))

// InfoPlist.xcstrings 用於系統權限字串本地化
// Localizable.xcstrings 用於 App 內 UI 字串
```

### 7.3 注意事項

- Xcode 有時會自動修改 `.xcstrings`（加入 `extractionState: "stale"` 或回退翻譯值），commit 前須檢查 diff
- 新增語言時在 Xcode → Project → Info → Localizations 中新增

---

## 八、Swift Concurrency 實戰

### 8.1 sessionQueue vs @MainActor

| 場景 | 使用 |
|------|------|
| 硬體操作（相機、音訊） | 專用 `DispatchQueue`（如 `sessionQueue`） |
| UI 更新（State、UI 元件） | `@MainActor` |
| 一般非同步邏輯 | `async/await` |

### 8.2 Sendable 適配

- `@Sendable` closure 不可捕獲 mutable state
- 常見解法：將需要跨 isolation boundary 傳遞的資料標記為 `Sendable`
- `@preconcurrency import` 用於尚未適配 Sendable 的第三方框架

---

## 九、踩坑紀錄（原生 Swift 專屬）

| # | 踩坑 | 說明 |
|---|------|------|
| 1 | **UIDeviceFamily 預設值** | Xcode 預設 `TARGETED_DEVICE_FAMILY = "1,2"`（含 iPad）。iPhone only 必須改為 `"1"`，否則 App Store 要求 iPad 截圖 |
| 2 | **PreviewLayer session 切換** | 不可依賴 SwiftUI 反應式更新切換 session，必須同步操作，否則觸發 assertion crash |
| 3 | **相機模式切換序列化** | `startRunning` 與 `beginConfiguration` 交錯導致 NSGenericException。解法：session 操作全部在 `sessionQueue` 序列化 + 前端 `isSwitchingCamera` 狀態鎖 |
| 4 | **AVAssetWriter markAsFinished** | 呼叫前必須檢查 Writer 狀態為 `.writing`。Writer 尚未就緒或已失敗時呼叫會觸發 NSException crash |
| 5 | **Swift 6 Strict Concurrency** | 常見的 Sendable 違規場景：Delegate callback、completion handler、跨 actor 資料傳遞。逐步適配，善用 `@preconcurrency import` |
| 6 | **.xcstrings 自動修改** | Xcode 有時會自動回退翻譯值（如 DuoRatio → DualShot）或加入 `extractionState: "stale"`，commit 前須檢查 |
| 7 | **記憶體管理** | 錄影期間 buffer 累積可能導致 OOM crash。須監控 `os_proc_available_memory`，低於閾值時停止錄影 |
| 8 | **溫度管理** | 長時間雙鏡頭錄影會觸發 `ProcessInfo.thermalState` 升高。`.critical` 時必須自動停止錄影並保存 |
