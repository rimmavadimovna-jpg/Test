export type TaskType =
  | "ratio-percent"
  | "part-of-whole"
  | "percent-change"
  | "times-change"
  | "single-discount"
  | "double-discount"
  | "withholding"
  | "fraction-of-old";

export type Task = {
  id: string;
  type: TaskType;
  statement: string;
  answer: string;
  steps: string[];
  meta: {
    seed: number;
    params: Record<string, number | string | boolean>;
  };
};

export type TaskGenerator = {
  id: TaskType;
  title: string;
  generate: (rng: () => number) => Task;
  solveFromParams?: (params: Record<string, number | string | boolean>) => number;
};
