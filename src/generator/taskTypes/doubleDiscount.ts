import { formatNumber } from "../format";
import { pick, randInt } from "../rng";
import { ensure, isNiceInteger } from "../validate";
import type { TaskGenerator } from "../types";

const TEMPLATES = [
  "Цена {price} руб. Сначала сделали {first}% {firstWord}, затем ещё {second}% {secondWord}. Какова итоговая цена?",
  "Товар стоил {price} руб. После {first}% {firstWord} и последующей {second}% {secondWord} сколько он стоит?",
  "К цене {price} руб. применили {first}% {firstWord}, а потом {second}% {secondWord}. Найдите итоговую цену."
];

export const doubleDiscount: TaskGenerator = {
  id: "double-discount",
  title: "Две последовательные скидки/наценки",
  generate: (rng) => {
    const pattern = pick(rng, [
      { first: "discount", second: "discount" },
      { first: "markup", second: "markup" },
      { first: "discount", second: "markup" }
    ]);
    const first = pick(rng, [5, 10, 15, 20, 25, 30]);
    const second = pick(rng, [5, 10, 15, 20, 25, 30]);
    const numerator = (100 + (pattern.first === "markup" ? first : -first)) *
      (100 + (pattern.second === "markup" ? second : -second));
    const denominator = 10000;
    const step = denominator / gcd(denominator, Math.abs(numerator));
    const price = randInt(rng, 10, 40) * step;
    const result = (price * numerator) / denominator;
    ensure(isNiceInteger(result));

    const template = pick(rng, TEMPLATES);
    const statement = template
      .replace("{price}", String(price))
      .replace("{first}", String(first))
      .replace("{second}", String(second))
      .replace("{firstWord}", pattern.first === "markup" ? "наценки" : "скидки")
      .replace("{secondWord}", pattern.second === "markup" ? "наценки" : "скидки");

    const factor1 = 1 + (pattern.first === "markup" ? first : -first) / 100;
    const factor2 = 1 + (pattern.second === "markup" ? second : -second) / 100;

    return {
      id: `${Date.now()}-double-discount`,
      type: "double-discount",
      statement,
      answer: formatNumber(result),
      steps: [
        `Шаг 1. Первый коэффициент: ${formatNumber(factor1)}.`,
        `Шаг 2. Второй коэффициент: ${formatNumber(factor2)}.`,
        `Шаг 3. Итоговая цена: ${price} × ${formatNumber(factor1)} × ${formatNumber(factor2)} = ${formatNumber(result)}.`,
        `Ответ: ${formatNumber(result)}.`
      ],
      meta: {
        seed: 0,
        params: { price, first, second, pattern: `${pattern.first}-${pattern.second}` }
      }
    };
  },
  solveFromParams: (params) => {
    const price = Number(params.price);
    const first = Number(params.first);
    const second = Number(params.second);
    const pattern = String(params.pattern);
    const [firstMode, secondMode] = pattern.split("-");
    const factor1 = 1 + (firstMode === "markup" ? first : -first) / 100;
    const factor2 = 1 + (secondMode === "markup" ? second : -second) / 100;
    return price * factor1 * factor2;
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
