import express from 'express';
import { storeVideoTranscript } from "../services/storeDocumentService.js";

const router = express.Router();

// Route to store documents
router.post("/", storeVideoTranscript);

export default router;
