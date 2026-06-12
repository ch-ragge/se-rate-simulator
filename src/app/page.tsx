"use client";

import { useEffect, useRef, useState } from "react";
import {
  calculateRate,
  type Position,
  type Skill,
  type CommercialTier,
  type SimulatorInput,
} from "@/lib/calculateRate";
import GlassHeader from "@/components/GlassHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

// ────────────────────────────────────────────────
// Primitive UI
// ────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-accent/40 text-accent">
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-surface p-6 sm:p-10 ${className}`}>{children}</div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-ink font-semibold mb-3">{children}</p>;
}

function RadioCard<T extends string>({
  value, current, onChange, children,
}: { value: T; current: T; onChange: (v: T) => void; children: React.ReactNode }) {
  const selected = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      aria-pressed={selected}
      className={`rounded-2xl border p-3 text-left transition-colors w-full ${
        selected
          ? "border-accent bg-accent/5 text-ink"
          : "border-black/10 bg-white text-subtle hover:border-black/25"
      }`}
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
      aria-pressed={checked}
      className={`rounded-2xl border p-3 text-left transition-colors ${
        checked
          ? "border-accent bg-accent/5 text-ink"
          : "border-black/10 bg-white text-subtle hover:border-black/25"
      }`}
    >
      <span className={`mr-2 ${checked ? "text-accent" : ""}`}>{checked ? "✓" : "○"}</span>
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
      className={`px-8 py-3 rounded-full font-semibold transition-colors ${
        disabled
          ? "bg-black/10 text-subtle cursor-not-allowed"
          : "bg-accent text-night hover:brightness-105 cursor-pointer"
      }`}
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
      className="px-6 py-3 rounded-full font-semibold border border-black/15 text-ink transition-colors hover:bg-black/5"
    >
      {children}
    </button>
  );
}

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < current ? "bg-accent" : "bg-black/10"
          }`}
        />
      ))}
      <span className="text-xs ml-2 text-accent">{current}/{total}</span>
    </div>
  );
}

// ────────────────────────────────────────────────
// CountUp（シグネチャ要素：結果数字のカウントアップ）
// ────────────────────────────────────────────────

function CountUp({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(Math.round(value * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{display}</>;
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
      <div className="mb-8 hero-item-1"><Badge>SE Rate Simulator</Badge></div>
      <h1 className="hero-title text-ink mb-6 hero-item-1">
        単価を、
        <br />
        <span className="text-accent">根拠に。</span>
      </h1>
      <p className="text-subtle max-w-lg mb-12 hero-item-2">
        スキルシートの情報を入力するだけで、フリーランスSEとしての
        市場単価の目安が30秒でわかります。<br />
        元自衛隊×フリーランスSE13年のリアルな相場感をもとに算出。
      </p>
      <div className="hero-item-3 flex flex-col items-center w-full">
        <div className="grid grid-cols-3 gap-4 mb-12 w-full max-w-md">
          {[
            { icon: "💹", label: "市場単価を即算出" },
            { icon: "⚡", label: "30秒で完成" },
            { icon: "📋", label: "単価アップのアドバイス付き" },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl p-4 text-center bg-surface">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-xs text-subtle">{f.label}</div>
            </div>
          ))}
        </div>
        <PrimaryButton onClick={onStart}>今すぐ診断する →</PrimaryButton>
        <p className="mt-6 text-xs text-subtle">データ送信なし・完全ブラウザ完結・無料</p>
      </div>
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
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">工程・経験・商流</h2>
      <p className="text-subtle text-sm mb-6">現在メインで担当している工程を選んでください。</p>

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
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-xs text-subtle mt-1">
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
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">スキル・技術</h2>
      <p className="text-subtle text-sm mb-6">経験のあるスキルをすべて選んでください（複数可）。</p>
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
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">プロフィール</h2>
      <p className="text-subtle text-sm mb-6">参考情報として入力してください（入力任意）。</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label>年齢</Label>
          <input
            type="number" min={18} max={70} value={input.age}
            onChange={(e) => onChange("age", Number(e.target.value))}
            className="w-full rounded-2xl px-4 py-3 text-ink text-sm bg-white border border-black/15 transition-colors focus:border-accent"
          />
        </div>
        <div>
          <Label>性別</Label>
          <input
            type="text" value={input.gender} placeholder="任意"
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full rounded-2xl px-4 py-3 text-ink text-sm bg-white border border-black/15 transition-colors focus:border-accent"
          />
        </div>
      </div>

      <div className="mb-4">
        <Label>国籍</Label>
        <input
          type="text" value={input.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
          className="w-full rounded-2xl px-4 py-3 text-ink text-sm bg-white border border-black/15 transition-colors focus:border-accent"
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
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-xs text-subtle mt-1">
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
          className="w-full rounded-2xl px-4 py-3 text-ink text-sm bg-white border border-black/15 transition-colors focus:border-accent"
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
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">診断結果 🎉</h2>
      <p className="text-subtle text-sm mb-6">
        {posLabel}・経験{input.experienceYears}年・{tierLabel} での試算です。
      </p>

      {/* 単価レンジ（シグネチャ要素：カウントアップ巨大表示） */}
      <div className="rounded-3xl bg-white p-8 mb-6 text-center">
        <p className="text-subtle text-sm mb-3">推定市場単価（月額）</p>
        <p
          className="font-bold tracking-tight text-ink leading-none mb-2"
          style={{ fontSize: "clamp(3rem, 9vw, 5.5rem)" }}
        >
          <CountUp value={result.estimatedMin} />
          <span className="text-subtle mx-1" style={{ fontSize: "0.4em" }}>〜</span>
          <CountUp value={result.estimatedMax} />
          <span className="ml-2 text-accent" style={{ fontSize: "0.35em" }}>万円</span>
        </p>
        <p className="text-xs text-subtle mt-3">※あくまで目安です。案件・スキルシートの書き方で変動します。</p>
      </div>

      {/* 年収換算 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl bg-white p-4 text-center">
          <p className="text-xs text-subtle mb-1">年収換算（最小）</p>
          <p className="text-2xl font-bold text-ink">
            <CountUp value={result.estimatedMin * 12} /><span className="text-sm ml-1">万円</span>
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center">
          <p className="text-xs text-subtle mb-1">年収換算（最大）</p>
          <p className="text-2xl font-bold text-ink">
            <CountUp value={result.estimatedMax * 12} /><span className="text-sm ml-1">万円</span>
          </p>
        </div>
      </div>

      {/* アドバイス */}
      {result.advice.length > 0 && (
        <div className="mb-8">
          <p className="text-ink font-semibold mb-3">単価アップへのアドバイス</p>
          <div className="flex flex-col gap-2">
            {result.advice.map((a, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 text-sm text-ink/90">
                💡 {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-2xl bg-white p-5 mb-6 text-center">
        <p className="text-sm text-subtle mb-1">フリーランスSEの実体験・ノウハウを発信中</p>
        <a
          href="https://note.com/ch_ragga"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-accent hover:opacity-80"
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
    <>
    <GlassHeader current="rate" />
    <main className="min-h-screen flex flex-col items-center justify-center bg-base px-4 pt-32 pb-24 sm:pt-36 sm:pb-32">
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

    {/* ===== 解説記事セクション（ビルド時HTMLに出力される） ===== */}
    <section className="bg-surface px-6 py-24 sm:py-32">
      <Reveal>
      <article className="max-w-2xl mx-auto text-ink leading-relaxed [&>p]:max-w-[65ch]">
        <h2 className="text-3xl font-bold text-ink mb-6 tracking-tight">
          フリーランスSEの単価はどう決まるのか
        </h2>

        <p className="mb-8">
          上のシミュレーターは、担当工程・経験年数・商流・スキルから市場単価の目安を試算します。
          ここでは、その裏側にある「フリーランスSEの単価が決まる仕組み」と、単価を上げるために実際にできることを解説します。
        </p>

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">このツールでわかること</h3>
        <p className="mb-4">
          このシミュレーターでは、月額単価の目安レンジと年収換算、そして単価アップのためのアドバイスが表示されます。
          単価は「担当工程 × 経験年数 × 商流（何次請けか） × スキル」の掛け算でおおまかに決まります。
          数字はあくまで目安で、実際の案件やスキルシートの書き方によって上下します。
        </p>

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">SEフリーランス単価の決まり方</h3>
        <p className="mb-4">
          フリーランスSEの単価を左右する要素は、大きく次の4つです。
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><span className="text-ink font-semibold">担当工程</span>：保守・運用より、設計・構築・PMといった上流ほど単価が上がる傾向があります。</li>
          <li><span className="text-ink font-semibold">経験年数</span>：同じ工程でも、実績年数が増えるほど提示単価は上がりやすくなります。</li>
          <li><span className="text-ink font-semibold">商流</span>：エンド直（直請け）に近いほど中間マージンが減り、手取りが増えます。</li>
          <li><span className="text-ink font-semibold">スキル</span>：希少性の高い技術や、需要に対して人が足りない領域は単価が乗りやすいです。</li>
        </ul>
        {/* TODO:本人記入 ── 自分が単価を上げられた／頭打ちになった具体的な要因を、実数（◯◯万→◯◯万）を交えて書く。最低250字。書き下ろし・noteコピペ禁止 */}

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">客先常駐／受託／自社開発の単価差</h3>
        <p className="mb-4">
          働き方によっても単価の出方は変わります。客先常駐（SES）は月額単価が明確で安定しやすい一方、商流が深くなると手取りが下がりがちです。
          受託開発は成果物単位で、見積もり力次第で単価が大きく変わります。自社開発・プロダクト寄りの関わり方では、
          単価そのものよりも継続性や裁量が評価軸になることもあります。
        </p>
        {/* TODO:本人記入 ── 自分が経験した働き方（常駐／受託など）ごとの単価のリアルな違いを書く。最低200字。書き下ろし */}

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">インフラ経験者の単価レンジ</h3>
        <p className="mb-4">
          サーバー設計・構築や移行設計といったインフラ領域は、上流工程と相性がよく、設計・構築を主導できる人材は単価が乗りやすい傾向があります。
          特定製品（OS・ミドルウェア・ジョブ管理など）の実務経験は、案件によっては強い差別化要因になります。
        </p>
        {/* TODO:本人記入 ── インフラ経験者として実際に提示された単価レンジ・評価された経験を、具体的に書く。最低200字。書き下ろし */}

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">単価を上げる具体策</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>スキルシートで「担当範囲」と「成果」を具体的な数字で書く</li>
          <li>商流の浅い案件（エンド直に近いエージェント）を選ぶ</li>
          <li>需要の高いスキルを1つ、実務で言える状態にする</li>
          <li>運用・保守の経験を「設計に活かせる視点」として言語化する</li>
        </ul>
        {/* TODO:本人記入 ── 上記のうち自分が実際にやって効果があった施策を、ビフォーアフターで書く。最低300字。書き下ろし */}

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">まとめ</h3>
        <p className="mb-4">
          単価は「工程・経験・商流・スキル」の組み合わせで決まります。
          まずは上のシミュレーターで現在地の目安を把握し、どの軸を伸ばせば単価が上がるかを考えるきっかけにしてください。
        </p>

        <p className="mt-10 text-sm text-subtle">
          関連記事：
          <a
            href="https://ch-ragge.github.io/blog/posts/freelance-se-rate-negotiation/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-accent hover:opacity-80"
          >
            フリーランスSEの単価交渉、実際にやった3つのステップ
          </a>
        </p>
      </article>
      </Reveal>
    </section>
    <SiteFooter />
    </>
  );
}
