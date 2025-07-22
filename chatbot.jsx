import { useState } from 'react';

export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    async function sendMessage(e) {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "system", content: "You are a smart nutrition advisor." },
                    ...messages,
                    userMsg
                ]
            })
        });

        const data = await res.json();
        const reply = data.choices[0].message;
        setMessages(prev => [...prev, reply]);
        setInput("");
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">🤖 Ask About Food</h2>
            <div className="bg-white p-4 rounded-xl shadow-md mb-2 max-h-60 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-blue-700' : 'text-gray-800'}`}>
                        <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
                <input className="flex-1 p-2 border rounded" value={input} onChange={e => setInput(e.target.value)} />
                <button className="bg-green-500 text-white px-4 rounded" type="submit">Send</button>
            </form>
        </div>
    );
}
