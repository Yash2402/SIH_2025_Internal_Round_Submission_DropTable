"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Bot, User, Phone, AlertTriangle, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: "crisis" | "normal" | "screening";
}

interface ChatTabProps {
  user: any;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

const INDIAN_EMERGENCY_CONTACTS = [
  {
    name: "National Emergency",
    number: "112",
    description: "Police, Fire, Ambulance - Universal Emergency",
    type: "emergency",
  },
  {
    name: "Tele-MANAS Mental Health",
    number: "14416",
    description: "24/7 Government Mental Health Helpline",
    type: "mental_health",
  },
  {
    name: "KIRAN Mental Health",
    number: "1800-5990019",
    description: "24/7 Crisis Support, Depression, Anxiety",
    type: "mental_health",
  },
  {
    name: "Vandrevala Foundation",
    number: "9999666555",
    description: "24/7 WhatsApp & Call Support",
    type: "mental_health",
  },
  {
    name: "J&K Police Control Room",
    number: "0191-2561578",
    description: "Jammu Police Control Room",
    type: "local_emergency",
  },
  {
    name: "GMC Hospital Jammu",
    number: "0191-2584290",
    description: "Government Medical College Hospital",
    type: "local_medical",
  },
];

const CRISIS_KEYWORDS = [
  "kill myself",
  "end my life",
  "suicide",
  "hurt myself",
  "self harm",
  "want to die",
  "not worth living",
  "better off dead",
  "take my life",
  "end it all",
  "can't go on",
  "mar jaana",
  "jeevan khatam",
  "aatmahatya",
  "khud ko nuksaan",
  "marna",
  "jeene layak nahi",
  "bekar hun",
];

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

function formatConversationForApi(messages: Message[], newMessage: string): string {
  const systemPrompt =
    "You are Calmly AI, a warm, empathetic mental health assistant for students. Respond conversationally in a mix of simple English, keeping responses short and affectionatly fulfilling. Your primary goal is to be supportive. If you detect self-harm, provide a crisis helpline number and advise professional help. The following is the conversation history:";
  const formattedHistory = messages
    .filter((msg) => msg.id !== "welcome")
    .map((msg) => {
      const prefix = msg.isBot ? "AI:" : "User:";
      return `${prefix} ${msg.content}`;
    })
    .join("\n");
  const fullPrompt = `${systemPrompt}\n\n${formattedHistory}\nUser: ${newMessage}\nAI:`;
  return fullPrompt;
}

export default function ChatTab({ user }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/chat/history");
        if (res.ok) {
          const data = await res.json();
          if (data?.messages?.length) {
            // --- THIS IS THE FIX ---
            // Convert all timestamp strings from the API back into Date objects
            const messagesWithDateObjects = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(messagesWithDateObjects);
            setShowInitialOptions(false);
            return;
          }
        }
        setMessages([
          {
            id: "welcome",
            content: `Hello ${user?.name ?? "there"}! 👋 I'm Calmly AI, your personal mental health companion. Available 24/7. Your privacy and safety are top priorities; conversations are confidential.`,
            isBot: true,
            timestamp: new Date(),
            type: "normal",
          },
        ]);
      } catch {
        setMessages([
          {
            id: "welcome",
            content: `Hello ${user?.name ?? "there"}! 👋 I'm Calmly AI, your personal mental health companion. Available 24/7.`,
            isBot: true,
            timestamp: new Date(),
            type: "normal",
          },
        ]);
      }
    }
    fetchHistory();
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    async function saveChat() {
      try {
        if (messages.length === 0) return; // Don't save empty chats
        await fetch("/api/chat/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
      } catch {
        // ignore save errors silently
      }
    }
    saveChat();
  }, [messages]);

  const detectCrisis = (input: string) => {
    const text = input.toLowerCase();
    return CRISIS_KEYWORDS.some((kw) => text.includes(kw));
  };

  const getFallbackResponse = () => {
    const replies = [
      "I hear you and appreciate your openness. You’re not alone.",
      "Your feelings are valid. How can I support you today?",
      "Thank you for sharing. Feel free to tell me more when ready.",
      "I'm here to listen. What's on your mind?",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // --- IMPROVED FUNCTION SIGNATURE ---
  async function generateAIResponse(currentMessage: string, conversationHistory: Message[]): Promise<string> {
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key is missing. Please check your .env.local file.");
      return getFallbackResponse();
    }

    const fullPrompt = formatConversationForApi(conversationHistory, currentMessage);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error:", { status: response.status, body: errorBody });
        return "I'm having a little trouble connecting right now. Please try again soon.";
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts[0]?.text;

      if (text) {
        return text;
      } else {
        console.warn("No text found in Gemini API response, using fallback.", data);
        return getFallbackResponse();
      }
    } catch (error) {
      console.error("Network or parsing error when calling Gemini API:", error);
      return getFallbackResponse();
    }
  }

  const handleCrisisResponse = () => {
    setShowEmergencyContacts(true);
    return `🚨 I’m concerned about your safety. Please contact immediately:\nNational Emergency: 112\nMental Health Helpline: 14416\nKIRAN Support: 1800-5990019\nWould you like help to connect with a counselor?`;
  };

  async function sendMessage() {
    if (!newMessage.trim() || isLoading) return;

    const currentMessage = newMessage;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      content: currentMessage,
      isBot: false,
      timestamp: new Date(),
      type: "normal",
    };

    // --- IMPROVED STATE HANDLING ---
    // Create the next state of messages to ensure the AI gets the most recent context.
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setNewMessage("");
    setIsLoading(true);
    setShowInitialOptions(false);

    try {
      let botReply = "";
      if (detectCrisis(currentMessage)) {
        botReply = handleCrisisResponse();
      } else {
        // Pass the most up-to-date conversation history to the AI function.
        botReply = await generateAIResponse(currentMessage, updatedMessages);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          content: botReply,
          isBot: true,
          timestamp: new Date(),
          type: detectCrisis(currentMessage) ? "crisis" : "normal",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: "I’m currently experiencing technical issues. Please try again later.",
          isBot: true,
          timestamp: new Date(),
          type: "normal",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function clearConversation() {
    setMessages([]);
    setShowInitialOptions(true);
    await fetch("/api/chat/clear", { method: "DELETE" });
  }

  const quickReplies = [
    "I’m overwhelmed and need someone.",
    "Can you help with anxiety?",
    "I want mental health resources.",
  ];
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex flex-col items-center space-y-3">
          <Image src="/icon.png" alt="Calmly Logo" width={48} height={48} />
          <h1 className="mb-2 text-4xl font-light tracking-tight text-gray-800 select-none">Calmly</h1>
        </div>
        <p className="text-lg font-light text-gray-500 select-none">A Safe Space to Talk</p>
        <p className="text-sm font-light text-gray-400 select-none">Your conversations are private.</p>
      </div>
      {showInitialOptions && (
        <div className="mx-auto mb-6 max-w-2xl">
          <p className="mb-4 text-center font-medium text-gray-700">How can I support you today?</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white px-6 py-4 text-left text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                onClick={() => {
                  setNewMessage(reply);
                  setShowInitialOptions(false);
                }}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-grow flex-col space-y-5 overflow-scroll rounded-3xl border border-gray-300 bg-white shadow-md">
        <div className="flex-grow space-y-8 overflow-y-auto p-6" aria-live="polite" aria-atomic="true">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-4 ${
                msg.isBot ? "justify-start" : "flex-row-reverse justify-start gap-4"
              }`}
            >
              {msg.isBot ? (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-lg">
                  <Bot size={28} className="text-white" />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
                  <User size={28} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-md rounded-2xl px-5 py-4 shadow-sm ${
                  msg.isBot
                    ? msg.type === "crisis"
                      ? "border border-red-300 bg-red-50 text-red-900"
                      : "border border-gray-300 bg-gray-100 text-gray-900"
                    : "border-2 bg-gray-300 text-black shadow-lg"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={`mt-2 text-xs ${
                    msg.isBot ? (msg.type === "crisis" ? "text-red-600" : "text-gray-500") : "text-gray-100"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex items-center space-x-3 rounded-b-3xl border-t border-gray-300 bg-white p-6">
          <input
            type="text"
            placeholder="Your message..."
            className="flex-grow rounded-full border border-gray-300 bg-transparent px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            className={`ml-4 rounded-full p-3 ${
              newMessage.trim() && !isLoading ? "text-blue bg-blue-300" : "cursor-not-allowed bg-gray-300 text-gray-600"
            } shadow-md`}
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <button
        onClick={clearConversation}
        className="mx-auto mt-4 rounded-lg border border-gray-300 bg-white px-6 py-2 font-semibold text-gray-800 transition hover:bg-gray-100"
      >
        Clear Conversation
      </button>
      {showEmergencyContacts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 p-4 backdrop-blur-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-dialog-title"
        >
          <div className="w-full max-w-4xl overflow-y-auto rounded-3xl border border-gray-300 bg-white p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <AlertTriangle className="text-red-600" size={40} />
                <div className="absolute top-0 right-0 flex h-6 w-6 animate-ping items-center justify-center rounded-full bg-red-600">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              </div>
              <h2 id="emergency-dialog-title" className="mb-2 text-xl font-bold text-red-700">
                Emergency Contacts
              </h2>
              <p className="mb-4 text-red-600">The following contacts are available 24/7 for urgent support:</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INDIAN_EMERGENCY_CONTACTS.map((contact) => (
                <div
                  key={contact.number}
                  className="flex items-center justify-between space-x-3 rounded-xl border border-gray-200 p-4 transition-colors hover:border-red-500 hover:bg-red-50"
                >
                  <div>
                    <p className="text-md font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                    <p className="pt-1 text-sm text-green-600">24/7 Availability</p>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    <Phone size={20} />
                    <span>{contact.number}</span>
                  </a>
                </div>
              ))}
            </div>
            <button
              className="mt-6 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-800 hover:bg-gray-100"
              onClick={() => setShowEmergencyContacts(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
