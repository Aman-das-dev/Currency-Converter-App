// Gemini API Service for Spending Advisor

const GEMINI_API_URL = '/api/gemini/advice';

// Custom rules for producing beautiful realistic financial assessments if no API key is present
const getMockAdvisorResponse = (promptText, context = {}) => {
  const { budget = 1000, days = 7, destination = 'Japan', currency = 'JPY' } = context;
  const lowerPrompt = promptText.toLowerCase();

  if (lowerPrompt.includes('travel') || lowerPrompt.includes('destination') || lowerPrompt.includes('days')) {
    const dailyBudget = (budget / days).toFixed(2);
    return `### 🗺️ Travel Financial Report: **${destination}**

Here is your customized travel budget analysis for a **${days}-day** trip with a total budget of **$${budget}** (~${(budget * 156.8).toLocaleString()} ${currency}).

#### 1. Daily Spending Allocation
*   **Accommodation (40%):** $${(budget * 0.4).toFixed(2)} ($${((budget * 0.4)/days).toFixed(2)}/day) — Recommended for local guest houses or mid-range boutique stays.
*   **Food & Local Dining (25%):** $${(budget * 0.25).toFixed(2)} ($${((budget * 0.25)/days).toFixed(2)}/day) — Perfect for enjoying local street food, casual diners, and occasional gourmet treats.
*   **Transport & Metro (15%):** $${(budget * 0.15).toFixed(2)} ($${((budget * 0.15)/days).toFixed(2)}/day) — Ideal for regional trains and transit cards.
*   **Activities & Sightseeing (12%):** $${(budget * 0.12).toFixed(2)} ($${((budget * 0.12)/days).toFixed(2)}/day) — Covers temple admissions, museums, and local tours.
*   **Emergency Buffer (8%):** $${(budget * 0.08).toFixed(2)} — Do not touch unless necessary.

#### 2. Spending Risk Rating: **Moderate-Safe** 🟢
Your daily allowance is **$${dailyBudget}/day**. For **${destination}**, this is a solid budget for a comfortable budget/mid-range experience.

#### 3. AI Smart Recommendation
*   *Tip 1:* Buy local transport passes in advance to save up to 20%.
*   *Tip 2:* Stick to lunch specials at fine-dining places, as dinner menus are twice as expensive.
*   *Tip 3:* Keep some cash on hand, as many local traditional vendors do not accept credit cards.`;
  }

  // General spending advice
  return `### 💡 AI Spending Advisor Consultation

Thank you for consulting me about your finances! Based on your query, here is an executive spending breakdown:

#### 📋 Strategic Insights
1.  **50/30/20 Budgeting Rule:**
    *   **50% Needs:** $${(budget * 0.5).toFixed(2)} (Rent, utilities, basic groceries).
    *   **30% Wants:** $${(budget * 0.3).toFixed(2)} (Dining out, entertainment, shopping).
    *   **20% Savings:** $${(budget * 0.2).toFixed(2)} (Investing, emergency fund, future goals).

2.  **Exchange Rate Leverage:** 
    If you convert currencies regularly, check the trend chart to convert when the base currency is at a multi-week peak against your target.

3.  **Inflation Shields:** 
    Consider allocating 5-10% of long-term savings into assets like diversified stock indices or crypto index products (BTC, ETH) to hedge against fiat purchasing power erosion.

*Feel free to supply your personal Gemini API Key in the settings panel to get real-time, hyper-advanced AI analysis for any complex prompt!*`;
};

export const getGeminiAdvice = async (promptText, context = {}) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptText,
        context,
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || 'Gemini API Error');
    }

    const data = await response.json();
    const adviceText = data.advice;
    
    if (!adviceText) throw new Error('Empty response from AI model');
    return adviceText;
  } catch (error) {
    console.error('Failed to get response from Gemini API:', error);
    return `⚠️ **Gemini API Error:** ${error.message || 'Unknown network error'}.\n\nFalling back to simulated consultant:\n\n${getMockAdvisorResponse(promptText, context)}`;
  }
};
