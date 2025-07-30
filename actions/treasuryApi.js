'use server'

/*
Example CPI Entry
  {
    "cusip": "912810SG4",
    "indexType": "CPI",
    "indexDate": "2024-06-30T00:00:00",
    "dailyIndex": "1.2458800000",
    "interestRate": "",
    "accruedInterestPer100": "",
    "dailyAccruedInterestPer100": "",
    "pdfFileName": "CPI_20240515.pdf",
    "refCpi": "313.5074700000",
    "xmlFileName": "CPI_20240515.xml",
    "updateTimeStamp": "2024-05-15 09:03:05.853"
  }
*/
export async function getCpiEntries(cusip) {
    let url = `https://www.treasurydirect.gov/TA_WS/secindex/search?cusip=${cusip}&format=json&filterscount=0&groupscount=0&sortdatafield=indexDate&sortorder=desc`
    let response = await fetch(url)
    let data = await response.json()

    // Handle empty response (invalid CUSIP)
    if (!data || data.length === 0) {
        return { error: `No CPI data found for CUSIP: ${cusip}` }
    }

    return {
        data: data.map((entry) => {
            return {
                uniqueKey: `${entry.cusip}_${entry.indexDate}_${entry.updateTimeStamp}`,
                dailyIndex: entry.dailyIndex,
                indexDate: entry.indexDate,
                updateTimeStamp: entry.updateTimeStamp,
            }
        }),
    }
}

/*
Example Security Detail
{
    "cusip": "91282CJY8",
    "issueDate": "2024-01-31T00:00:00",
    "securityType": "Note",
    "securityTerm": "10-Year",
    "maturityDate": "2034-01-15T00:00:00",
    "interestRate": "1.750000",
    "refCpiOnIssueDate": "307.071000",
    "refCpiOnDatedDate": "307.391000",
    "announcementDate": "2024-01-11T00:00:00",
    "auctionDate": "2024-01-18T00:00:00",
    "auctionDateYear": "2024",
    "datedDate": "2024-01-15T00:00:00",
    "accruedInterestPer1000": "",
    "accruedInterestPer100": "",
    "adjustedAccruedInterestPer1000": "0.7684300000",
    "adjustedPrice": "99.3515420000",
    "allocationPercentage": "53.510000",
    "allocationPercentageDecimals": "2",
    "announcedCusip": "",
    "auctionFormat": "Single-Price",
    "averageMedianDiscountRate": "",
    "averageMedianInvestmentRate": "",
    "averageMedianPrice": "",
    "averageMedianDiscountMargin": "",
    "averageMedianYield": "1.730000",
    "backDated": "Yes",
    "backDatedDate": "2024-01-15T00:00:00",
    "bidToCoverRatio": "2.620000",
    "callDate": "",
    "callable": "No",
    "calledDate": "",
    "cashManagementBillCMB": "No",
    "closingTimeCompetitive": "01:00 PM",
    "closingTimeNoncompetitive": "12:00 PM",
    "competitiveAccepted": "17916778500",
    "competitiveBidDecimals": "3",
    "competitiveTendered": "47131058000",
    "competitiveTendersAccepted": "Yes",
    "corpusCusip": "912821NY7",
    "cpiBaseReferencePeriod": "1982-1984=100",
    "currentlyOutstanding": "",
    "directBidderAccepted": "3132080000",
    "directBidderTendered": "6064000000",
    "estimatedAmountOfPubliclyHeldMaturingSecuritiesByType": "179256000000",
    "fimaIncluded": "Yes",
    "fimaNoncompetitiveAccepted": "0",
    "fimaNoncompetitiveTendered": "0",
    "firstInterestPeriod": "Normal",
    "firstInterestPaymentDate": "2024-07-15T00:00:00",
    "floatingRate": "No",
    "frnIndexDeterminationDate": "",
    "frnIndexDeterminationRate": "",
    "highDiscountRate": "",
    "highInvestmentRate": "",
    "highPrice": "99.351542",
    "highDiscountMargin": "",
    "highYield": "1.8100",
    "indexRatioOnIssueDate": "0.998960",
    "indirectBidderAccepted": "14212023000",
    "indirectBidderTendered": "18004058000",
    "interestPaymentFrequency": "Semi-Annual",
    "lowDiscountRate": "",
    "lowInvestmentRate": "",
    "lowPrice": "",
    "lowDiscountMargin": "",
    "lowYield": "1.690000",
    "maturingDate": "2024-01-31T00:00:00",
    "maximumCompetitiveAward": "6300000000",
    "maximumNoncompetitiveAward": "10000000",
    "maximumSingleBid": "6300000000",
    "minimumBidAmount": "100",
    "minimumStripAmount": "100",
    "minimumToIssue": "100",
    "multiplesToBid": "100",
    "multiplesToIssue": "100",
    "nlpExclusionAmount": "0",
    "nlpReportingThreshold": "6300000000",
    "noncompetitiveAccepted": "83242600",
    "noncompetitiveTendersAccepted": "Yes",
    "offeringAmount": "18000000000",
    "originalCusip": "",
    "originalDatedDate": "",
    "originalIssueDate": "",
    "originalSecurityTerm": "10-Year",
    "pdfFilenameAnnouncement": "A_20240111_3.pdf",
    "pdfFilenameCompetitiveResults": "R_20240118_3.pdf",
    "pdfFilenameNoncompetitiveResults": "NCR_20240118_3.pdf",
    "pdfFilenameSpecialAnnouncement": "",
    "pricePer100": "99.351542",
    "primaryDealerAccepted": "572675500",
    "primaryDealerTendered": "23063000000",
    "reopening": "No",
    "securityTermDayMonth": "0-Month",
    "securityTermWeekYear": "10-Year",
    "series": "A-2034",
    "somaAccepted": "0",
    "somaHoldings": "27478000000",
    "somaIncluded": "No",
    "somaTendered": "0",
    "spread": "",
    "standardInterestPaymentPer1000": "",
    "strippable": "Yes",
    "term": "10-Year",
    "tiinConversionFactorPer1000": "2.8465374720",
    "tips": "Yes",
    "totalAccepted": "18000021100",
    "totalTendered": "47214300600",
    "treasuryRetailAccepted": "13586600",
    "treasuryRetailTendersAccepted": "Yes",
    "type": "TIPS",
    "unadjustedAccruedInterestPer1000": "0.769230",
    "unadjustedPrice": "99.454975",
    "updatedTimestamp": "2024-01-18T13:04:03",
    "xmlFilenameAnnouncement": "A_20240111_3.xml",
    "xmlFilenameCompetitiveResults": "R_20240118_3.xml",
    "xmlFilenameSpecialAnnouncement": "",
    "tintCusip1": "912834K31",
    "tintCusip2": ""
  }
*/
export async function getSecurityDetails(cusip) {
    let url = `https://www.treasurydirect.gov/TA_WS/securities/search?format=json&type=TIPS&cusip=${cusip}`
    let response = await fetch(url)
    let data = await response.json()

    // Handle empty response (invalid CUSIP)
    if (!data || data.length === 0) {
        return { error: `No security details found for CUSIP: ${cusip}` }
    }

    return { data: data.pop() } // take the last item in the list, re-issues are further up
}
