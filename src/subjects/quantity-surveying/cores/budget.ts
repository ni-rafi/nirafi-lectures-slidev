const BASE_COSTS = [250000, 1200000, 950000, 800000, 400000, 600000];
const MILESTONE_NAMES = [
  'Earthwork & BFS',
  'Concrete Frame',
  'Reinforcement BBS',
  'Brickwork & Finish',
  'MEP & Plumbing',
  'Culvert Infrastructure',
];

export interface MilestoneProgressDetail {
  id: number;
  name: string;
  baseCost: number;
  previousProgress: number;
  currentProgress: number;
  previousValue: number;
  currentValue: number;
  netValue: number;
}

export interface IPCBillResult {
  milestones: MilestoneProgressDetail[];
  totalBaseCost: number;
  totalPreviousValue: number;
  totalCurrentValue: number;
  totalNetValue: number;
  contingencyAmount: number;
  profitAmount: number;
  grossCurrentClaim: number;
  retentionDeduction: number;
  mobilizationRecovery: number;
  vatDeduction: number;
  aitDeduction: number;
  netPayableCheck: number;
}

const round3 = (val: number): number => Math.round(val * 1000) / 1000;

/**
 * Calculates sessional progress values, markups, and statutory deductions for the IPC bill.
 */
export function calculateIPCBill(
  currentProgress: number[], // 0-100 values
  previousProgress: number[], // 0-100 values
  contingencyRate: number = 0.03, // standard 3%
  profitRate: number = 0.10, // standard 10%
  retentionRate: number = 0.10, // standard 10%
  mobilizationRecoveryRate: number = 0.15, // standard 15%
  vatRate: number = 0.075, // standard 7.5%
  aitRate: number = 0.05, // standard 5.0%
  mosCredit: number = 0
): IPCBillResult {
  const milestones: MilestoneProgressDetail[] = [];
  let totalBaseCost = 0;
  let totalPreviousValue = 0;
  let totalCurrentValue = 0;
  let totalNetValue = 0;

  for (let i = 0; i < BASE_COSTS.length; i++) {
    const baseCost = BASE_COSTS[i] || 0;
    const prevProg = Math.max(0, Math.min(100, previousProgress[i] ?? 0));
    const currProg = Math.max(prevProg, Math.min(100, currentProgress[i] ?? 0));

    const previousValue = round3((baseCost * prevProg) / 100);
    const currentValue = round3((baseCost * currProg) / 100);
    const netValue = round3(currentValue - previousValue);

    totalBaseCost += baseCost;
    totalPreviousValue += previousValue;
    totalCurrentValue += currentValue;
    totalNetValue += netValue;

    milestones.push({
      id: i + 1,
      name: MILESTONE_NAMES[i] || '',
      baseCost,
      previousProgress: prevProg,
      currentProgress: currProg,
      previousValue,
      currentValue,
      netValue,
    });
  }

  // Loadings on Net direct cost
  const contingencyAmount = round3(totalNetValue * contingencyRate);
  const profitAmount = round3(totalNetValue * profitRate);
  const grossCurrentClaim = round3(totalNetValue + contingencyAmount + profitAmount);

  // Billing Deductions
  const retentionDeduction = round3(grossCurrentClaim * retentionRate);
  const mobilizationRecovery = round3(grossCurrentClaim * mobilizationRecoveryRate);
  const vatDeduction = round3(grossCurrentClaim * vatRate);
  const aitDeduction = round3(grossCurrentClaim * aitRate);

  // Net payable check value
  const netPayableCheck = round3(
    grossCurrentClaim -
      retentionDeduction -
      mobilizationRecovery -
      vatDeduction -
      aitDeduction +
      mosCredit
  );

  return {
    milestones,
    totalBaseCost,
    totalPreviousValue: round3(totalPreviousValue),
    totalCurrentValue: round3(totalCurrentValue),
    totalNetValue: round3(totalNetValue),
    contingencyAmount,
    profitAmount,
    grossCurrentClaim,
    retentionDeduction,
    mobilizationRecovery,
    vatDeduction,
    aitDeduction,
    netPayableCheck,
  };
}

export interface SteelCostResult {
  materialCost: number;
  erectionMarkupCost: number;
  totalCost: number;
}

/**
 * Calculates raw steel material cost and erection markup cost.
 * totalWeightKg: total weight in kg (or lb, unit agnostic).
 * baseRatePerKg: unit rate of the steel grade.
 * erectionMarkupPercent: erection/welding cost markup (default 10%).
 */
export function calculateSteelCostWithMarkupInternal(
  totalWeightKg: number,
  baseRatePerKg: number,
  erectionMarkupPercent: number = 10
): SteelCostResult {
  const weight = Math.max(0, totalWeightKg);
  const rate = Math.max(0, baseRatePerKg);
  const markupPercent = Math.max(0, erectionMarkupPercent);

  const materialCost = weight * rate;
  const erectionMarkupCost = materialCost * (markupPercent / 100);
  const totalCost = materialCost + erectionMarkupCost;

  return {
    materialCost: round3(materialCost),
    erectionMarkupCost: round3(erectionMarkupCost),
    totalCost: round3(totalCost),
  };
}

/**
 * Calculates preliminary plumbing budget based on a percentage of the structural civil cost.
 * civilCost: base structural cost.
 * ratePercent: plumbing/sanitary budget multiplier (default 8%).
 */
export function calculatePlumbingBudgetInternal(
  civilCost: number,
  ratePercent: number = 8.0
): number {
  const baseCost = Math.max(0, civilCost);
  const percent = Math.max(0, ratePercent);
  return round3(baseCost * (percent / 100));
}


