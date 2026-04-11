import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-indigo-600 px-6 py-16 text-center sm:px-12 lg:px-20">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            準備好開始你的求職之旅了嗎？
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            加入超過 10,000 位使用 JobHunter 成功找到理想工作的求職者。
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
          >
            免費開始使用
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
