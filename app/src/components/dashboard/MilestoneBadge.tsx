import { getTranslations } from "next-intl/server";
import { Check, Circle } from "lucide-react";

interface Props {
  hasJob: boolean;
  hasResume: boolean;
  hasCoverLetter: boolean;
  hasInterview: boolean;
}

export default async function MilestoneBadge({
  hasJob,
  hasResume,
  hasCoverLetter,
  hasInterview,
}: Props) {
  const t = await getTranslations("dashboard");

  const items: { key: string; done: boolean; label: string }[] = [
    { key: "job", done: hasJob, label: t("milestoneJob") },
    { key: "resume", done: hasResume, label: t("milestoneResume") },
    {
      key: "coverLetter",
      done: hasCoverLetter,
      label: t("milestoneCoverLetter"),
    },
    { key: "interview", done: hasInterview, label: t("milestoneInterview") },
  ];

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const percent = (done / total) * 100;
  const allDone = done === total;

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow-neu">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-text">
          {t("milestoneTitle")}
        </h2>
        <span className="text-sm font-medium text-brand-700">
          {t("milestoneProgress", { done, total })}
        </span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-50 shadow-neu-inset">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-2 text-sm ${
              item.done ? "text-text" : "text-text-light"
            }`}
          >
            {item.done ? (
              <Check
                className="h-4 w-4 flex-shrink-0 text-brand-600"
                aria-hidden="true"
              />
            ) : (
              <Circle
                className="h-4 w-4 flex-shrink-0 text-brand-200"
                aria-hidden="true"
              />
            )}
            <span className={item.done ? "line-through decoration-brand-300" : ""}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {allDone && (
        <p className="mt-4 text-sm text-text-light">{t("milestoneAllDone")}</p>
      )}
    </section>
  );
}
