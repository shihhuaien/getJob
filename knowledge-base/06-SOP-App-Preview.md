# App Preview 影片製作 SOP

> **適用範圍**：所有 iOS App 專案（技術棧無關）
> **最後更新**：2026-04-09

---

## 一、Apple App Preview 規範

| 項目 | 規範 |
|------|------|
| 影片長度 | 15 ~ 30 秒 |
| 影片尺寸 | **886 x 1920 px**（精準無誤差，不可有黑邊） |
| 視訊編碼 | H.264 (x264)，**不可使用 H.265/HEVC** |
| 色彩空間 | 標準 SDR（BT.709），**不可為 HDR** |
| 影格率 | **固定 30 FPS（Constant Framerate）**，不接受浮動影格率 |
| 音訊 | AAC, 44100 Hz, Stereo, 128 kbps（靜音亦可，但**必須包含音軌**） |
| 容器格式 | MP4 |
| 裁切 | 全為 0 |

---

## 二、前置準備

### 2.1 安裝 FFmpeg

```bash
brew install ffmpeg
```

### 2.2 錄製螢幕影片

- 使用 iPhone 內建的螢幕錄製功能，或 Xcode 的螢幕擷取工具
- 確保錄製內容長度在 15 ~ 30 秒之間
- 建議在錄製前關閉通知、隱藏個人資訊

---

## 三、轉檔指令（FFmpeg）

### 3.1 標準指令（886 x 1920，含靜音音軌）

```bash
ffmpeg -y \
  -i "原始影片.MOV" \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -c:v libx264 \
  -profile:v high \
  -level:v 4.1 \
  -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -r 30 \
  -vsync cfr \
  -vf "scale=886:1920:flags=lanczos" \
  -crf 18 \
  -c:a aac \
  -b:a 128k \
  -ac 2 \
  -ar 44100 \
  -shortest \
  -map 0:v:0 -map 1:a:0 \
  -movflags +faststart \
  "AppPreview_886x1920.mp4"
```

### 3.2 參數說明

| 參數 | 用途 |
|------|------|
| `-y` | 覆蓋已存在的輸出檔案 |
| `-f lavfi -i anullsrc=...` | 產生靜音音訊來源（解決「毀損音訊」錯誤） |
| `-c:v libx264` | 使用 H.264 編碼器 |
| `-profile:v high -level:v 4.1` | H.264 High Profile, Level 4.1 |
| `-pix_fmt yuv420p` | 標準像素格式，確保相容性 |
| `-color_primaries bt709 ...` | 強制 SDR 色彩空間 |
| `-r 30 -vsync cfr` | 固定 30 FPS |
| `-vf "scale=886:1920:flags=lanczos"` | 縮放至 886x1920，使用高品質 Lanczos 演算法 |
| `-crf 18` | 畫質設定（數值越小畫質越高，18 為高品質） |
| `-c:a aac -b:a 128k -ac 2 -ar 44100` | AAC 音訊，128kbps，立體聲，44100Hz |
| `-shortest` | 以較短的串流（影片）為結束點 |
| `-map 0:v:0 -map 1:a:0` | 取原始檔的視訊 + 產生的靜音音軌 |
| `-movflags +faststart` | 將 metadata 移至檔案開頭，加速線上播放 |

---

## 四、驗證輸出檔案

轉檔完成後，使用以下指令確認所有規格正確：

```bash
ffprobe -v quiet -print_format json -show_streams -show_format "AppPreview_886x1920.mp4" 2>&1 | \
python3 -c "
import json, sys
data = json.load(sys.stdin)
v = [s for s in data['streams'] if s['codec_type']=='video'][0]
a = [s for s in data['streams'] if s['codec_type']=='audio']
fmt = data['format']
duration = float(fmt['duration'])

print('=== App Preview 驗證結果 ===')
print(f'解析度: {v[\"width\"]}x{v[\"height\"]}', '✅' if v['width']==886 and v['height']==1920 else '❌')
print(f'編碼: {v[\"codec_name\"]}', '✅' if v['codec_name']=='h264' else '❌')
print(f'影格率: {v[\"r_frame_rate\"]}', '✅' if v['r_frame_rate']=='30/1' else '❌')
print(f'長度: {duration:.2f} 秒', '✅' if 15<=duration<=30 else '❌')
print(f'音軌: {len(a)} 軌', '✅' if len(a)==1 else '❌')
if a:
    print(f'音訊編碼: {a[0][\"codec_name\"]}', '✅' if a[0]['codec_name']=='aac' else '❌')
print(f'檔案大小: {int(fmt[\"size\"])/1024/1024:.1f} MB')
"
```

### 預期輸出

```
=== App Preview 驗證結果 ===
解析度: 886x1920 ✅
編碼: h264 ✅
影格率: 30/1 ✅
長度: 15.67 秒 ✅
音軌: 1 軌 ✅
音訊編碼: aac ✅
檔案大小: 6.9 MB
```

---

## 五、踩坑紀錄

| 問題 | 原因 | 解決方案 |
|------|------|---------|
| 「不支援的音檔或毀損的音訊」 | 完全移除音軌（`-an`），App Store Connect 無法處理 | 改為加入 AAC 靜音音軌（`anullsrc`） |
| 尺寸不符被退回 | 使用了裝置原生解析度而非 Apple 指定的預覽尺寸 | 以 App Store Connect 顯示的要求尺寸 886x1920 為準 |
| 影片被判定為 HDR | 原始 iPhone 錄影可能帶有 HDR metadata | 強制指定 `-color_primaries bt709 -color_trc bt709 -colorspace bt709` |
| 浮動影格率被拒 | iPhone 螢幕錄影預設為 VFR | 使用 `-r 30 -vsync cfr` 強制固定影格率 |

---

## 六、完整流程檢查清單

- [ ] 螢幕錄影長度在 15-30 秒之間
- [ ] 已安裝 FFmpeg（`brew install ffmpeg`）
- [ ] 執行轉檔指令（第三章）
- [ ] 執行驗證指令確認所有項目為 ✅（第四章）
- [ ] 在 App Store Connect 上傳成功
- [ ] 預覽影片在 App Store Connect 中可正常播放
