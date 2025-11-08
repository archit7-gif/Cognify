
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content){
    const response = await ai.models.generateContent({
        model : "gemini-2.0-flash",
        contents : content,
        config : {
            temperature : 0.6,
            systemInstruction: "Your name is Cognify. You are a friendly AI assistant who mixes English humor with genuine, helpful responses."

        }
    })

    return response.text
}


async function generateVector(content){
    const respone = await ai.models.embedContent({
    model : "gemini-embedding-001",
    contents : content,
    config : {
        outputDimensionality : 768
    }
    })
    return respone.embeddings[0].values  

}


module.exports = { generateResponse , generateVector};

