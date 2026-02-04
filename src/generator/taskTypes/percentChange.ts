import { formatNumber } from "../format";
import { pick, randInt } from "../rng";
import { ensure, isNiceInteger } from "../validate";
import type { TaskGenerator } from "../types";

const TEMPLATES = [
  {
    template:
      "Цена товара была {start} руб., стала {end} руб. На сколько процентов она {word}?",
    increase: "увеличилась",
    decrease: "уменьшилась"
  },
  {
    template:
      "Вклад увеличился с {start} руб. до {end} руб. На сколько процентов он {word}?",
    increase: "увеличился",
    decrease: "уменьшился"
  },
  {
    template:
      "Количество учеников изменилось с {start} до {end}. На сколько процентов оно {word}?",
    increase: "увеличилось",
    decrease: "уменьшилось"
  }
];

export const percentChange: TaskGenerator = {
  id: "percent-change",
  title: "Процентное изменение (было/стало)",
  generate: (rng) => {
    const change = pick(rng, [-40, -30, -25, -20, -15, 10, 15, 20, 25, 30, 40, 50]);
    const base = 100 / gcd(100, Math.abs(change));
    const start = randInt(rng, 5, 20) * base * 10;
    const end = start * (1 + change / 100);
    ensure(isNiceInteger(end));

    const template = pick(rng, TEMPLATES);
    const word = change > 0 ? template.increase : template.decrease;
    const statement = template.template
      .replace("{start}", String(start))
      .replace("{end}", String(end))
      .replace("{word}", word);

    return {
      id: `${Date.now()}-percent-change`,
      type: "percent-change",
      statement,
      answer: formatNumber(Math.abs(change)),
      steps: [
        `Шаг 1. Находим изменение: ${end} - ${start} = ${end - start}.`,
        `Шаг 2. Делим изменение на исходное: ${end - start} / ${start}.`,
        `Шаг 3. Переводим в проценты: ${formatNumber(Math.abs(change))}%.`,
        `Ответ: ${formatNumber(Math.abs(change))}.`
      ],
      meta: {
        seed: 0,
        params: { start, end, change }
      }
    };
  },
  solveFromParams: (params) => {
    const start = Number(params.start);
    const end = Number(params.end);
    return (Math.abs(end - start) / start) * 100;
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
