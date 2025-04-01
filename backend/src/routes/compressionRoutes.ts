import express from 'express';
import {
  compressFile,
  getAllFiles,
  getFileById,
  decompressFile,
  deleteFile,
  getAllKeys
} from '../controllers/compressionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected with authentication
router.use(protect);

// GET all files for logged-in user
router.get('/files', getAllFiles);

// GET a specific file
router.get('/files/:id', getFileById);

// POST compress a file
router.post('/compress', compressFile);

// POST decompress a file (with compressed data and huffman key in body)
router.post('/decompress', decompressFile);

// GET all huffman keys for logged-in user
router.get('/keys', getAllKeys);

// DELETE a file
router.delete('/files/:id', deleteFile);

export default router; 