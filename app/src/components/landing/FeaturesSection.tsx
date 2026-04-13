import {
  FileText,
  Kanban,
  Mail,
  Search,
  BarChart3,
  Users,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI 履歷建立器",
    description:
      "智慧分析職缺描述，自動產生關鍵字最佳化的履歷，提升 ATS 通過率。支援多版本履歷管理。",
  },
  {
    icon: Kanban,
    title: "職缺追蹤看板",
    description:
      "看板式介面管理所有求職進度。從儲存、已投遞、面試到錄取，一目瞭然掌握每個職缺狀態。",
  },
  {
    icon: Mail,
    title: "AI 求職信產生器",
    description:
      "根據職缺描述和你的履歷，自動生成客製化的求職信。針對每個職缺量身打造，不再千篇一律。",
  },
  {
    icon: Search,
    title: "職缺關鍵字比對",
    description:
      "將履歷與職缺描述進行智慧比對，找出遺漏的關鍵字，提供具體優化建議，提升面試邀約率。",
  },
  {
    icon: BarChart3,
    title: "求職數據分析",
    description:
      "視覺化你的求職數據。投遞轉換率、面試成功率、薪資範圍分析，用數據驅動求職策略。",
  },
  {
    icon: Users,
    title: "人脈管理 CRM",
    description:
      "集中管理求職相關聯絡人。記錄互動歷史、設定追蹤提醒，讓人脈經營系統化。",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            所有求職工具，一個平台搞定
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            不再在多個工具之間切換，Offery
            整合了你需要的所有求職功能。
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
