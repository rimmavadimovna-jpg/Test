"use client";

import { useMemo, useState } from "react";
import {
  TASK_TYPES,
  generateTask,
  type TaskType,
  type Task
} from "../src/generator";

const DEFAULT_SEED = "";

function parseSeed(value: string): number | null {
  if (!value.trim()) {
    return null;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Math.floor(parsed);
  }
  return null;
}

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<TaskType | "any">("any");
  const [seedInput, setSeedInput] = useState(DEFAULT_SEED);
  const [task, setTask] = useState<Task>(() =>
    generateTask({ type: "any", seed: null })
  );
  const [showSolution, setShowSolution] = useState(false);
  const seedValue = useMemo(() => parseSeed(seedInput), [seedInput]);

  const handleGenerate = () => {
    const nextTask = generateTask({
      type: selectedType,
      seed: seedValue
    });
    setTask(nextTask);
    setShowSolution(false);
  };

  const handleCopyJson = async () => {
    const payload = JSON.stringify(task, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      alert("JSON скопирован в буфер обмена!");
    } catch (error) {
      console.error(error);
      alert("Не удалось скопировать JSON. Попробуйте ещё раз.");
    }
  };

  return (
    <div className="content">
      <section className="controls">
        <div className="control">
          <label htmlFor="task-type">Тип задачи №6</label>
          <select
            id="task-type"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value as TaskType | "any")
            }
          >
            <option value="any">Любой</option>
            {TASK_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.title}
              </option>
            ))}
          </select>
        </div>
        <div className="control">
          <label htmlFor="seed">Seed (опционально)</label>
          <input
            id="seed"
            type="number"
            placeholder="Например, 123"
            value={seedInput}
            onChange={(event) => setSeedInput(event.target.value)}
          />
          <small>
            Укажите seed, чтобы воспроизвести задачу. Пустое поле = случайно.
          </small>
        </div>
        <div className="buttons">
          <button onClick={handleGenerate}>Сгенерировать</button>
          <button type="button" onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? "Скрыть решение" : "Показать решение"}
          </button>
          <button type="button" onClick={handleCopyJson}>
            Скопировать как JSON
          </button>
        </div>
      </section>

      <section className="cards">
        <article className="card">
          <h2>Условие</h2>
          <p>{task.statement}</p>
        </article>
        <article className="card">
          <h2>Ответ</h2>
          <p>{task.answer}</p>
        </article>
        <article className="card">
          <h2>Решение (шаги)</h2>
          {showSolution ? (
            <ol>
              {task.steps.map((step, index) => (
                <li key={`${task.id}-step-${index}`}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="muted">Нажмите “Показать решение”.</p>
          )}
        </article>
      </section>

      <section className="meta">
        <h3>Метаданные</h3>
        <div className="meta-grid">
          <div>
            <strong>Тип:</strong> {task.type}
          </div>
          <div>
            <strong>Seed:</strong> {task.meta.seed}
          </div>
        </div>
      </section>
    </div>
  );
}
