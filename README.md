
# 🧠 Cognify - AI-Powered Chat Application 

**Cognify** is a full-stack, real-time chat application built with the **MERN stack**, integrating **Google Gemini** and **Pinecone** to deliver intelligent, context-aware conversations. It features a persistent AI memory system that allows the bot to recall past interactions — making conversations feel more natural, human-like, and continuous.  

🔗 **Live App:** [Cognify](#)

---

## 🚀 Core Features  

### ⚡ Real-Time Conversations  
Experience instant messaging powered by **Socket.IO**, ensuring smooth, low-latency, and bi-directional communication between users and the AI.  

### 🧩 Persistent AI Memory  
Cognify’s dual-layer memory system makes it stand out:  

- **Long-Term Memory:**  
  - Each message is converted into a vector embedding using **Google Gemini**.  
  - These embeddings are stored in **Pinecone**, enabling recall of relevant past messages for contextual, memory-based responses.  

- **Short-Term Memory:**  
  - Maintains the active chat’s context to ensure immediate relevance in responses.  

### 🔐 Secure & Modern Authentication  
Implements **JWT-based authentication** with **httpOnly cookies**, ensuring sessions are secure and resistant to XSS or CSRF attacks.  

### 💬 Full-Stack CRUD for Chats  
Users can **create**, **read**, **rename**, or **delete** conversations.  
Deletions are synchronized across **MongoDB** and **Pinecone**, keeping data consistent across all layers.  

### 🎨 Responsive, Intuitive UI  
Built with **React + Redux Toolkit**, providing a clean, dynamic, and mobile-friendly interface that adapts across devices seamlessly.  

---

## 🧰 Tech Stack  

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Redux Toolkit, Vite, Socket.IO Client |
| **Backend** | Node.js, Express, MongoDB, Socket.IO |
| **AI & Data** | Pinecone (Vector Database), Google Gemini API (Embeddings) |

---

## 🏗️ System Architecture  

Cognify follows a modular and scalable architecture:  

1. **Client (React)**  
   - Users interact with the React frontend.  
   - Communicates with backend via **Socket.IO** for real-time messaging.  

2. **Backend (Node.js/Express)**  
   - Handles **authentication**, **message persistence**, and **API orchestration**.  
   - Manages chat data in **MongoDB**.  

3. **AI Memory System**  
   - Each message is converted into a **vector embedding** using **Google Gemini**.  
   - The vector, along with metadata (chatId, userId), is stored in **Pinecone**.  
   - When new messages arrive, relevant embeddings are retrieved to generate **contextual, memory-aware AI responses**.  

---

## 💡 Summary  

Cognify bridges human-like memory and real-time communication through AI-driven architecture.  
With its blend of **MERN stack performance**, **secure systems**, and **intelligent memory**, it redefines how users interact with conversational AI.


