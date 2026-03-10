import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { TaskType } from "@google/generative-ai";
import { request } from "undici";
import dotenv from 'dotenv';
dotenv.config();

const TUBEONAI_API_KEY = process.env.TUBEONAI_API_KEY;

function cleanTubeOnAITranscript(raw) {
  if (!raw) return "";

  // Remove repeated "time : xxx second. Text:" markers
  const withoutMarkers = raw.replace(
    /time\s*:\s*\d+(?:\.\d+)?\s*second\.?\s*Text:\s*/gi,
    " ",
  );

  // Collapse extra whitespace
  return withoutMarkers.replace(/\s+/g, " ").trim();
}

export async function storeVideoTranscript(req, res) {
  try {
    const { url, question } = req.body;
    if (!url) {
      const { url, questiondocumentId } = req.body;
    }
    if (!TUBEONAI_API_KEY) {
      return res.status(500).json({ message: 'TubeOnAI API key missing' });
    }
    const { body } = await request('https://app.tubeonai.com/api/developer/v1/transcriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TUBEONAI_API_KEY}`
      },
      body: JSON.stringify({
        url,
        type: 'youtube'
      })
    });
    const result = await body.json();

    // Create a Document object
    const cleanedTranscript = cleanTubeOnAITranscript(result.data.transcription);

    const document = new Document({
      pageContent: cleanedTranscript,
      metadata: { ...result.data, cleanedTranscript },
    });
  
    // Split the document into smaller chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const documents = await textSplitter.splitDocuments([document]);

    // AI Embeddings
    const texts = documents.map(doc => doc.pageContent);
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    });

    let embeddedDocuments = await embeddings.embedDocuments(texts);


    
    const vectorstore = await MemoryVectorStore.fromDocuments(
      documents, // ✅ real Document objects
      embeddings
    );

    // Use the vector store as a retriever that returns a single document
    const retriever = vectorstore.asRetriever(1);
    console.log(retriever);

    // Retrieve the most similar text
    const retrievedDocuments = await retriever.invoke(question);


    return res.status(200).json(retrievedDocuments[0].pageContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

