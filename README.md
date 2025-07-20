# TIPS (Treasury Inflation-Protected Securities) Calculator

A Next.js application for looking up TIPS information and calculating adjusted principal values using Treasury Direct APIs.

## Background

This application helps investors calculate the current value of their TIPS investments by fetching real-time data from Treasury Direct APIs. TIPS are inflation-protected securities that adjust their principal value based on changes in the Consumer Price Index (CPI).

## How TIPS Work

TIPS have two key components:

1. **Original Principal**: The face value of the security
2. **Index Ratio**: A multiplier that adjusts the principal based on inflation

The **Adjusted Principal** = Original Principal × Index Ratio

Interest payments are calculated on the adjusted principal, not the original principal.

## Treasury Direct APIs

This application uses two main Treasury Direct APIs:

### 1. CPI Index Data API

**Endpoint**: `https://www.treasurydirect.gov/TA_WS/secindex/search`

**Purpose**: Retrieves the current Index Ratio for a TIPS security

**Parameters**:

-   `cusip`: The CUSIP identifier for the TIPS
-   `format=json`: Returns JSON response
-   `sortdatafield=indexDate`: Sort by date
-   `sortorder=desc`: Most recent first

**Example Request**:

```
https://www.treasurydirect.gov/TA_WS/secindex/search?cusip=912810SG4&format=json&filterscount=0&groupscount=0&sortdatafield=indexDate&sortorder=desc
```

**Key Response Fields**:

-   `dailyIndex`: The Index Ratio (multiplier for principal)
-   `indexDate`: Date of the index value
-   `indexType`: Should be "CPI"

### 2. Security Details API

**Endpoint**: `https://www.treasurydirect.gov/TA_WS/securities/search`

**Purpose**: Retrieves security information including interest rate and maturity date

**Parameters**:

-   `cusip`: The CUSIP identifier
-   `type=TIPS`: Filter for TIPS securities only
-   `format=json`: Returns JSON response

**Example Request**:

```
https://www.treasurydirect.gov/TA_WS/securities/search?format=json&type=TIPS&cusip=912810SG4
```

**Key Response Fields**:

-   `interestRate`: Annual interest rate (as a percentage)
-   `maturityDate`: When the security matures
-   `issueDate`: When the security was issued
-   `securityTerm`: Term length (e.g., "10-Year")

## Calculation Example

Let's walk through a practical example:

**Scenario**: You have $1,000 invested in a 5-year TIPS with an interest rate of 0.125%. You want to calculate your next interest payment.

### Step 1: Get the Index Ratio

Using the CPI Index Data API for CUSIP `912810SG4`:

-   Current Index Ratio: 1.01165

### Step 2: Calculate Adjusted Principal

```
Adjusted Principal = Original Principal × Index Ratio
Adjusted Principal = $1,000 × 1.01165 = $1,011.65
```

### Step 3: Calculate Interest Payment

For semi-annual payments:

```
Half-year interest rate = Annual rate ÷ 2
Half-year interest rate = 0.125% ÷ 2 = 0.0625%

Convert to decimal: 0.0625% = 0.000625

Interest Payment = Adjusted Principal × Half-year interest rate
Interest Payment = $1,011.65 × 0.000625 = $0.63
```

## API Notes

-   The Treasury Direct APIs are public and don't require authentication
-   Data is updated daily during business days
-   Some CUSIPs may have multiple entries due to re-issues; the application uses the most recent issues
-   The Index Ratio represents the cumulative inflation adjustment since the security's issue date

## Local dev

Requires Node.js 18 or higher

1. **Clone the repository**

    ```bash
    git clone https://github.com/dabutvin/tips-calculator
    cd tips-calculator
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the development server**

    ```bash
    npm run dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Example CUSIPs for Testing

You can test the application with these real TIPS CUSIPs:

-   `912810SV1`
-   `912810RW0`
-   `912810SG4`
