"use client";

import { useMemo, useState } from "react";
import {
  TASK_TYPES,
  generateTask,
  type TaskType,
  type Task,
} from "../src/generator";

const DEFAULT_SEED = "12345";

function parseSeed(input: string): number | undefined {
  const s = input.trim();
  if (!s) return undefined;

  // разрешим только целое
  const n = Number(s);
  if (!Number.isFinite(n)) return undefined;

  const int = Math.floor(n);
  if (int <= 0) return undefined;

  return int;
}

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<TaskType | "any">("any");
  const [seedInput, setSeedInput] = useState(DEFAULT_SEED);

  const seedValue = useMemo(() => parseSeed(seedInput), [seedInput]);

  const [task, setTask] = useState<Task>(() => generateTask());
  const [showSolution, setShowSolution] = useState(false);

  const handleGenerate = () => {
    const normalizedType: TaskType | undefined =
      selectedType === "any" ? undefined : selectedType;

    const nextTask = generateTask(normalizedType, seedValue ?? Date.now());
    setTask(nextTask);
    setShowSolution(false);
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>
        Генератор задач ЕГЭ (№6: проценты)
      </h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Тип задачи</span>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as TaskType | "any")
            }
            style={{ padding: 8, minWidth: 220 }}
          >
            <option value="any">Любой</option>
            {TASK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Seed (целое число, необязательно)</span>
          <input
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            placeholder="например 12345"
            style={{ padding: 8, minWidth: 220 }}
          />
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            {seedValue ? `Используется seed: ${seedValue}` : "Seed не задан → случайно"}
          </span>
        </label>

        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            marginTop: 22,
          }}
        >
          Сгенерировать
        </button>

        <button
          onClick={() => setShowSolution((v) => !v)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            marginTop: 22,
          }}
        >
          {showSolution ? "Скрыть решение" : "Показать решение"}
        </button>
      </div>

      <section
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 6 }}>
          Тип: <b>{task.type}</b>
        </div>

        <div style={{ fontSize: 18, lineHeight: 1.4 }}>{task.statement}</div>
      </section>

      {showSolution && (
        <section
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 10 }}>Решение</h2>

          <div style={{ marginBottom: 12 }}>
            <b>Ответ:</b> {task.answer}
          </div>

          <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.45 }}>
            {task.steps.map((s, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {s}
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
