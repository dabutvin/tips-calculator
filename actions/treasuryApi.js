'use server'

export async function getCpiEntries(cusip) {
    let url = `https://www.treasurydirect.gov/TA_WS/secindex/search?cusip=${cusip}&format=json&filterscount=0&groupscount=0&sortdatafield=indexDate&sortorder=desc`
    let response = await fetch(url)
    let data = await response.json()

    return data.map((entry) => {
        return {
            uniqueKey: `${entry.cusip}_${entry.indexDate}_${entry.updateTimeStamp}`,
            dailyIndex: entry.dailyIndex,
            indexDate: entry.indexDate,
            updateTimeStamp: entry.updateTimeStamp,
        }
    })
}
