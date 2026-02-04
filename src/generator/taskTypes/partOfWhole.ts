import { formatNumber, formatPercent } from "../format";
import { pick, randInt } from "../rng";
import { ensure, isNiceInteger } from "../validate";
import type { TaskGenerator } from "../types";

const TEMPLATES = [
  "В классе {total} учеников, из них {percent}% — девочки. Сколько девочек в классе?",
  "В магазине {total} товаров, {percent}% из них — книги. Сколько книг в магазине?",
  "В команде {total} спортсменов, {percent}% — нападающие. Сколько нападающих в команде?"
];

export const partOfWhole: TaskGenerator = {
  id: "part-of-whole",
  title: "Часть от целого",
  generate: (rng) => {
    const percent = pick(rng, [10, 15, 20, 25, 30, 40, 45, 50, 60, 75]);
    const base = 100 / gcd(100, percent);
    const total = randInt(rng, 3, 12) * base * 10;
    const part = (total * percent) / 100;
    ensure(isNiceInteger(part));

    const template = pick(rng, TEMPLATES);
    const statement = template
      .replace("{total}", String(total))
      .replace("{percent}", String(percent));

    return {
      id: `${Date.now()}-part-of-whole`,
      type: "part-of-whole",
      statement,
      answer: formatNumber(part),
      steps: [
        `Шаг 1. Находим ${formatPercent(percent)} от ${total}: ${total} × ${percent} / 100.`,
        `Шаг 2. ${total} × ${percent} / 100 = ${formatNumber(part)}.`,
        `Ответ: ${formatNumber(part)}.`
      ],
      meta: {
        seed: 0,
        params: { total, percent }
      }
    };
  },
  solveFromParams: (params) => {
    const total = Number(params.total);
    const percent = Number(params.percent);
    return (total * percent) / 100;
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
