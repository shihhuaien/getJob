// 在 server (StructuredData → FAQPage JSON-LD) 與 client (FAQ.tsx) 之間共享的 key 列表。
// 必須保持為純常數模組，不可標 "use client"，否則 server 端會拿到 client reference 而非陣列。
export const FAQ_KEYS = [
  { qKey: "faq1Q", aKey: "faq1A" },
  { qKey: "faq2Q", aKey: "faq2A" },
  { qKey: "faq3Q", aKey: "faq3A" },
  { qKey: "faq4Q", aKey: "faq4A" },
  { qKey: "faq5Q", aKey: "faq5A" },
  { qKey: "faq6Q", aKey: "faq6A" },
] as const;
