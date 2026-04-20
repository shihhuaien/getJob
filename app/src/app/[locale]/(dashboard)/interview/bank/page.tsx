import { getTranslations } from "next-intl/server";
import { BookOpen } from "lucide-react";

export default async function InterviewBankPage() {
  const t = await getTranslations("interview");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("bankTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("bankSubtitle")}</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16">
        <BookOpen className="h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {t("bankEmpty")}
        </h3>
        <p className="mt-1 max-w-md text-center text-sm text-gray-500">
          {t("bankEmptyDesc")}
        </p>
      </div>
    </div>
  );
}
