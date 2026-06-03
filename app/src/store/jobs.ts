import { create } from "zustand";
import type { Database } from "@/types/database";
import type { JobTag } from "@/types/tags";

type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];
type ApplicationStatus = Database["public"]["Enums"]["application_status"];

interface JobsState {
  jobs: JobApplication[];
  filterStatus: ApplicationStatus | "all";
  searchQuery: string;
  setJobs: (jobs: JobApplication[]) => void;
  addJob: (job: JobApplication) => void;
  updateJob: (id: string, updates: Partial<JobApplication>) => void;
  removeJob: (id: string) => void;
  setFilterStatus: (status: ApplicationStatus | "all") => void;
  setSearchQuery: (query: string) => void;

  // 標籤 slice
  tags: JobTag[];
  jobTagMap: Record<string, string[]>; // jobId → tag_ids
  setTags: (tags: JobTag[]) => void;
  addTag: (tag: JobTag) => void;
  updateTag: (id: string, updates: Partial<JobTag>) => void;
  removeTag: (id: string) => void;
  setJobTagMap: (map: Record<string, string[]>) => void;
  setJobTags: (jobId: string, tagIds: string[]) => void;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  filterStatus: "all",
  searchQuery: "",
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      ),
    })),
  removeJob: (id) =>
    set((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) })),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // 標籤 slice
  tags: [],
  jobTagMap: {},
  setTags: (tags) => set({ tags }),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  updateTag: (id, updates) =>
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTag: (id) =>
    set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),
  setJobTagMap: (jobTagMap) => set({ jobTagMap }),
  setJobTags: (jobId, tagIds) =>
    set((state) => ({
      jobTagMap: { ...state.jobTagMap, [jobId]: tagIds },
    })),
}));
