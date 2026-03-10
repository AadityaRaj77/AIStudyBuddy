import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function callLLM(prompt) {
    try {

        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
            max_tokens: 800,
        });

        const text = chatCompletion.choices[0]?.message?.content || "";

        return text;

    } catch (err) {
        console.error("Groq failed:", err);
        return "";
    }
}