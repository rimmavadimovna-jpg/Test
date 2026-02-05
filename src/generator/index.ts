import { mulberry32, pick } from "./rng";
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

export function generateTask(
  type?: TaskType,
  seed: number = Date.now()
): Task {
  const rng = mulberry32(seed);

  const generator =
    type !== undefined
      ? GENERATORS.find((g) => g.id === type)
      : pick(rng, GENERATORS);

  if (!generator) {
    throw new Error(`Unknown task type: ${type}`);
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const task = generator.generate(rng);
      return {
        ...task,
        meta: {
          ...task.meta,
          seed,
        },
      };
    } catch {
      // пробуем ещё раз
    }
  }

  throw new Error("Failed to generate task after multiple attempts");
}
export type { Task, TaskType } from "./types";
