import { Request, Response } from 'express';
import { File } from '../models';
import { compressText, decompressText } from '../utils/huffmanCompression';

// Compress a text file and save only the Huffman key in the database
export const compressFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName, content } = req.body;
    // Get the user from the request (attached by auth middleware)
    const user = (req as any).user;

    if (!fileName || !content) {
      res.status(400).json({ message: 'File name and content are required' });
      return;
    }

    if (!user) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }

    // Compress the text using Huffman algorithm
    const { compressedData, huffmanData, compressionRatio } = compressText(content);
    
    // Calculate sizes
    const fileSize = content.length;
    const compressedSize = compressedData.length / 8; // Convert bits to bytes for comparison
    
    // Create new file entry in the database with user ID (storing only the Huffman key)
    const newFile = await File.create({
      userId: user.id,
      fileName: fileName.endsWith('.huff') ? fileName : `${fileName}.huff`,
      huffmanData,
      compressionRatio,
      fileSize,
      compressedSize
      // compressedData is intentionally omitted - we don't store it anymore
    });
    
    // Convert binary string to actual binary data for better space efficiency
    // This converts the string of 0s and 1s to a more compact binary representation
    const binaryData = compressedToBinary(compressedData);
    
    // Return the compressed binary data and file info to the client
    res.status(201).json({
      id: newFile.id,
      fileName: newFile.fileName,
      compressionRatio,
      fileSize,
      compressedSize,
      compressedData: binaryData, // Send as base64 for the client to download
      message: 'File compressed successfully'
    });
  } catch (error) {
    console.error('Error compressing file:', error);
    res.status(500).json({ message: 'Error compressing file', error: (error as Error).message });
  }
};

// Helper function to convert compressed data string (of 0s and 1s) to binary
function compressedToBinary(compressedData: string): string {
  // We'll encode the bit string to a base64 string for efficient transfer
  // First, convert bits to bytes
  const bytes = [];
  for (let i = 0; i < compressedData.length; i += 8) {
    const byte = compressedData.slice(i, i + 8).padEnd(8, '0');
    bytes.push(parseInt(byte, 2));
  }
  
  // Create a buffer from the bytes
  const buffer = Buffer.from(bytes);
  
  // Return as base64 string which is efficient for transfer
  return buffer.toString('base64');
}

// Helper function to convert binary back to compressed data string (of 0s and 1s)
function binaryToCompressed(base64Data: string): string {
  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Convert each byte to 8 bits
  let bits = '';
  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, '0');
  }
  
  return bits;
}

// Get all files for the logged-in user
export const getAllFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the user from the request (attached by auth middleware)
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }

    const files = await File.findAll({
      where: { userId: user.id },
      attributes: ['id', 'fileName', 'compressionRatio', 'fileSize', 'compressedSize', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files', error: (error as Error).message });
  }
};

// Get a specific file by ID
export const getFileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const fileId = req.params.id;
    // Get the user from the request (attached by auth middleware)
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
    
    const file = await File.findOne({
      where: { id: fileId, userId: user.id },
      attributes: ['id', 'fileName', 'huffmanData', 'compressionRatio', 'fileSize', 'compressedSize', 'createdAt']
    });
    
    if (!file) {
      res.status(404).json({ message: 'File not found or unauthorized' });
      return;
    }
    
    res.status(200).json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Error fetching file', error: (error as Error).message });
  }
};

// Decompress a file using provided compressed data and Huffman key
export const decompressFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { compressedData, huffmanKey } = req.body; // Get both compressed data and huffman key from request body
    
    // Get the user from the request (attached by auth middleware)
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
    
    if (!compressedData) {
      res.status(400).json({ message: 'Compressed data is required' });
      return;
    }

    if (!huffmanKey) {
      res.status(400).json({ message: 'Huffman key is required' });
      return;
    }
    
    // Convert the binary data back to a string of 0s and 1s
    const bitString = binaryToCompressed(compressedData);
    
    // Use the provided huffman key and bit string to decompress
    const decompressedContent = decompressText(bitString, huffmanKey);
    
    res.status(200).json({
      content: decompressedContent
    });
  } catch (error) {
    console.error('Error decompressing file:', error);
    res.status(500).json({ message: 'Error decompressing file', error: (error as Error).message });
  }
};

// Delete a file
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const fileId = req.params.id;
    
    // Get the user from the request (attached by auth middleware)
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }
    
    // Only allow deletion of user's own files
    const file = await File.findOne({
      where: { id: fileId, userId: user.id }
    });
    
    if (!file) {
      res.status(404).json({ message: 'File not found or unauthorized' });
      return;
    }
    
    await file.destroy();
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: (error as Error).message });
  }
};

// Get all Huffman keys for the logged-in user
export const getAllKeys = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the user from the request (attached by auth middleware)
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'User authentication required' });
      return;
    }

    const files = await File.findAll({
      where: { userId: user.id },
      attributes: ['id', 'fileName', 'huffmanData', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching keys:', error);
    res.status(500).json({ message: 'Error fetching keys', error: (error as Error).message });
  }
}; 