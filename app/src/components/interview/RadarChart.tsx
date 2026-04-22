"use client";

import { useTranslations } from "next-intl";
import type { Scorecard } from "@/types/interview";

interface Props {
  latest: Scorecard | null;
  average: Scorecard | null;
  sessionCount: number;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 100;
// 三軸：上 90°、左下 210°、右下 330°
const AXES = [
  { key: "relevance" as const, angleDeg: 90 },
  { key: "logic" as const, angleDeg: 210 },
  { key: "confidence" as const, angleDeg: 330 },
];

function toPoint(angleDeg: number, value: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const r = (RADIUS * value) / 100;
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER - r * Math.sin(rad),
  };
}

function polygonPoints(sc: Scorecard): string {
  return AXES.map((a) => {
    const p = toPoint(a.angleDeg, sc[a.key]);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
}

export default function RadarChart({
  latest,
  average,
  sessionCount,
}: Props) {
  const t = useTranslations("interview");

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-brand-100">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-text">
          {t("radarTitle")}
        </h2>
        <span className="text-xs text-text-light">
          {t("radarBasis", { count: sessionCount })}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="shrink-0"
        >
          {/* 同心參考三角形 */}
          {[25, 50, 75, 100].map((pct) => (
            <polygon
              key={pct}
              points={AXES.map((a) => {
                const p = toPoint(a.angleDeg, pct);
                return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
              }).join(" ")}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={1}
            />
          ))}

          {/* 軸線 */}
          {AXES.map((a) => {
            const p = toPoint(a.angleDeg, 100);
            return (
              <line
                key={a.key}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
            );
          })}

          {/* 平均（虛線灰色多邊形） */}
          {average && (
            <polygon
              points={polygonPoints(average)}
              fill="rgba(122, 127, 136, 0.1)"
              stroke="var(--color-text-placeholder)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          )}

          {/* 最新（實心品牌色多邊形） */}
          {latest && (
            <polygon
              points={polygonPoints(latest)}
              fill="rgba(104, 143, 121, 0.25)"
              stroke="#688F79"
              strokeWidth={2}
            />
          )}

          {/* 軸標籤 */}
          {AXES.map((a) => {
            const p = toPoint(a.angleDeg, 118);
            return (
              <text
                key={`lbl-${a.key}`}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium"
                fill="#374151"
              >
                {t(`scoreShort_${a.key}` as "scoreShort_relevance")}
              </text>
            );
          })}
        </svg>

        <div className="flex flex-col gap-3 text-sm">
          <Legend
            swatchClass="bg-brand-600"
            label={t("radarLegendLatest")}
            score={latest?.overall}
          />
          <Legend
            swatchClass="bg-text-placeholder"
            dashed
            label={t("radarLegendAverage")}
            score={average?.overall}
          />
          {latest && average && (
            <p className="mt-2 max-w-xs text-xs text-text-light">
              {latest.overall >= average.overall
                ? t("radarTrendUp", {
                    delta: latest.overall - average.overall,
                  })
                : t("radarTrendDown", {
                    delta: average.overall - latest.overall,
                  })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Legend({
  swatchClass,
  dashed,
  label,
  score,
}: {
  swatchClass: string;
  dashed?: boolean;
  label: string;
  score: number | undefined;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block h-3 w-6 rounded ${swatchClass} ${
          dashed ? "opacity-50" : ""
        }`}
      />
      <span className="text-text">{label}</span>
      {typeof score === "number" && (
        <span className="text-sm font-semibold text-text">{score}</span>
      )}
    </div>
  );
}
