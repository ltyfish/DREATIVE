import { newId } from "./store.js";

export interface Job {
  id: string;
  label: string;
  detail: string;
  status: "running" | "done" | "error";
  startedAt: number;
  finishedAt?: number;
  error?: string;
  result?: unknown;
}

const jobs = new Map<string, Job>();

export function startJob(label: string, work: (update: (detail: string) => void) => Promise<unknown>): Job {
  const job: Job = {
    id: newId("job"),
    label,
    detail: "Starting…",
    status: "running",
    startedAt: Date.now(),
  };
  jobs.set(job.id, job);
  void work((detail) => {
    job.detail = detail;
  })
    .then((result) => {
      job.status = "done";
      job.result = result;
      job.finishedAt = Date.now();
    })
    .catch((err) => {
      job.status = "error";
      job.error = String(err);
      job.finishedAt = Date.now();
    });
  // drop finished jobs after 10 minutes
  setTimeout(() => jobs.delete(job.id), 10 * 60 * 1000).unref?.();
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}
