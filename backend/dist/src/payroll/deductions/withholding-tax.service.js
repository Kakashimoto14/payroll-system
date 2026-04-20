"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithholdingTaxService = void 0;
const common_1 = require("@nestjs/common");
let WithholdingTaxService = class WithholdingTaxService {
    TAX_BRACKETS = [
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
    calculate(monthlyTaxableIncome) {
        if (monthlyTaxableIncome <= 0)
            return 0;
        const bracket = this.TAX_BRACKETS.find((b) => monthlyTaxableIncome >= b.min && monthlyTaxableIncome <= b.max);
        if (!bracket) {
            const lastBracket = this.TAX_BRACKETS[this.TAX_BRACKETS.length - 1];
            const excess = monthlyTaxableIncome - lastBracket.excessOver;
            return Math.round((lastBracket.fixedTax + lastBracket.rate * excess) * 100) / 100;
        }
        if (bracket.rate === 0)
            return 0;
        const excess = monthlyTaxableIncome - bracket.excessOver;
        const tax = bracket.fixedTax + bracket.rate * excess;
        return Math.round(tax * 100) / 100;
    }
};
exports.WithholdingTaxService = WithholdingTaxService;
exports.WithholdingTaxService = WithholdingTaxService = __decorate([
    (0, common_1.Injectable)()
], WithholdingTaxService);
//# sourceMappingURL=withholding-tax.service.js.map