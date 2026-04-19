// SE単価シミュレータ 計算ロジック

export type Position =
  | "maintenance"    // 保守・運用
  | "testing"        // テスト
  | "pg"             // 開発（PG）
  | "version_doc"    // バージョンアップ・ドキュメント
  | "se"             // 開発（SE）
  | "infra"          // インフラ設計・構築
  | "basic_design"   // 基本設計・DB設計
  | "pm"             // PM・プロジェクト管理
  | "mobile";        // スマホアプリ開発

export type Skill =
  | "java_spring"    // Java / SpringBoot
  | "react"          // React
  | "golang"         // Go言語
  | "swift_ios"      // Swift / iOS
  | "offshore"       // オフショア管理
  | "none";          // なし

export type CommercialTier = "direct" | "second" | "third_or_more";

export interface SimulatorInput {
  position: Position;
  skills: Skill[];
  experienceYears: number;
  commercialTier: CommercialTier;
  age: number;
  gender: string;
  nationality: string;
  area: string;
  commuteMinutes: number;
  desiredAnnual: number;
}

export interface SimulatorResult {
  estimatedMin: number;
  estimatedMax: number;
  advice: string[];
}

// 工程別 基準単価（万円/月）
const BASE_RATE: Record<Position, number> = {
  maintenance:  40,
  testing:      55,
  pg:           55,
  version_doc:  65,
  se:           70,
  infra:        70,
  basic_design: 75,
  pm:           85,
  mobile:       90,
};

// スキル加算（万円）
const SKILL_BONUS: Record<Skill, number> = {
  java_spring: 3,
  react:       5,
  golang:      5,
  swift_ios:  10,
  offshore:    5,
  none:        0,
};

// 経験年数倍率
function experienceMultiplier(years: number): number {
  if (years <= 2)  return 0.85;
  if (years <= 5)  return 1.0;
  if (years <= 10) return 1.1;
  return 1.2;
}

// 商流倍率
const COMMERCIAL_MULTIPLIER: Record<CommercialTier, number> = {
  direct:         1.15,
  second:         1.0,
  third_or_more:  0.85,
};

export function calculateRate(input: SimulatorInput): SimulatorResult {
  const base = BASE_RATE[input.position];

  // スキル加算
  const skillBonus = input.skills.reduce((sum, s) => sum + SKILL_BONUS[s], 0);

  // 経験年数・商流で補正
  const expMul  = experienceMultiplier(input.experienceYears);
  const comMul  = COMMERCIAL_MULTIPLIER[input.commercialTier];

  const raw = (base + skillBonus) * expMul * comMul;

  // ±5万の幅で min/max
  const estimatedMin = Math.round(raw - 5);
  const estimatedMax = Math.round(raw + 5);

  // アドバイス生成
  const advice: string[] = [];

  if (input.commercialTier === "third_or_more") {
    advice.push("商流を1〜2段階上げるだけで月5〜10万円アップの可能性があります。");
  }
  if (input.experienceYears < 3) {
    advice.push("経験3年を超えると単価が上がりやすくなります。スキルシートに実績を積み上げましょう。");
  }
  if (!input.skills.includes("react") && !input.skills.includes("golang") && !input.skills.includes("swift_ios")) {
    advice.push("React・Go・Swiftなど市場需要の高いスキルを習得すると単価が大きく上昇します。");
  }
  if (input.position === "maintenance" || input.position === "testing") {
    advice.push("上流工程（基本設計・インフラ構築）へのステップアップで単価20〜30万円アップが狙えます。");
  }
  if (input.desiredAnnual > 0) {
    const desiredMonthly = Math.round(input.desiredAnnual / 12);
    if (desiredMonthly > estimatedMax) {
      const gap = desiredMonthly - estimatedMax;
      advice.push(`希望年収から逆算すると月${desiredMonthly}万円が必要です。現状との差は約${gap}万円。スキルアップか上流工程への移行が近道です。`);
    } else {
      advice.push(`希望年収${input.desiredAnnual}万円は現在のスキルセットで十分に狙える水準です。`);
    }
  }

  return { estimatedMin, estimatedMax, advice };
}
