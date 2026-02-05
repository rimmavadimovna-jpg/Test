import { mulberry32, pick } from "./rng";
import type { RNG } from "./rng";
import type { Task, TaskGenerator, TaskType } from "./types";

import { ratioPercent } from "./taskTypes/ratioPercent";
import { partOfWhole } from "./taskTypes/partOfWhole";
import { percentChange } from "./taskTypes/percentChange";
import { singleDiscount } from "./taskTypes/singleDiscount";
import { timesChange } from "./taskTypes/timesChange";

const GENERATORS: TaskGenerator[] = [
  ratioPercent,
  partOfWhole,
  percentChange,
  singleDiscount,
  timesChange,
];

/**
 * Список всех доступных типов задач (для UI)
 */
export const TASK_TYPES: TaskType[] = GENERATORS.map(
  (g) => g.id as TaskType
);

export const TASK_TYPE_LABELS: Record<TaskType, string> = GENERATORS.reduce(
  (acc, g) => {
    acc[g.id as TaskType] = g.title;
    return acc;
  },
  {} as Record<TaskType, string>
);

const MAX_ATTEMPTS = 20;

function resolveGenerator(type: TaskType | undefined, rng: RNG): TaskGenerator {
  if (type !== undefined) {
    const generator = GENERATORS.find((g) => g.id === type);
    if (!generator) {
      throw new Error(`Unknown task type: ${type}`);
    }
    return generator;
  }

  return pick(rng, GENERATORS);
}

function generateTaskWithRng(
  rng: RNG,
  type?: TaskType,
  fixedGenerator?: TaskGenerator
): Task {
  const taskSeed = rng.seed;
  const generator = fixedGenerator ?? resolveGenerator(type, rng);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const task = generator.generate(rng);
      return {
        ...task,
        meta: {
          ...task.meta,
          seed: taskSeed,
        },
      };
    } catch {
      // пробуем ещё раз
    }
  }

  throw new Error("Failed to generate task after multiple attempts");
}

export function generateTasks(
  type?: TaskType,
  seed: number = Date.now(),
  count: number = 1
): Task[] {
  const normalizedCount = Number.isFinite(count) ? Math.floor(count) : 1;
  const safeCount = Math.max(1, normalizedCount);
  const rng = mulberry32(seed);
  const fixedGenerator = type !== undefined ? resolveGenerator(type, rng) : undefined;
  const tasks: Task[] = [];

  for (let i = 0; i < safeCount; i += 1) {
    tasks.push(generateTaskWithRng(rng, type, fixedGenerator));
  }

  return tasks;
}

export function generateTask(
  type?: TaskType,
  seed: number = Date.now()
): Task {
  return generateTasks(type, seed, 1)[0];
}

export type { Task, TaskType } from "./types";
