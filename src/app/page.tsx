"use client";

import { useState } from "react";
import {
  calculateRate,
  type Position,
  type Skill,
  type CommercialTier,
  type SimulatorInput,
} from "@/lib/calculateRate";

const ACCENT = "#00B4D8";
const FRAME  = "#1A1A2E";

// ────────────────────────────────────────────────
// Primitive UI
// ────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border"
      style={{ color: ACCENT, borderColor: ACCENT }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-6 ${className}`}
      style={{ backgroundColor: FRAME, borderColor: ACCENT + "33" }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-white font-semibold mb-3">{children}</p>;
}

function RadioCard<T extends string>({
  value, current, onChange, children,
}: { value: T; current: T; onChange: (v: T) => void; children: React.ReactNode }) {
  const selected = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className="rounded-xl border p-3 text-left transition-all w-full"
      style={{
        backgroundColor: selected ? ACCENT + "22" : "#0A0A0A",
        borderColor: selected ? ACCENT : "#333",
        color: selected ? "#fff" : "#aaa",
      }}
    >
      {children}
    </button>
  );
}

function CheckCard({
  value, checked, onChange, children,
}: { value: string; checked: boolean; onChange: (v: string, c: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(value, !checked)}
      className="rounded-xl border p-3 text-left transition-all"
      style={{
        backgroundColor: checked ? ACCENT + "22" : "#0A0A0A",
        borderColor: checked ? ACCENT : "#333",
        color: checked ? "#fff" : "#aaa",
      }}
    >
      <span className="mr-2">{checked ? "✓" : "○"}</span>
      {children}
    </button>
  );
}

function PrimaryButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-8 py-3 rounded-xl font-semibold transition-all"
      style={{
        backgroundColor: disabled ? "#333" : ACCENT,
        color: disabled ? "#666" : "#000",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold border transition-all"
      style={{ borderColor: "#444", color: "#aaa" }}
    >
      {children}
    </button>
  );
}

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1 flex-1 rounded-full transition-all"
          style={{ backgroundColor: i < current ? ACCENT : "#333" }} />
      ))}
      <span className="text-xs ml-2" style={{ color: ACCENT }}>{current}/{total}</span>
    </div>
  );
}

// ────────────────────────────────────────────────
// Form state
// ────────────────────────────────────────────────

const DEFAULT_INPUT: SimulatorInput = {
  position: "se",
  skills: [],
  experienceYears: 3,
  commercialTier: "second",
  age: 30,
  gender: "",
  nationality: "日本",
  area: "首都圏",
  commuteMinutes: 60,
  desiredAnnual: 0,
};

// ────────────────────────────────────────────────
// Step 0 – Intro
// ────────────────────────────────────────────────

function StepIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8"><Badge>SE Rate Simulator</Badge></div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
        あなたの市場単価を<br />
        <span style={{ color: ACCENT }}>30秒で確認</span>
      </h1>
      <p className="text-slate-400 max-w-lg text-base mb-10 leading-relaxed">
        スキルシートの情報を入力するだけで、フリーランスSEとしての
        市場単価の目安が即わかります。<br />
        元自衛隊×フリーランスSE13年のリアルな相場感をもとに算出。
      </p>
      <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
        {[
          { icon: "💹", label: "市場単価を即算出" },
          { icon: "⚡", label: "30秒で完成" },
          { icon: "📋", label: "単価アップのアドバイス付き" },
        ].map((f) => (
          <div key={f.label} className="rounded-xl p-4 text-center border"
            style={{ backgroundColor: FRAME, borderColor: ACCENT + "33" }}>
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="text-xs text-slate-400">{f.label}</div>
          </div>
        ))}
      </div>
      <PrimaryButton onClick={onStart}>今すぐ診断する →</PrimaryButton>
      <p className="mt-6 text-xs text-slate-600">データ送信なし・完全ブラウザ完結・無料</p>
    </div>
  );
}

// ────────────────────────────────────────────────
// Step 1 – 工程・経験年数・商流
// ────────────────────────────────────────────────

const POSITIONS: { value: Position; label: string; base: string }[] = [
  { value: "maintenance",  label: "保守・運用",              base: "〜45万" },
  { value: "testing",      label: "テスト",                  base: "〜55万" },
  { value: "pg",           label: "開発（PG）",              base: "〜55万" },
  { value: "version_doc",  label: "バージョンアップ・ドキュメント", base: "〜65万" },
  { value: "se",           label: "開発（SE）",              base: "〜70万" },
  { value: "infra",        label: "インフラ設計・構築",       base: "〜70万" },
  { value: "basic_design", label: "基本設計・DB設計",         base: "〜75万" },
  { value: "pm",           label: "PM・プロジェクト管理",     base: "〜85万" },
  { value: "mobile",       label: "スマホアプリ開発",         base: "〜100万" },
];

const COMMERCIAL: { value: CommercialTier; label: string; desc: string }[] = [
  { value: "direct",        label: "直請け（エンド直）", desc: "+15%" },
  { value: "second",        label: "2次請け",            desc: "基準" },
  { value: "third_or_more", label: "3次請け以降",        desc: "-15%" },
];

function Step1({
  input, onChange, onNext,
}: { input: SimulatorInput; onChange: (k: keyof SimulatorInput, v: unknown) => void; onNext: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">工程・経験・商流</h2>
      <p className="text-slate-400 text-sm mb-6">現在メインで担当している工程を選んでください。</p>

      <div className="mb-6">
        <Label>担当工程</Label>
        <div className="grid grid-cols-1 gap-2">
          {POSITIONS.map((p) => (
            <RadioCard key={p.value} value={p.value} current={input.position} onChange={(v) => onChange("position", v)}>
              <span className="font-semibold">{p.label}</span>
              <span className="text-xs ml-2 opacity-60">目安 {p.base}</span>
            </RadioCard>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Label>経験年数：{input.experienceYears}年</Label>
        <input
          type="range" min={1} max={20} step={1}
          value={input.experienceYears}
          onChange={(e) => onChange("experienceYears", Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1年</span><span>10年</span><span>20年</span>
        </div>
      </div>

      <div className="mb-8">
        <Label>商流（何次請け？）</Label>
        <div className="flex flex-col gap-2">
          {COMMERCIAL.map((c) => (
            <RadioCard key={c.value} value={c.value} current={input.commercialTier} onChange={(v) => onChange("commercialTier", v)}>
              <span className="font-semibold">{c.label}</span>
              <span className="text-xs ml-2 opacity-60">{c.desc}</span>
            </RadioCard>
          ))}
        </div>
      </div>

      <PrimaryButton onClick={onNext}>次へ →</PrimaryButton>
    </div>
  );
}

// ────────────────────────────────────────────────
// Step 2 – スキル
// ────────────────────────────────────────────────

const SKILLS: { value: Skill; label: string; bonus: string }[] = [
  { value: "java_spring", label: "Java / SpringBoot", bonus: "+3万" },
  { value: "react",       label: "React",             bonus: "+5万" },
  { value: "golang",      label: "Go言語",             bonus: "+5万" },
  { value: "swift_ios",   label: "Swift / iOS",       bonus: "+10万" },
  { value: "offshore",    label: "オフショア管理",     bonus: "+5万" },
  { value: "none",        label: "該当なし",           bonus: "" },
];

function Step2({
  input, onChange, onNext, onBack,
}: { input: SimulatorInput; onChange: (k: keyof SimulatorInput, v: unknown) => void; onNext: () => void; onBack: () => void }) {
  const toggle = (v: string, checked: boolean) => {
    const s = v as Skill;
    if (s === "none") {
      onChange("skills", checked ? ["none"] : []);
      return;
    }
    const next = checked
      ? [...input.skills.filter((x) => x !== "none"), s]
      : input.skills.filter((x) => x !== s);
    onChange("skills", next);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">スキル・技術</h2>
      <p className="text-slate-400 text-sm mb-6">経験のあるスキルをすべて選んでください（複数可）。</p>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {SKILLS.map((s) => (
          <CheckCard key={s.value} value={s.value} checked={input.skills.includes(s.value)} onChange={toggle}>
            <span className="font-semibold text-sm">{s.label}</span>
            {s.bonus && <span className="text-xs ml-1 opacity-60">{s.bonus}</span>}
          </CheckCard>
        ))}
      </div>
      <div className="flex gap-3">
        <SecondaryButton onClick={onBack}>← 戻る</SecondaryButton>
        <PrimaryButton onClick={onNext}>次へ →</PrimaryButton>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Step 3 – プロフィール・希望年収
// ────────────────────────────────────────────────

const AREAS = ["首都圏", "大阪・関西", "名古屋・東海", "福岡・九州", "その他地方"];

function Step3({
  input, onChange, onNext, onBack,
}: { input: SimulatorInput; onChange: (k: keyof SimulatorInput, v: unknown) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">プロフィール</h2>
      <p className="text-slate-400 text-sm mb-6">参考情報として入力してください（入力任意）。</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label>年齢</Label>
          <input
            type="number" min={18} max={70} value={input.age}
            onChange={(e) => onChange("age", Number(e.target.value))}
            className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none border"
            style={{ backgroundColor: "#0A0A0A", borderColor: "#444" }}
          />
        </div>
        <div>
          <Label>性別</Label>
          <input
            type="text" value={input.gender} placeholder="任意"
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none border"
            style={{ backgroundColor: "#0A0A0A", borderColor: "#444" }}
          />
        </div>
      </div>

      <div className="mb-4">
        <Label>国籍</Label>
        <input
          type="text" value={input.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none border"
          style={{ backgroundColor: "#0A0A0A", borderColor: "#444" }}
        />
      </div>

      <div className="mb-4">
        <Label>居住エリア</Label>
        <div className="grid grid-cols-2 gap-2">
          {AREAS.map((a) => (
            <RadioCard key={a} value={a} current={input.area} onChange={(v) => onChange("area", v)}>
              {a}
            </RadioCard>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Label>通勤時間の目安：{input.commuteMinutes}分</Label>
        <input
          type="range" min={0} max={120} step={15}
          value={input.commuteMinutes}
          onChange={(e) => onChange("commuteMinutes", Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0分（リモート）</span><span>60分</span><span>120分</span>
        </div>
      </div>

      <div className="mb-8">
        <Label>希望年収（万円）※任意</Label>
        <input
          type="number" min={0} max={2000} step={50}
          value={input.desiredAnnual || ""}
          placeholder="例: 700"
          onChange={(e) => onChange("desiredAnnual", Number(e.target.value))}
          className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none border"
          style={{ backgroundColor: "#0A0A0A", borderColor: "#444" }}
        />
      </div>

      <div className="flex gap-3">
        <SecondaryButton onClick={onBack}>← 戻る</SecondaryButton>
        <PrimaryButton onClick={onNext}>診断する ✓</PrimaryButton>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Result
// ────────────────────────────────────────────────

function StepResult({ input, onReset }: { input: SimulatorInput; onReset: () => void }) {
  const result = calculateRate(input);
  const posLabel = POSITIONS.find((p) => p.value === input.position)?.label ?? "";
  const tierLabel = COMMERCIAL.find((c) => c.value === input.commercialTier)?.label ?? "";

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">診断結果 🎉</h2>
      <p className="text-slate-400 text-sm mb-6">
        {posLabel}・経験{input.experienceYears}年・{tierLabel} での試算です。
      </p>

      {/* 単価レンジ */}
      <div
        className="rounded-2xl border p-6 mb-6 text-center"
        style={{ backgroundColor: "#0A0A0A", borderColor: ACCENT + "55" }}
      >
        <p className="text-slate-400 text-sm mb-2">推定市場単価（月額）</p>
        <p className="text-5xl font-bold mb-1" style={{ color: ACCENT }}>
          {result.estimatedMin}〜{result.estimatedMax}<span className="text-2xl ml-1">万円</span>
        </p>
        <p className="text-xs text-slate-500 mt-2">※あくまで目安です。案件・スキルシートの書き方で変動します。</p>
      </div>

      {/* 年収換算 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border p-4 text-center" style={{ backgroundColor: FRAME, borderColor: "#333" }}>
          <p className="text-xs text-slate-500 mb-1">年収換算（最小）</p>
          <p className="text-2xl font-bold text-white">{result.estimatedMin * 12}<span className="text-sm ml-1">万円</span></p>
        </div>
        <div className="rounded-xl border p-4 text-center" style={{ backgroundColor: FRAME, borderColor: "#333" }}>
          <p className="text-xs text-slate-500 mb-1">年収換算（最大）</p>
          <p className="text-2xl font-bold text-white">{result.estimatedMax * 12}<span className="text-sm ml-1">万円</span></p>
        </div>
      </div>

      {/* アドバイス */}
      {result.advice.length > 0 && (
        <div className="mb-8">
          <p className="text-white font-semibold mb-3">単価アップへのアドバイス</p>
          <div className="flex flex-col gap-2">
            {result.advice.map((a, i) => (
              <div key={i} className="rounded-xl border p-4 text-sm text-slate-300"
                style={{ backgroundColor: "#0A0A0A", borderColor: "#333" }}>
                💡 {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div
        className="rounded-xl border p-5 mb-6 text-center"
        style={{ backgroundColor: FRAME, borderColor: ACCENT + "44" }}
      >
        <p className="text-sm text-slate-400 mb-1">フリーランスSEの実体験・ノウハウを発信中</p>
        <a
          href="https://note.com/ch_ragga"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold"
          style={{ color: ACCENT }}
        >
          らがSE｜note →
        </a>
      </div>

      <PrimaryButton onClick={onReset}>もう一度診断する</PrimaryButton>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────

export default function Home() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<SimulatorInput>(DEFAULT_INPUT);

  const update = (k: keyof SimulatorInput, v: unknown) =>
    setInput((prev) => ({ ...prev, [k]: v }));

  const reset = () => { setInput(DEFAULT_INPUT); setStep(0); };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0A0A0A" }}>
      <div className="w-full max-w-xl">
        {step === 0 ? (
          <StepIntro onStart={() => setStep(1)} />
        ) : (
          <Card>
            {step < 4 && <StepBar current={step} total={3} />}
            {step === 1 && <Step1 input={input} onChange={update} onNext={() => setStep(2)} />}
            {step === 2 && <Step2 input={input} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <Step3 input={input} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
            {step === 4 && <StepResult input={input} onReset={reset} />}
          </Card>
        )}
      </div>
    </main>
  );
}
