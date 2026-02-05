import type { RNG } from "./rng";

export type TaskType = string;

export type TaskMeta = {
  seed: number;
  params: Record<string, unknown>;
};

export type Task = {
  id: string;
  type: TaskType;
  statement: string;
  answer: string;
  steps: string[];
  meta: TaskMeta;
};

export type TaskGenerator = {
  id: TaskType;
  title: string;

  // ВАЖНО: теперь генераторы принимают RNG-объект, а не функцию () => number
  generate: (rng: RNG) => Task;

  // опционально: восстановление ответа по параметрам (если где-то используется)
  solveFromParams?: (params: Record<string, unknown>) => number;
};
