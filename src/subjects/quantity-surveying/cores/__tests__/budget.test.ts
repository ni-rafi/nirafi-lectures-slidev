import { describe, test, expect } from 'vitest';
import { calculateIPCBill, calculateSteelCostWithMarkupInternal, calculatePlumbingBudgetInternal } from '../budget';

describe('Project Budgeting & IPC Core Calculations', () => {
  test('should calculate correct values with zero progress', () => {
    const res = calculateIPCBill(
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      0.03,
      0.10,
      0.10,
      0.15,
      0.075,
      0.05,
      0
    );

    expect(res.totalBaseCost).toBe(4200000); // 250k + 1.2M + 950k + 800k + 400k + 600k
    expect(res.totalPreviousValue).toBe(0);
    expect(res.totalCurrentValue).toBe(0);
    expect(res.totalNetValue).toBe(0);
    expect(res.grossCurrentClaim).toBe(0);
    expect(res.netPayableCheck).toBe(0);
  });

  test('should calculate correct values with progress increments and NBR source deductions', () => {
    // Let's say we have current progress = 50% for all milestones, previous progress = 0%
    const res = calculateIPCBill(
      [50, 50, 50, 50, 50, 50],
      [0, 0, 0, 0, 0, 0],
      0.03, // 3% contingency
      0.10, // 10% contractor profit
      0.10, // 10% retention
      0.15, // 15% mobilization recovery
      0.075, // 7.5% VAT
      0.05, // 5% AIT
      50000 // 50,000 BDT Material-on-Site credit
    );

    // Total net value (direct cost) = 50% of 4.2M BDT = 2,100,000 BDT
    expect(res.totalNetValue).toBe(2100000);

    // Contingency = 2,100,000 * 0.03 = 63,000 BDT
    expect(res.contingencyAmount).toBe(63000);

    // Contractor Profit = 2,100,000 * 0.10 = 210,000 BDT
    expect(res.profitAmount).toBe(210000);

    // Gross Current Claim = 2,100,000 + 63,000 + 210,000 = 2,373,000 BDT
    expect(res.grossCurrentClaim).toBe(2373000);

    // Retention = 2,373,000 * 0.10 = 237,300 BDT
    expect(res.retentionDeduction).toBe(237300);

    // Mobilization Recovery = 2,373,000 * 0.15 = 355,950 BDT
    expect(res.mobilizationRecovery).toBe(355950);

    // VAT = 2,373,000 * 0.075 = 177,975 BDT
    expect(res.vatDeduction).toBe(177975);

    // AIT = 2,373,000 * 0.05 = 118,650 BDT
    expect(res.aitDeduction).toBe(118650);

    // Net check = 2,373,000 - 237,300 - 355,950 - 177,975 - 118,650 + 50,000 = 1,533,125 BDT
    expect(res.netPayableCheck).toBe(1533125);
  });

  test('should compute correct net period progress values from previous certified levels', () => {
    // Current progress = 80%, previous = 50%
    const res = calculateIPCBill(
      [80, 80, 80, 80, 80, 80],
      [50, 50, 50, 50, 50, 50],
      0, // 0% contingency
      0, // 0% profit
      0,
      0,
      0,
      0,
      0
    );

    // Net value = 30% of 4,200,000 BDT = 1,260,000 BDT
    expect(res.totalNetValue).toBe(1260000);
    expect(res.netPayableCheck).toBe(1260000);
  });
});

describe('Steel Cost with Markup Calculations', () => {
  test('should calculate correct material and markup costs', () => {
    // Weight = 1000 kg, Base rate = 120 BDT/kg, markup = 10%
    // Material cost = 1000 * 120 = 120,000 BDT
    // Markup cost = 120,000 * 0.1 = 12,000 BDT
    // Total cost = 132,000 BDT
    const result = calculateSteelCostWithMarkupInternal(1000, 120, 10);
    expect(result.materialCost).toBe(120000);
    expect(result.erectionMarkupCost).toBe(12000);
    expect(result.totalCost).toBe(132000);
  });

  test('should default to 10% markup if not provided', () => {
    const result = calculateSteelCostWithMarkupInternal(2000, 100);
    expect(result.materialCost).toBe(200000);
    expect(result.erectionMarkupCost).toBe(20000);
    expect(result.totalCost).toBe(220000);
  });

  test('should return 0 for negative inputs', () => {
    const result = calculateSteelCostWithMarkupInternal(-1000, 120, 10);
    expect(result.materialCost).toBe(0);
    expect(result.erectionMarkupCost).toBe(0);
    expect(result.totalCost).toBe(0);
  });
});

describe('Plumbing Preliminary Budget Calculations', () => {
  test('should calculate correct plumbing budget based on structural civil cost', () => {
    // Civil Cost = 1,000,000 BDT, default rate = 8%
    // Plumbing budget = 1,000,000 * 0.08 = 80,000 BDT
    const result = calculatePlumbingBudgetInternal(1000000);
    expect(result).toBe(80000);
  });

  test('should support custom percentage rates', () => {
    // Civil Cost = 1,000,000 BDT, custom rate = 7.5%
    // Plumbing budget = 1,000,000 * 0.075 = 75,000 BDT
    const result = calculatePlumbingBudgetInternal(1000000, 7.5);
    expect(result).toBe(75000);
  });

  test('should return 0 for negative or zero inputs', () => {
    expect(calculatePlumbingBudgetInternal(-500000)).toBe(0);
    expect(calculatePlumbingBudgetInternal(1000000, -2.5)).toBe(0);
    expect(calculatePlumbingBudgetInternal(0)).toBe(0);
  });
});
