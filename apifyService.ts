import OpenAI from 'openai';
import { Opportunity, UserPreferences } from './types';

const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN as string;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;

// Initialize OpenAI
// Note: In a production app, you should proxy these requests through a backend to hide the API key.
// We enable dangerouslyAllowBrowser for this immediate implementation.
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function triggerScrape(prefs: UserPreferences): Promise<Opportunity[]> {
  if (!APIFY_TOKEN) {
    console.error("Apify token not found.");
    return [];
  }
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key not found.");
    return [];
  }

  // Construct search queries based on user preferences
  const queries: string[] = [];
  const baseQuery = `site:linkedin.com/jobs OR site:profesia.sk OR site:erasmusplus.sk`;
  const yearQuery = "(2025 OR 2026)"; // Force recent results

  if (prefs.fieldOfStudy) {
    queries.push(`${baseQuery} "${prefs.fieldOfStudy}" internship trainee ${yearQuery}`);
    queries.push(`${baseQuery} "${prefs.fieldOfStudy}" stáž študent ${yearQuery}`);
  }

  if (prefs.interests && prefs.interests.length > 0) {
    const topInterests = prefs.interests.slice(0, 2);
    topInterests.forEach(interest => {
      queries.push(`${baseQuery} "${interest}" internship ${yearQuery}`);
    });
  }

  // Add location filter
  const locationString = prefs.preferredLocations && prefs.preferredLocations.length > 0
    ? prefs.preferredLocations.join(' OR ')
    : '';

  const finalQueries = queries.map(q => locationString ? `${q} ${locationString}` : q).join('\n');

  const input = {
    "queries": finalQueries,
    "resultsPerPage": 8,
    "maxPagesPerQuery": 1,
    "languageCode": "sk",
    "mobileResults": false,
    "includeUnfilteredResults": false,
    "saveHtml": false,
    "saveHtmlToKeyValueStore": false,
    "includeIcons": false,
  };

  try {
    console.log("Starting Apify scrape with queries:", finalQueries);

    // Use fetch API to call Apify REST API directly (browser-compatible)
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/runs?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      }
    );

    if (!runResponse.ok) {
      throw new Error(`Apify run failed: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;
    const datasetId = runData.data.defaultDatasetId;

    console.log("Apify run started:", runId);

    // Wait for the run to finish (poll status)
    let runStatus = runData.data.status;
    while (runStatus === 'RUNNING' || runStatus === 'READY') {
      await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3s
      const statusResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
      );
      const statusData = await statusResponse.json();
      runStatus = statusData.data.status;
      console.log("Apify run status:", runStatus);
    }

    if (runStatus !== 'SUCCEEDED') {
      console.error("Apify run did not succeed:", runStatus);
      return [];
    }

    // Fetch dataset items
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
    );
    const items = await datasetResponse.json();

    // Collect raw data for OpenAI
    let rawTextBuffer = "";
    items.forEach((item: any) => {
      if (item.organicResults) {
        item.organicResults.forEach((result: any) => {
          rawTextBuffer += `Title: ${result.title}\nDesc: ${result.description}\nURL: ${result.url}\n\n`;
        });
      }
    });

    if (!rawTextBuffer.trim()) {
      console.warn("No organic results found from Apify.");
      return [];
    }

    console.log("Sending data to OpenAI for processing...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "system",
          content: `You are an expert data extracting assistant. Extract relevant student opportunities (Internships, Erasmus, Workshops) from the provided raw search results.
                    Current Year: 2026. Ignore anything clearly from 2023 or older unless it's recurring.
                    
                    Return a JSON array of objects with this schema:
                    {
                        "title": "string",
                        "type": "Erasmus" | "Stáž" | "Workshop" | "Súťaž" | "Iné",
                        "location": "string (infer from text)",
                        "date": "YYYY-MM-DD (approximate start date or deadline, use 2026 dates if unspecified)",
                        "description": "string (summarize based on snippet)",
                        "applyLink": "string (URL from input)",
                        "tags": ["string"]
                    }
                    
                    Only return the valid JSON array. No markdown formatting.`
        },
        {
          role: "user",
          content: `User Preferences: ${JSON.stringify(prefs)}\n\nRaw Search Results:\n${rawTextBuffer}`
        }
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content;
    try {
      const jsonString = content?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]";
      const parsedData = JSON.parse(jsonString);

      return parsedData.map((item: any, index: number) => ({
        id: `ai-${runId}-${index}-${Date.now()}`,
        title: item.title,
        type: item.type,
        location: item.location || 'Online / Unknown',
        date: item.date || new Date().toISOString().split('T')[0],
        description: item.description,
        applyLink: item.applyLink,
        tags: item.tags || [],
        imageUrl: undefined
      }));

    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError, content);
      return [];
    }

  } catch (error) {
    console.error("Apify/OpenAI flow failed:", error);
    return [];
  }
}

export async function fetchOpportunitiesFromApify(): Promise<Opportunity[]> {
  return [];
}
