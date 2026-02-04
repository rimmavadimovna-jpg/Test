import { formatNumber, formatPercent } from "../format";
import { pick } from "../rng";
import type { TaskGenerator } from "../types";

const TEMPLATES = [
  "Новая цена составляет {fraction} от старой. На сколько процентов изменилась цена?",
  "После изменения новая величина стала равна {fraction} от исходной. На сколько процентов она изменилась?",
  "После уценки цена стала {fraction} от прежней. На сколько процентов уменьшилась цена?"
];

export const fractionOfOld: TaskGenerator = {
  id: "fraction-of-old",
  title: "Новая цена = m от старой",
  generate: (rng) => {
    const fraction = pick(rng, [0.8, 0.85, 0.9, 0.96, 1.1, 1.2, 1.25]);
    const percentChange = (fraction - 1) * 100;
    const absPercent = Math.abs(percentChange);

    const statement = pick(rng, TEMPLATES).replace(
      "{fraction}",
      fraction.toString().replace(".", ",")
    );

    return {
      id: `${Date.now()}-fraction-of-old`,
      type: "fraction-of-old",
      statement,
      answer: formatNumber(absPercent),
      steps: [
        `Шаг 1. Новая величина = ${formatNumber(fraction)} от старой.`,
        `Шаг 2. Изменение: ${formatNumber((fraction - 1) * 100)}%.`,
        `Шаг 3. По модулю это ${formatPercent(absPercent)}.`,
        `Ответ: ${formatNumber(absPercent)}.`
      ],
      meta: {
        seed: 0,
        params: { fraction }
      }
    };
  },
  solveFromParams: (params) => {
    const fraction = Number(params.fraction);
    return Math.abs((fraction - 1) * 100);
  }
};
