const Chat = require("../api/model");
async function requesttoapi(model, message, previous) {
  let response;
  if (model === "GPT-4o-mini") {
    response = await requestGpt4oMini(message, previous);
  }
  else if (model === "Gemini-2.5-flash") {
    response = await requestGemini(message, previous);
  }
  else if (model == "llama") {
    response = await requestLama(message, previous);
  }
  else {
    const totalLength =
      message.length + JSON.stringify(previous || []).length;

    if (totalLength < 2000) {
      response = await requestGpt4oMini(message, previous);

    } else if (totalLength < 12000) {
      response = await requestGemini(message, previous);

    } else {
      response = await requestLama(message, previous);
    }
  }


  try {
    return safeParseJsonResponse(response);
  }
  catch (err) {
    console.log(err);
  }
}

const handleChat = async (req, res) => {
  const { message, model } = req.body;

  try {

    let chatId = req.body.id;

    if (chatId) {
      const existingChat = await Chat.findById(chatId);
      if (existingChat) {
        console.log("Existing chat found:", existingChat);
        const responseText = await requesttoapi(model, message, existingChat.messages);

        await Chat.updateOne(
          { _id: chatId },
          {
            $push: {
              messages: {
                role: "user",
                content: message,
                model: model,
              },
              responses: {
                message: {
                  role: "assistant",
                  content: responseText.response,
                  model: model,
                },
                related1: responseText.related?.[0] || "",
                related2: responseText.related?.[1] || "",
              }
            }
          }
        );
        console.log("Chat updated successfully:", existingChat);
        res.status(201).json({ message: "Chat created successfully", chatId: chatId, response: responseText });
      }
    }

    else {
      const responseText = await requesttoapi(model, message, []);
      const newChat = new Chat({
        title: req.body.title || "Untitled Chat",

        messages: [
          {
            role: "user",
            content: message,
            model: model,
          },
        ],

        responses: [
          {
            message: {
              role: "assistant",
              content: responseText.response,
              model: model,
            },
            related1: responseText.related[0],
            related2: responseText.related[1],
          },
        ],
      });

      const savedChat = await newChat.save();
      console.log("Chat created successfully:", savedChat);
      chatId = newChat._id;
      res.status(201).json({ message: "Chat created successfully", chatId: chatId, response: responseText });
    }
  }
  catch (error) {
    console.error("Error handling chat:", error);
    res.status(500).json({ message: "Error handling chat", error: error.message });
  }
};

const handleHistory = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });

    const formattedChats = chats.map(chat => ({
      id: chat._id,
      title: chat.title
    }));
    res.status(200).json({ formattedChats });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history", error: error.message });
  }
};

const handlechathistory = async (req, res) => {
  try {
    const chatId = req.params.slug;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ chat });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history", error: error.message });
  }
};

async function requestGemini(message, previous) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Respond ONLY in valid JSON::

{
  "response": "main answer",
  "related": ["related content 1", "related content 2"]
}

User message: ${message}
previous messages ${previous}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
  console.log("Gemini raw response text:", text);
}

const axios = require("axios");
async function requestGpt4oMini(message, previous) {
  const prompt = `
Respond ONLY in valid JSON:

{
  "response": "main answer",
  "related": ["related content 1", "related content 2"]
}

User message: ${message}
Previous messages: ${JSON.stringify(previous)}
`;

  const res = await axios.post(
    "https://models.github.ai/inference/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. You must respond ONLY with valid JSON and no extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = res.data.choices[0].message.content;
  return text;
  console.log("GPT-4o-mini raw response:", text);
}
async function requestLama(message, previous) {
  const prompt = `
Respond ONLY in valid JSON:

{
  "response": "main answer",
  "related": ["related content 1", "related content 2"]
}

User message: ${message}
Previous messages: ${JSON.stringify(previous)}
`;

  const res = await axios.post(
    "https://models.github.ai/inference/chat/completions",
    {
      model: "meta-llama-3.1-8b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. You must respond ONLY with valid JSON and no extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.LAMA}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = res.data.choices[0].message.content;

  return text;
  console.log("Lama raw response:", text);

}
function safeParseJsonResponse(rawText) {
  if (typeof rawText !== "string") {
    return { response: "", related: [] };
  }

  let text = rawText.trim();
  text = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

  try {
    let parsed = JSON.parse(text);
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    return {
      response: typeof parsed.response === "string" ? parsed.response : "",
      related: Array.isArray(parsed.related) ? parsed.related : []
    };

  } catch (err) {
    console.error("JSON parse failed:", err.message);
    return { response: "", related: [] };
  }
}


module.exports = {
  handleChat,
  handleHistory,
  handlechathistory
};
