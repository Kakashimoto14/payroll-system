// ============================================================================
// Withholding Tax Service — TRAIN Law (RA 10963)
// Philippine-Specific Business Logic
//
// Monthly Withholding Tax Table (Effective 2023-2026):
// ≤₱20,833          : 0% (tax-exempt)
// ₱20,833-₱33,333   : 0 + 15% of excess over ₱20,833
// ₱33,333-₱66,667   : ₱1,875 + 20% of excess over ₱33,333
// ₱66,667-₱166,667  : ₱8,541.80 + 25% of excess over ₱66,667
// ₱166,667-₱666,667 : ₱33,541.80 + 30% of excess over ₱166,667
// ≥₱666,667         : ₱183,541.80 + 35% of excess over ₱666,667
// ============================================================================

import { Injectable } from '@nestjs/common';

/**
 * TRAIN Law tax bracket definition.
 */
interface TaxBracket {
  min: number;
  max: number;
  fixedTax: number;
  rate: number;
  excessOver: number;
}

@Injectable()
export class WithholdingTaxService {
  // ========================================================================
  // TRAIN Law Monthly Withholding Tax Brackets (2023-2026)
  // These are the official BIR brackets for monthly compensation.
  // ========================================================================
  private readonly TAX_BRACKETS: TaxBracket[] = [
    {
      min: 0,
      max: 20833,
      fixedTax: 0,
      rate: 0,
      excessOver: 0,
    },
    {
      min: 20833.01,
      max: 33333,
      fixedTax: 0,
      rate: 0.15,
      excessOver: 20833,
    },
    {
      min: 33333.01,
      max: 66667,
      fixedTax: 1875.0,
      rate: 0.20,
      excessOver: 33333,
    },
    {
      min: 66667.01,
      max: 166667,
      fixedTax: 8541.80,
      rate: 0.25,
      excessOver: 66667,
    },
    {
      min: 166667.01,
      max: 666667,
      fixedTax: 33541.80,
      rate: 0.30,
      excessOver: 166667,
    },
    {
      min: 666667.01,
      max: Infinity,
      fixedTax: 183541.80,
      rate: 0.35,
      excessOver: 666667,
    },
  ];

  /**
   * Calculate monthly withholding tax based on TRAIN Law.
   *
   * @param monthlyTaxableIncome - Gross pay minus mandatory contributions
   *        (SSS + PhilHealth + Pag-IBIG). This is the taxable base.
   * @returns The monthly withholding tax amount
   *
   * Computation steps:
   * 1. Determine which bracket the taxable income falls into
   * 2. Apply: fixedTax + (rate × (taxableIncome - excessOver))
   */
  calculate(monthlyTaxableIncome: number): number {
    if (monthlyTaxableIncome <= 0) return 0;

    // Find the applicable tax bracket
    const bracket = this.TAX_BRACKETS.find(
      (b) =>
        monthlyTaxableIncome >= b.min && monthlyTaxableIncome <= b.max,
    );

    if (!bracket) {
      // Should not happen, but fallback to highest bracket
      const lastBracket = this.TAX_BRACKETS[this.TAX_BRACKETS.length - 1];
      const excess = monthlyTaxableIncome - lastBracket.excessOver;
      return Math.round(
        (lastBracket.fixedTax + lastBracket.rate * excess) * 100,
      ) / 100;
    }

    // Tax-exempt bracket
    if (bracket.rate === 0) return 0;

    // Calculate: fixedTax + (rate × excess over bracket minimum)
    const excess = monthlyTaxableIncome - bracket.excessOver;
    const tax = bracket.fixedTax + bracket.rate * excess;

    return Math.round(tax * 100) / 100;
  }
}
