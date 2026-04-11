import { create } from "zustand";
import type { Database } from "@/types/database";

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
}));
