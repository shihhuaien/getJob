"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Plus, Building2, ExternalLink, Search, X, Sparkles, Briefcase, Star } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { jobInsertSchema, isValidHttpUrl } from "@/lib/validations";
import { formatRelativeTime } from "@/lib/relative-time";
import ParseJobModal from "./ParseJobModal";
import type { Database } from "@/types/database";

type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];
type ApplicationStatus = Database["public"]["Enums"]["application_status"];

const statusColumns: { key: ApplicationStatus; labelKey: string; color: string }[] = [
  { key: "saved", labelKey: "saved", color: "bg-brand-50 text-text" },
  { key: "applied", labelKey: "applied", color: "bg-blue-100 text-blue-700" },
  { key: "interview", labelKey: "interview", color: "bg-yellow-100 text-yellow-700" },
  { key: "offer", labelKey: "offer", color: "bg-green-100 text-green-700" },
  { key: "rejected", labelKey: "rejected", color: "bg-red-100 text-red-700" },
  { key: "closed", labelKey: "closed", color: "bg-gray-100 text-gray-600" },
];

// 可排序的職缺卡片
function SortableJobCard({
  job,
  onToggleStar,
}: {
  job: JobApplication;
  onToggleStar: (id: string, starred: boolean) => void;
}) {
  const tRel = useTranslations("relativeTime");
  const tBoard = useTranslations("jobsBoard");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id, data: { job } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const relative = formatRelativeTime(job.updated_at, tRel);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg bg-white p-3 shadow-sm ring-1 ring-brand-100 cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? "opacity-50 shadow-lg ring-brand-300" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <Link
          href={`/jobs/${job.id}`}
          className="min-w-0 hover:opacity-75 transition-opacity"
          onClick={(e) => {
            if (isDragging) e.preventDefault();
          }}
        >
          <p className="truncate text-sm font-medium text-text">
            {job.job_title}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-text-light">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{job.company_name}</span>
          </div>
          <p
            className="mt-1.5 text-[11px] text-text-placeholder"
            title={new Date(job.updated_at).toLocaleString()}
          >
            {tBoard("lastUpdated", { time: relative })}
          </p>
        </Link>
        <div className="ml-2 flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleStar(job.id, !job.starred);
            }}
            className="text-text-placeholder hover:text-[#D97D54] transition-colors"
            aria-label={job.starred ? tBoard("unstarJob") : tBoard("starJob")}
            title={job.starred ? tBoard("unstarJob") : tBoard("starJob")}
          >
            <Star
              className="h-3.5 w-3.5"
              fill={job.starred ? "#D97D54" : "none"}
              stroke={job.starred ? "#D97D54" : "currentColor"}
            />
          </button>
          {job.job_url && isValidHttpUrl(job.job_url) && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-placeholder hover:text-text-light"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// 拖曳中顯示的覆蓋卡片
function DragOverlayCard({ job }: { job: JobApplication }) {
  return (
    <div className="w-56 rounded-lg bg-white p-3 shadow-xl ring-1 ring-brand-300 rotate-[2deg] scale-105">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text">
          {job.job_title}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-text-light">
          <Building2 className="h-3 w-3" />
          {job.company_name}
        </div>
      </div>
    </div>
  );
}

// 可放置的欄位
function DroppableColumn({
  col,
  jobs,
  isOver,
  label,
  noJobsText,
  onToggleStar,
}: {
  col: (typeof statusColumns)[number];
  jobs: JobApplication[];
  isOver: boolean;
  label: string;
  noJobsText: string;
  onToggleStar: (id: string, starred: boolean) => void;
}) {
  const { setNodeRef } = useDroppable({ id: col.key });

  return (
    <div
      ref={setNodeRef}
      className={`h-full rounded-xl p-3 transition-colors duration-200 ${
        isOver ? "bg-brand-50 ring-2 ring-brand-300" : "bg-brand-50/50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${col.color}`}
        >
          {label}
        </span>
        <span className="text-xs text-text-light">{jobs.length}</span>
      </div>
      <SortableContext
        items={jobs.map((j) => j.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[40px]">
          {jobs.map((job) => (
            <SortableJobCard key={job.id} job={job} onToggleStar={onToggleStar} />
          ))}
          {jobs.length === 0 && !isOver && (
            <p className="py-4 text-center text-xs text-text-placeholder">{noJobsText}</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

interface Props {
  initialJobs: JobApplication[];
  userId: string;
  isPro?: boolean;
  aiOutputLanguage?: string | null;
}

export default function JobsBoard({ initialJobs, userId, isPro = false, aiOutputLanguage = null }: Props) {
  const t = useTranslations("jobs");
  const tc = useTranslations("common");
  const tBoard = useTranslations("jobsBoard");
  const [jobs, setJobs] = useState(initialJobs);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    status: "saved" as ApplicationStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [showParseModal, setShowParseModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.position - b.position);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = jobInsertSchema.safeParse(newJob);
    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("job_applications")
        .insert({
          user_id: userId,
          company_name: validation.data.company_name,
          job_title: validation.data.job_title,
          job_url: newJob.job_url || null,
          status: newJob.status,
          position: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // 將同欄其他卡片 position +1
      setJobs((prev) =>
        [data, ...prev.map((j) =>
          j.status === newJob.status ? { ...j, position: j.position + 1 } : j
        )]
      );
      setNewJob({ company_name: "", job_title: "", job_url: "", status: "saved" });
      setShowAddForm(false);
      toast.success(tc("created"));
    } catch (err) {
      const code = (err as { code?: string } | null)?.code;
      const msg = code === "23505" ? tc("duplicateJob") : tc("saveFailed");
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStar = async (id: string, starred: boolean) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, starred } : j))
    );
    const supabase = createClient();
    await supabase
      .from("job_applications")
      .update({ starred })
      .eq("id", id);
  };

  // 批次更新 position 到 DB
  const persistPositions = async (
    updates: { id: string; status: ApplicationStatus; position: number }[]
  ) => {
    const supabase = createClient();
    await Promise.all(
      updates.map(({ id, status, position }) =>
        supabase
          .from("job_applications")
          .update({ status, position, updated_at: new Date().toISOString() })
          .eq("id", id)
      )
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const job = event.active.data.current?.job as JobApplication | undefined;
    if (job) setActiveJob(job);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverColumnId(event.over?.id?.toString() ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null);
    setOverColumnId(null);

    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const overId = over.id as string;
    const draggedJob = jobs.find((j) => j.id === jobId);
    if (!draggedJob) return;

    // 判斷目標是欄位還是卡片
    const isColumn = statusColumns.some((c) => c.key === overId);
    let targetStatus: ApplicationStatus;
    let targetCardId: string | null = null;

    if (isColumn) {
      targetStatus = overId as ApplicationStatus;
    } else {
      const targetJob = jobs.find((j) => j.id === overId);
      if (!targetJob) return;
      targetStatus = targetJob.status;
      targetCardId = overId;
    }

    const isSameColumn = draggedJob.status === targetStatus;

    if (isSameColumn && !targetCardId) return; // 拖到同欄空白處，不動
    if (isSameColumn && targetCardId === jobId) return; // 拖到自己，不動

    // 取得目標欄的卡片（排除被拖曳的卡片）
    const targetColumnJobs = jobs
      .filter((j) => j.status === targetStatus && j.id !== jobId)
      .sort((a, b) => a.position - b.position);

    // 計算插入位置
    let insertIndex: number;
    if (!targetCardId || isColumn) {
      // 拖到欄位 → 放在最後
      insertIndex = targetColumnJobs.length;
    } else {
      // 拖到某張卡片上
      const targetIndex = targetColumnJobs.findIndex((j) => j.id === targetCardId);
      if (targetIndex === -1) {
        insertIndex = targetColumnJobs.length;
      } else if (isSameColumn && draggedJob.position < targetColumnJobs[targetIndex].position) {
        // 同欄向下拖 → 插入目標卡片之後
        insertIndex = targetIndex + 1;
      } else {
        // 同欄向上拖 / 跨欄 → 插入目標卡片之前
        insertIndex = targetIndex;
      }
    }

    // 插入被拖曳的卡片
    const newColumnOrder = [...targetColumnJobs];
    newColumnOrder.splice(insertIndex, 0, draggedJob);

    // 樂觀更新 UI
    const updates: { id: string; status: ApplicationStatus; position: number }[] = [];
    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        const newPos = insertIndex;
        updates.push({ id: j.id, status: targetStatus, position: newPos });
        return { ...j, status: targetStatus, position: newPos };
      }
      // 重新計算目標欄中其他卡片的 position
      const idx = newColumnOrder.findIndex((c) => c.id === j.id);
      if (idx !== -1 && j.status === targetStatus) {
        if (j.position !== idx) {
          updates.push({ id: j.id, status: targetStatus, position: idx });
        }
        return { ...j, position: idx };
      }
      // 若是從其他欄移出，重新計算來源欄的 position
      if (!isSameColumn && j.status === draggedJob.status) {
        const sourceColumnJobs = jobs
          .filter((s) => s.status === draggedJob.status && s.id !== jobId)
          .sort((a, b) => a.position - b.position);
        const srcIdx = sourceColumnJobs.findIndex((c) => c.id === j.id);
        if (srcIdx !== -1 && j.position !== srcIdx) {
          updates.push({ id: j.id, status: j.status, position: srcIdx });
          return { ...j, position: srcIdx };
        }
      }
      return j;
    });

    setJobs(updatedJobs);
    persistPositions(updates);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0" } },
    }),
  };

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("addJob")}
        </button>
        {isPro && (
          <button
            onClick={() => setShowParseModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            {t("aiParse")}
          </button>
        )}
      </div>

      {/* 搜尋與篩選 */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-placeholder" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-brand-200 py-2 pl-9 pr-9 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder={t("searchPlaceholder")}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text-light"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ApplicationStatus | "all")
          }
          className="rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">{t("allStatuses")}</option>
          {statusColumns.map((s) => (
            <option key={s.key} value={s.key}>
              {t(s.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddJob}
          className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-text">
                {t("companyName")}
              </label>
              <input
                type="text"
                required
                value={newJob.company_name}
                onChange={(e) =>
                  setNewJob({ ...newJob, company_name: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("companyPlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("jobTitle")}
              </label>
              <input
                type="text"
                required
                value={newJob.job_title}
                onChange={(e) =>
                  setNewJob({ ...newJob, job_title: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("jobTitlePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("jobUrl")}
              </label>
              <input
                type="url"
                value={newJob.job_url}
                onChange={(e) =>
                  setNewJob({ ...newJob, job_url: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="https://..."
              />
            </div>
          </div>
          {formError && (
            <p className="mt-3 text-sm text-red-600">{formError}</p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? tc("saving") : tc("save")}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
            >
              {tc("cancel")}
            </button>
          </div>
        </form>
      )}

      {jobs.length === 0 && !showAddForm ? (
        <EmptyState
          icon={Briefcase}
          title={t("emptyTitle")}
          description={t("emptyDesc")}
          action={
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {t("addJob")}
            </button>
          }
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <p
            className="mb-2 text-xs text-text-placeholder xl:hidden"
            aria-hidden="true"
          >
            {tBoard("scrollHint")}
          </p>
          {/* <xl：水平滑動；>=xl：6 欄 grid；拖曳時暫時停用 snap 以確保 auto-scroll 能抵達任意欄位 */}
          <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] xl:mx-0 xl:overflow-visible xl:px-0">
            <div className={`flex gap-4 xl:grid xl:grid-cols-6 xl:snap-none ${activeJob ? "" : "snap-x snap-mandatory"}`}>
              {statusColumns.map((col, index) => {
                const columnJobs = filteredJobs.filter(
                  (job) => job.status === col.key
                );
                return (
                  <div
                    key={col.key}
                    style={{ "--i": index } as React.CSSProperties}
                    className={`stagger-item w-[78vw] max-w-[320px] flex-shrink-0 sm:w-[60vw] md:w-[340px] xl:w-auto xl:max-w-none ${activeJob ? "" : "snap-start"}`}
                  >
                    <DroppableColumn
                      col={col}
                      jobs={columnJobs}
                      isOver={overColumnId === col.key}
                      label={t(col.labelKey)}
                      noJobsText={t("noJobs")}
                      onToggleStar={handleToggleStar}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <DragOverlay dropAnimation={dropAnimation}>
            {activeJob ? <DragOverlayCard job={activeJob} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {showParseModal && (
        <ParseJobModal
          onClose={() => setShowParseModal(false)}
          initialAiLanguage={aiOutputLanguage}
          onSave={async (parsed) => {
            const supabase = createClient();
            const { data, error } = await supabase
              .from("job_applications")
              .insert({
                user_id: userId,
                company_name: parsed.company_name,
                job_title: parsed.job_title,
                job_url: parsed.job_url || null,
                job_description: parsed.job_description || null,
                salary_min: parsed.salary_min,
                salary_max: parsed.salary_max,
                status: parsed.status,
                position: 0,
              })
              .select()
              .single();

            if (!error && data) {
              setJobs((prev) => [
                data,
                ...prev.map((j) =>
                  j.status === parsed.status
                    ? { ...j, position: j.position + 1 }
                    : j
                ),
              ]);
              toast.success(tc("created"));
            } else if (error) {
              toast.error(
                error.code === "23505"
                  ? tc("duplicateJob")
                  : tc("saveFailed")
              );
            }
            setShowParseModal(false);
          }}
        />
      )}
    </div>
  );
}
