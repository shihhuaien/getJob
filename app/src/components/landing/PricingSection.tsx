import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "免費方案",
    price: "NT$0",
    period: "永久免費",
    description: "適合剛開始求職的你",
    features: [
      "無限職缺追蹤",
      "基本履歷建立器",
      "最多 3 份履歷",
      "求職信範本",
      "基本數據分析",
      "人脈管理 CRM",
    ],
    cta: "免費開始",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro 方案",
    price: "NT$299",
    period: "/月",
    description: "適合積極求職中的你",
    features: [
      "免費方案所有功能",
      "無限 AI 履歷優化",
      "無限份履歷管理",
      "AI 求職信產生器",
      "進階關鍵字比對分析",
      "進階數據分析報表",
      "AI 面試模擬練習",
      "優先客服支援",
    ],
    cta: "升級 Pro",
    href: "/register",
    highlighted: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            簡單透明的價格
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            免費方案功能就已經很強大，升級 Pro 解鎖 AI 完整功能。
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-600 shadow-xl"
                  : "bg-white text-gray-900 ring-1 ring-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${plan.highlighted ? "text-indigo-100" : "text-indigo-600"}`}
              >
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span
                  className={`text-sm ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`mt-2 text-sm ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}
              >
                {plan.description}
              </p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${plan.highlighted ? "text-indigo-200" : "text-indigo-600"}`}
                    />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
