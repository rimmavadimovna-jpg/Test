// src/generator/taskTypes/singleDiscount.ts

import { pick, type RNG } from "../rng";
import { ensure, isNiceInteger } from "../validate";
import type { Task, TaskGenerator } from "../types";

const TEMPLATES = {
  discount: [
    "Цена товара была {price} руб. Её снизили на {percent}%. Сколько стала цена товара?",
    "Товар стоил {price} руб. После скидки {percent}% сколько он стал стоить?",
    "Цена {price} руб. Сделали скидку {percent}%. Найдите новую цену.",
  ],
  markup: [
    "Цена товара была {price} руб. Её повысили на {percent}%. Сколько стала цена товара?",
    "Товар стоил {price} руб. После наценки {percent}% сколько он стал стоить?",
    "Цена {price} руб. Сделали наценку {percent}%. Найдите новую цену.",
  ],
} as const;

type Mode = keyof typeof TEMPLATES; // "discount" | "markup"

const PRICE_VALUES = [
  100, 120, 150, 160, 180, 200, 240, 250, 300, 320, 360, 400,
  450, 480, 500, 600, 640, 720, 750, 800, 900, 960, 1000, 1200,
  1500, 1600, 1800, 2000,
] as const;

const PERCENT_VALUES = [5, 10, 15, 20, 25, 30, 40, 50] as const;

function computeResult(price: number, percent: number, mode: Mode): number {
  if (mode === "discount") {
    return (price * (100 - percent)) / 100;
  }
  return (price * (100 + percent)) / 100;
}

function makeId(prefix: string): string {
  const uuid =
    typeof globalThis !== "undefined" &&
    (globalThis as any).crypto?.randomUUID?.();

  return uuid
    ? `${prefix}-${uuid}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const singleDiscount: TaskGenerator = {
  id: "singleDiscount",
  title: "Скидка/наценка на процент",

  generate: (rng: RNG): Task => {
    const seed =
      typeof (rng as any).seed === "number"
        ? (rng as any).seed
        : Date.now();

    // ВАЖНО: mode НЕ string, а строго "discount" | "markup"
    const mode = pick(rng, ["discount", "markup"] as const);

    // Подбираем price/percent так, чтобы ответ был красивым целым числом
    let price = pick(rng, [...PRICE_VALUES]);
    let percent = pick(rng, [...PERCENT_VALUES]);
    let result = computeResult(price, percent, mode);

    for (let i = 0; i < 60 && !isNiceInteger(result); i++) {
      price = pick(rng, [...PRICE_VALUES]);
      percent = pick(rng, [...PERCENT_VALUES]);
      result = computeResult(price, percent, mode);
    }

    ensure(isNiceInteger(result));

    const template = pick(rng, TEMPLATES[mode]);
    const statement = template
      .replace("{price}", String(price))
      .replace("{percent}", String(percent));

    const answer = String(result);

    const steps = [
      mode === "discount"
        ? `Скидка ${percent}% означает, что остаётся ${100 - percent}% от цены.`
        : `Наценка ${percent}% означает, что становится ${100 + percent}% от цены.`,
      mode === "discount"
        ? `Новая цена: ${price} · ${(100 - percent)}/100 = ${answer}.`
        : `Новая цена: ${price} · ${(100 + percent)}/100 = ${answer}.`,
    ];

    return {
      id: makeId("singleDiscount"),
      type: "singleDiscount",
      statement,
      answer,
      steps,
      meta: {
        seed,
        params: { price, percent, mode },
      },
    };
  },

  solveFromParams: (params: Record<string, unknown>): number => {
    const priceRaw = params.price;
    const percentRaw = params.percent;
    const modeRaw = params.mode;

    const price = typeof priceRaw === "number" ? priceRaw : Number(priceRaw);
    const percent = typeof percentRaw === "number" ? percentRaw : Number(percentRaw);

    if (!Number.isFinite(price) || !Number.isFinite(percent)) return NaN;

    const mode: Mode =
      modeRaw === "discount" || modeRaw === "markup" ? modeRaw : "discount";

    return computeResult(price, percent, mode);
  },
};

export default singleDiscount;
