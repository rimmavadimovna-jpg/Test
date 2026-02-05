"use client";

import { useMemo, useState } from "react";
import {
  TASK_TYPES,
  TASK_TYPE_LABELS,
  generateTasks,
  type TaskType,
  type Task,
} from "../src/generator";

const DEFAULT_SEED = "";
const DEFAULT_COUNT = "1";

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

function parseCount(input: string): number {
  const s = input.trim();
  if (!s) return 1;

  const n = Number(s);
  if (!Number.isFinite(n)) return 1;

  const int = Math.floor(n);
  if (int <= 0) return 1;

  return int;
}

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<TaskType | "any">("any");
  const [seedInput, setSeedInput] = useState(DEFAULT_SEED);
  const [countInput, setCountInput] = useState(DEFAULT_COUNT);

  const seedValue = useMemo(() => parseSeed(seedInput), [seedInput]);
  const countValue = useMemo(() => parseCount(countInput), [countInput]);

  const [tasks, setTasks] = useState<Task[]>(() => generateTasks());
  const [showSolution, setShowSolution] = useState(false);

  const handleGenerate = () => {
    const normalizedType: TaskType | undefined =
      selectedType === "any" ? undefined : selectedType;

    const nextTasks = generateTasks(
      normalizedType,
      seedValue ?? Date.now(),
      countValue
    );
    setTasks(nextTasks);
    setShowSolution(false);
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
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
                {TASK_TYPE_LABELS[t] ?? t}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Seed</span>
          <input
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            placeholder="например 12345"
            style={{ padding: 8, minWidth: 220 }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Количество задач</span>
          <input
            type="number"
            min={1}
            step={1}
            value={countInput}
            onChange={(e) => setCountInput(e.target.value)}
            placeholder="например 5"
            style={{ padding: 8, minWidth: 160 }}
          />
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

      {tasks.map((task, index) => {
        const taskTypeLabel = TASK_TYPE_LABELS[task.type] ?? task.type;

        return (
          <section
            key={`${task.id}-${index}`}
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 6 }}>
              Задача {index + 1}. Тип: <b>{taskTypeLabel}</b>
            </div>

            <div style={{ fontSize: 18, lineHeight: 1.4 }}>
              {task.statement}
            </div>

            {showSolution && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px dashed rgba(255,255,255,0.2)",
                }}
              >
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>Решение</h3>

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
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}
