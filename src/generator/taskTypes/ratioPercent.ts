import { formatNumber, formatPercent, toRatioPercent } from "../format";
import { pick, randInt } from "../rng";
import { ensure, isNiceNumber } from "../validate";
import type { TaskGenerator } from "../types";

const TEMPLATES = [
  "Отношение числа мальчиков к числу девочек в классе равно {a}:{b}. Сколько процентов составляет число мальчиков от общего числа учащихся?",
  "В группе отношение числа участников с опытом к новичкам равно {a}:{b}. Какой процент составляют опытные от общего числа?",
  "В ящике отношение зелёных шаров к красным равно {a}:{b}. Какой процент всех шаров — зелёные?"
];

export const ratioPercent: TaskGenerator = {
  id: "ratio-percent",
  title: "Отношение a:b → процент",
  generate: (rng) => {
    const validPairs: Array<[number, number]> = [];
    for (let a = 2; a <= 9; a += 1) {
      for (let b = 2; b <= 9; b += 1) {
        const total = a + b;
        if (100 % total === 0) {
          validPairs.push([a, b]);
        }
      }
    }
    const [a, b] = pick(rng, validPairs);
    const percent = toRatioPercent(a, b);
    ensure(isNiceNumber(percent));

    const template = pick(rng, TEMPLATES);
    const statement = template.replace("{a}", String(a)).replace("{b}", String(b));

    return {
      id: `${Date.now()}-ratio-percent`,
      type: "ratio-percent",
      statement,
      answer: formatNumber(percent),
      steps: [
        `Шаг 1. Всего частей: ${a} + ${b} = ${a + b}.`,
        `Шаг 2. Доля нужной части: ${a} / ${a + b}.`,
        `Шаг 3. Переводим в проценты: ${a} / ${a + b} × 100% = ${formatPercent(percent)}.`,
        `Ответ: ${formatNumber(percent)}.`
      ],
      meta: {
        seed: 0,
        params: { a, b }
      }
    };
  },
  solveFromParams: (params) => {
    const a = Number(params.a);
    const b = Number(params.b);
    return toRatioPercent(a, b);
  }
};
