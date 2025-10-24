import axios from "axios";

const API_NINJAS_KEY = import.meta.env.VITE_API_NINJAS_KEY as string;

/**
 * Fetches a random quote using API Ninjas Quotes API.
 * Docs: https://api-ninjas.com/api/quotes
 */
export async function getMotivationalQuote(): Promise<{ q: string; a: string }> {
  try {
    const res = await axios.get("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": API_NINJAS_KEY,
      },
    });

    // The API returns an array like:
    // [ { quote: "Your quote here", author: "Author Name", category: "motivational" } ]
    const data = Array.isArray(res.data) ? res.data[0] : res.data;

    return {
      q: data.quote ?? "Keep going, you’re doing great!",
      a: data.author ?? "Unknown",
    };
  } catch (error) {
    console.error("Error fetching quote:", error);
    // fallback quote
    return {
      q: "Success is the sum of small efforts repeated day in and day out.",
      a: "Robert Collier",
    };
  }
}
