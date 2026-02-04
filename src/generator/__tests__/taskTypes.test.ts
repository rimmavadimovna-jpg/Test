import { describe, expect, it } from "vitest";
import { mulberry32 } from "../rng";
import { formatNumber } from "../format";
import { ratioPercent } from "../taskTypes/ratioPercent";
import { partOfWhole } from "../taskTypes/partOfWhole";
import { percentChange } from "../taskTypes/percentChange";
import { timesChange } from "../taskTypes/timesChange";
import { singleDiscount } from "../taskTypes/singleDiscount";
import { doubleDiscount } from "../taskTypes/doubleDiscount";
import { withholding } from "../taskTypes/withholding";
import { fractionOfOld } from "../taskTypes/fractionOfOld";

const generators = [
  ratioPercent,
  partOfWhole,
  percentChange,
  timesChange,
  singleDiscount,
  doubleDiscount,
  withholding,
  fractionOfOld
];

const seeds = [123, 456, 789];

describe("task generators", () => {
  generators.forEach((generator) => {
    describe(generator.id, () => {
      seeds.forEach((seed) => {
        it(`seed ${seed} matches solver`, () => {
          const rng = mulberry32(seed);
          const task = generator.generate(rng);
          expect(task.statement).toBeTruthy();
          expect(task.steps.length).toBeGreaterThan(1);
          const solver = generator.solveFromParams;
          expect(solver).toBeDefined();
          if (solver) {
            const solved = solver(task.meta.params);
            expect(task.answer).toBe(formatNumber(solved));
          }
        });
      });
    });
  });
});
