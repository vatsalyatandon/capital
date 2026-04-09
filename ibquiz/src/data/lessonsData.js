import accounting from './lessons/accounting.json'
import dcf from './lessons/dcf.json'
import valuation from './lessons/valuation.json'
import enterpriseEquityValue from './lessons/enterprise_equity_value.json'
import mergerModel from './lessons/merger_model.json'
import creditAnalysis from './lessons/credit_analysis.json'
import lboModel from './lessons/lbo_model.json'
import restructuring from './lessons/restructuring.json'
import privateEquity from './lessons/private_equity.json'
import capitalMarkets from './lessons/capital_markets.json'
import brainTeasers from './lessons/brain_teasers.json'

// Keys match subcategory field in questions.json exactly
const LESSONS_DATA = {
  'Accounting':                     accounting,
  'DCF':                            dcf,
  'Valuation':                      valuation,
  'Enterprise / Equity Value':      enterpriseEquityValue,
  'Merger Model':                   mergerModel,
  'Credit Analysis':                creditAnalysis,
  'LBO Model':                      lboModel,
  'Restructuring / Distressed M&A': restructuring,
  'Private Equity':                 privateEquity,
  'Capital Markets':                capitalMarkets,
  'Brain Teasers':                  brainTeasers,
}

export default LESSONS_DATA
