import { formatNumber } from "../format";
import { pick, randInt } from "../rng";
import { ensure, isNiceInteger } from "../validate";
import type { TaskGenerator } from "../types";

const TEMPLATES = {
  discount: [
    "Цена товара {price} руб. Магазин сделал скидку {percent}%. Сколько стала стоить покупка?",
    "Товар стоил {price} руб. После скидки {percent}% сколько он стоит?",
    "Цена {price} руб. После уценки на {percent}% стала равна чему?"
  ],
  markup: [
    "К цене {price} руб. сделали наценку {percent}%. Какова новая цена?",
    "Товар стоил {price} руб. После наценки {percent}% его цена стала равна чему?",
    "Цена {price} руб. После повышения на {percent}% стала равна чему?"
  ]
};

export const singleDiscount: TaskGenerator = {
  id: "single-discount",
  title: "Скидка/наценка",
  generate: (rng) => {
    const mode = pick(rng, ["discount", "markup"]);
    const percent = pick(rng, [5, 10, 15, 20, 25, 30]);
    const base = 100 / gcd(100, percent);
    const price = randInt(rng, 8, 30) * base * 10;
    const factor = mode === "discount" ? 1 - percent / 100 : 1 + percent / 100;
    const result = price * factor;
    ensure(isNiceInteger(result));

    const template = pick(rng, TEMPLATES[mode]);
    const statement = template
      .replace("{price}", String(price))
      .replace("{percent}", String(percent));

    return {
      id: `${Date.now()}-single-discount`,
      type: "single-discount",
      statement,
      answer: formatNumber(result),
      steps: [
        `Шаг 1. Переводим процент в коэффициент: ${mode === "discount" ? "1 -" : "1 +"} ${percent}/100 = ${formatNumber(factor)}.`,
        `Шаг 2. Новая цена: ${price} × ${formatNumber(factor)} = ${formatNumber(result)}.`,
        `Ответ: ${formatNumber(result)}.`
      ],
      meta: {
        seed: 0,
        params: { price, percent, mode }
      }
    };
  },
  solveFromParams: (params) => {
    const price = Number(params.price);
    const percent = Number(params.percent);
    const mode = String(params.mode);
    const factor = mode === "discount" ? 1 - percent / 100 : 1 + percent / 100;
    return price * factor;
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
