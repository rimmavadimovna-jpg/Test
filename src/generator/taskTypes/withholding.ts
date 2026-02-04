import { formatNumber, formatPercent } from "../format";
import { pick, randInt } from "../rng";
import { ensure, isNiceInteger } from "../validate";
import type { TaskGenerator } from "../types";

const TEMPLATES = {
  findBefore: [
    "Из зарплаты удержали {percent}%, после чего работник получил {after} руб. Какова была начисленная зарплата?",
    "После удержания {percent}% налогов осталось {after} руб. Сколько было до удержания?",
    "После удержания {percent}% осталось {after} руб. Найдите сумму до удержания."
  ],
  findAfter: [
    "С суммы {before} руб. удержали {percent}%. Сколько осталось?",
    "Из суммы {before} руб. удержали {percent}%. Найдите сумму после удержания.",
    "С зарплаты {before} руб. удержали {percent}%. Сколько получил работник?"
  ]
};

export const withholding: TaskGenerator = {
  id: "withholding",
  title: "Удержание/налог",
  generate: (rng) => {
    const percent = pick(rng, [10, 13, 15, 20]);
    const mode = pick(rng, ["find-before", "find-after"]);
    const base = 100 / gcd(100, 100 - percent);
    const before = randInt(rng, 15, 50) * base * 10;
    const after = (before * (100 - percent)) / 100;
    ensure(isNiceInteger(after));

    const template = pick(rng, mode === "find-before" ? TEMPLATES.findBefore : TEMPLATES.findAfter);
    const statement = template
      .replace("{percent}", String(percent))
      .replace("{after}", String(after))
      .replace("{before}", String(before));

    const answer = mode === "find-before" ? before : after;

    return {
      id: `${Date.now()}-withholding`,
      type: "withholding",
      statement,
      answer: formatNumber(answer),
      steps: [
        `Шаг 1. После удержания осталось ${formatPercent(100 - percent)} от суммы.`,
        mode === "find-before"
          ? `Шаг 2. Начисленная сумма: ${after} / ${(100 - percent) / 100} = ${before}.`
          : `Шаг 2. Остаток: ${before} × ${(100 - percent) / 100} = ${after}.`,
        `Ответ: ${formatNumber(answer)}.`
      ],
      meta: {
        seed: 0,
        params: { before, after, percent, mode }
      }
    };
  },
  solveFromParams: (params) => {
    const before = Number(params.before);
    const percent = Number(params.percent);
    const mode = String(params.mode);
    const after = (before * (100 - percent)) / 100;
    return mode === "find-before" ? before : after;
  }
};

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}
