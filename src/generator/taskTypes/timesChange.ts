// src/generator/taskTypes/timesChange.ts

import { pick, type RNG } from "../rng";
import type { Task, TaskGenerator } from "../types";

const TEMPLATES = {
  increase: [
    "Величина увеличилась в {k} раза. На сколько процентов увеличилась величина?",
    "Число увеличили в {k} раза. На сколько процентов увеличилось число?",
    "Цена выросла в {k} раза. На сколько процентов выросла цена?",
  ],
  decrease: [
    "Величина уменьшилась в {k} раза. На сколько процентов уменьшилась величина?",
    "Число уменьшили в {k} раза. На сколько процентов уменьшилось число?",
    "Цена уменьшилась в {k} раза. На сколько процентов уменьшилась цена?",
  ],
} as const;

type Mode = keyof typeof TEMPLATES; // "increase" | "decrease"

// k подобраны так, чтобы (1 - 1/k) * 100 было целым
const K_VALUES = [2, 4, 5, 10] as const;

function computeAnswer(k: number, mode: Mode): number {
  if (mode === "increase") return (k - 1) * 100;
  return (1 - 1 / k) * 100;
}

function makeId(prefix: string): string {
  const uuid =
    typeof globalThis !== "undefined" &&
    (globalThis as any).crypto?.randomUUID?.();

  return uuid
    ? `${prefix}-${uuid}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const timesChange: TaskGenerator = {
  id: "timesChange",
  title: "Изменение в несколько раз → проценты",

  generate: (rng: RNG): Task => {
    // В meta.seed нужно число. В твоём RNG, судя по проекту, seed обычно лежит как поле.
    // Если поля seed нет, поставим стабильный fallback.
    const seed =
      typeof (rng as any).seed === "number"
        ? (rng as any).seed
        : Date.now();

    const k = pick(rng, [...K_VALUES]);
    const mode = pick(rng, ["increase", "decrease"] as const);

    const answerNumber = computeAnswer(k, mode);
    const answer = String(answerNumber);

    const template = pick(rng, TEMPLATES[mode]);
    const statement = template.replace("{k}", String(k));

    return {
      id: makeId("timesChange"),
      type: "timesChange",
      statement,
      answer,
      steps: [
        mode === "increase"
          ? `Увеличение в ${k} раза: новое = старое · ${k}.`
          : `Уменьшение в ${k} раза: новое = старое / ${k}.`,
        mode === "increase"
          ? `Процентное увеличение: (k − 1) · 100 = (${k} − 1) · 100 = ${answer}%.`
          : `Процентное уменьшение: (1 − 1/k) · 100 = (1 − 1/${k}) · 100 = ${answer}%.`,
      ],
      meta: {
        seed,
        params: { k, mode },
      },
    };
  },

  solveFromParams: (params: Record<string, unknown>): number => {
    const kRaw = params.k;
    const modeRaw = params.mode;

    const k = typeof kRaw === "number" ? kRaw : Number(kRaw);
    if (!Number.isFinite(k) || k <= 0) return NaN;

    const mode: Mode =
      modeRaw === "increase" || modeRaw === "decrease"
        ? modeRaw
        : "increase";

    return computeAnswer(k, mode);
  },
};

export default timesChange;
