import { formatNumber, roundTo } from "../format";
import { pick } from "../rng";
import type { TaskGenerator } from "../types";

const TEMPLATES = {
  increase: [
    "Число увеличилось в {k} раза. На сколько процентов оно увеличилось?",
    "Производительность выросла в {k} раза. На сколько процентов она увеличилась?",
    "Выпуск продукции увеличился в {k} раза. На сколько процентов он вырос?"
  ],
  decrease: [
    "Объём продаж уменьшился в {k} раза. На сколько процентов он уменьшился?",
    "Число уменьшилось в {k} раза. На сколько процентов оно уменьшилось?",
    "Потребление снизилось в {k} раза. На сколько процентов оно уменьшилось?"
  ]
};

export const timesChange: TaskGenerator = {
  id: "times-change",
  title: "Увеличилось/уменьшилось в k раз",
  generate: (rng) => {
    const mode = pick(rng, ["increase", "decrease", "increase"]);
    const k = mode === "decrease" ? pick(rng, [2, 4, 5, 10]) : pick(rng, [2, 3, 4, 5]);
    const percent =
      mode === "decrease"
        ? roundTo((1 - 1 / k) * 100, k === 3 ? 1 : 0)
        : (k - 1) * 100;

    const template = pick(rng, TEMPLATES[mode]);
    const statement = template.replace("{k}", String(k));

    return {
      id: `${Date.now()}-times-change`,
      type: "times-change",
      statement,
      answer: formatNumber(percent),
      steps: [
        `Шаг 1. При изменении в ${k} раза новое значение = старое × ${k}.`,
        mode === "decrease"
          ? `Шаг 2. Уменьшение: 1 - 1/${k} = ${formatNumber(roundTo(1 - 1 / k, 3))}.`
          : `Шаг 2. Увеличение: ${k} - 1 = ${k - 1}.`,
        `Шаг 3. Переводим в проценты: ${formatNumber(percent)}%.`,
        `Ответ: ${formatNumber(percent)}.`
      ],
      meta: {
        seed: 0,
        params: { k, mode }
      }
    };
  },
  solveFromParams: (params) => {
    const k = Number(params.k);
    const mode = String(params.mode);
    if (mode === "decrease") {
      return (1 - 1 / k) * 100;
    }
    return (k - 1) * 100;
  }
};
