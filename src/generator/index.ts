import { mulberry32, pick } from "./rng";
import type { Task, TaskGenerator, TaskType } from "./types";
import { ratioPercent } from "./taskTypes/ratioPercent";
import { partOfWhole } from "./taskTypes/partOfWhole";
import { percentChange } from "./taskTypes/percentChange";
import { timesChange } from "./taskTypes/timesChange";
import { singleDiscount } from "./taskTypes/singleDiscount";
import { doubleDiscount } from "./taskTypes/doubleDiscount";
import { withholding } from "./taskTypes/withholding";
import { fractionOfOld } from "./taskTypes/fractionOfOld";

const GENERATORS: TaskGenerator[] = [
  ratioPercent,
  partOfWhole,
  percentChange,
  timesChange,
  singleDiscount,
  doubleDiscount,
  withholding,
  fractionOfOld
];

export const TASK_TYPES = GENERATORS.map((gen) => ({
  id: gen.id,
  title: gen.title
}));

export function generateTask({
  type,
  seed
}: {
  type: TaskType | "any";
  seed: number | null;
}): Task {
  const actualSeed = seed ?? Math.floor(Math.random() * 1_000_000_000);
  const rng = mulberry32(actualSeed);
  const generator =
    type === "any" ? pick(rng, GENERATORS) : GENERATORS.find((g) => g.id === type);

  if (!generator) {
    throw new Error("Unknown task type");
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const task = generator.generate(rng);
      return {
        ...task,
        meta: {
          seed: actualSeed,
          params: task.meta.params
        }
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
    }
  }

  throw lastError ?? new Error("Failed to generate task");
}

export type { Task, TaskType } from "./types";
