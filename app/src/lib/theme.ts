/**
 * Offery 品牌設計系統 — Theme 常數
 * 設計風格：Calm & Trustworthy（沈穩信賴與微擬物風）
 *
 * 所有品牌色彩、間距、圓角、陰影均在此檔案常數化。
 * 元件一律引用此常數，禁止硬編碼色票值。
 */

// ─── 品牌色彩 ───

export const colors = {
  // 主色盤
  primary: {
    DEFAULT: "#688F79", // 靜謐鼠尾草綠
    light: "#7A9D89",
    dark: "#567862",
    50: "#F0F4F1",
    100: "#DCE8E1",
    200: "#B8CFC1",
    500: "#7A9D89",
    600: "#688F79",
    700: "#567862",
  },
  background: {
    DEFAULT: "#FCFBF9", // 暖燕麥白
    card: "#FFFFFF", // 雲瓷白
  },
  accent: "#D97D54", // 柔赤陶
  secondary: "#8E9AAF", // 霧灰藍
  text: {
    DEFAULT: "#3A3A3A", // 柔墨黑
    light: "#6B7280", // 霧灰
    placeholder: "#7A7F88", // WCAG AA（於 #FCFBF9 ≈ 5.0:1）
  },

  // 功能色
  success: "#6BAE8A", // 薄荷綠
  warning: "#E5A84B", // 暖琥珀
  error: "#D96B6B", // 柔紅
  info: "#5B9BD5", // 天青藍

  // Kanban 狀態色
  status: {
    saved: { bg: "#F3F0ED", text: "#6B7280" },
    applied: { bg: "#F0F4F1", text: "#688F79" },
    interview: { bg: "#FDF3E3", text: "#C48B2C" },
    offer: { bg: "#E8F5EE", text: "#4A8A6A" },
    rejected: { bg: "#FCEAEA", text: "#B85C5C" },
  },
} as const;

// ─── 間距 ───

export const spacing = {
  sectionGap: "32px", // 區塊間距 (py-8)
  cardGap: "16px", // 卡片間距 (gap-4)
  cardPadding: "24px", // 卡片內邊距 (p-6)
  formGap: "16px", // 表單欄位間距 (space-y-4)
} as const;

// ─── 圓角 ───

export const borderRadius = {
  card: "16px", // rounded-2xl
  button: "12px", // rounded-xl
  input: "12px", // rounded-xl
  badge: "9999px", // rounded-full
  sm: "8px", // rounded-lg
} as const;

// ─── 微擬物陰影 ───

export const shadows = {
  neu: "6px 6px 16px rgba(174, 174, 192, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.7)",
  neuHover:
    "8px 8px 20px rgba(174, 174, 192, 0.25), -6px -6px 16px rgba(255, 255, 255, 0.8)",
  neuInset:
    "inset 2px 2px 5px rgba(174, 174, 192, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.5)",
  neuPressed:
    "inset 3px 3px 8px rgba(174, 174, 192, 0.25), inset -3px -3px 8px rgba(255, 255, 255, 0.6)",
} as const;

// ─── 動畫 ───

export const transitions = {
  hover: "150ms ease-out",
  page: "200ms ease-in-out",
  expand: "250ms ease-out",
  notification: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)", // spring-like
} as const;
