// Define a Huffman Tree node
class HuffmanNode {
  char: string | null;
  frequency: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string | null, frequency: number) {
    this.char = char;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
  }
}

// Function to build frequency map from text
const buildFrequencyMap = (text: string): Map<string, number> => {
  const frequencyMap = new Map<string, number>();
  
  for (const char of text) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }
  
  return frequencyMap;
};

// Build the Huffman Tree from frequency map
const buildHuffmanTree = (frequencyMap: Map<string, number>): HuffmanNode => {
  // Create a priority queue (using array for simplicity)
  const priorityQueue: HuffmanNode[] = [];
  
  // Add all characters to priority queue
  for (const [char, frequency] of frequencyMap.entries()) {
    priorityQueue.push(new HuffmanNode(char, frequency));
  }
  
  // Build Huffman Tree: pop two nodes with lowest frequency,
  // create a parent node with these two as children,
  // add the parent back to the queue
  while (priorityQueue.length > 1) {
    // Sort by frequency (ascending)
    priorityQueue.sort((a, b) => a.frequency - b.frequency);
    
    // Get the two nodes with lowest frequency
    const left = priorityQueue.shift()!;
    const right = priorityQueue.shift()!;
    
    // Create a parent node with '\0' as character and frequency = sum of children's frequencies
    const parent = new HuffmanNode(null, left.frequency + right.frequency);
    parent.left = left;
    parent.right = right;
    
    // Add parent back to the queue
    priorityQueue.push(parent);
  }
  
  // Return the root of Huffman Tree
  return priorityQueue[0];
};

// Build coding table mapping each character to its binary code
const buildCodeTable = (root: HuffmanNode): Map<string, string> => {
  const codeTable = new Map<string, string>();
  
  // Recursive function to traverse the tree and build code
  const traverseTree = (node: HuffmanNode | null, code: string) => {
    if (!node) return;
    
    // If leaf node (has character), add to code table
    if (node.char !== null) {
      codeTable.set(node.char, code);
    }
    
    // Traverse left (add '0')
    traverseTree(node.left, code + '0');
    
    // Traverse right (add '1')
    traverseTree(node.right, code + '1');
  };
  
  // Start traversal from root with empty code
  traverseTree(root, '');
  
  return codeTable;
};

// Encode text using the code table
const encodeText = (text: string, codeTable: Map<string, string>): string => {
  let encodedText = '';
  
  for (const char of text) {
    encodedText += codeTable.get(char) || '';
  }
  
  return encodedText;
};

// Decode binary text using the Huffman tree
const decodeText = (encodedText: string, root: HuffmanNode): string => {
  let decodedText = '';
  let currentNode = root;
  
  for (const bit of encodedText) {
    // Navigate left for '0', right for '1'
    if (bit === '0') {
      currentNode = currentNode.left!;
    } else {
      currentNode = currentNode.right!;
    }
    
    // If leaf node (character found)
    if (currentNode.char !== null) {
      decodedText += currentNode.char;
      currentNode = root; // Reset to root for next character
    }
  }
  
  return decodedText;
};

// Serialize tree and frequency map for storage
const serializeHuffmanData = (
  root: HuffmanNode, 
  frequencyMap: Map<string, number>
): string => {
  // Convert frequency map to JSON object
  const frequencyObj: Record<string, number> = {};
  frequencyMap.forEach((freq, char) => {
    frequencyObj[char] = freq;
  });
  
  return JSON.stringify({ frequencyMap: frequencyObj });
};

// Deserialize frequency map and rebuild tree
const deserializeHuffmanData = (serializedData: string): { 
  root: HuffmanNode, 
  frequencyMap: Map<string, number> 
} => {
  const data = JSON.parse(serializedData);
  
  // Rebuild frequency map
  const frequencyMap = new Map<string, number>();
  for (const char in data.frequencyMap) {
    frequencyMap.set(char, data.frequencyMap[char]);
  }
  
  // Rebuild Huffman tree
  const root = buildHuffmanTree(frequencyMap);
  
  return { root, frequencyMap };
};

// Main compression function
export const compressText = (text: string): { 
  compressedData: string, 
  huffmanData: string,
  compressionRatio: number
} => {
  if (!text || text.length === 0) {
    return { 
      compressedData: '', 
      huffmanData: '',
      compressionRatio: 0
    };
  }
  
  // Build frequency map
  const frequencyMap = buildFrequencyMap(text);
  
  // Build Huffman tree
  const root = buildHuffmanTree(frequencyMap);
  
  // Build code table
  const codeTable = buildCodeTable(root);
  
  // Encode text
  const compressedData = encodeText(text, codeTable);
  
  // Serialize Huffman data
  const huffmanData = serializeHuffmanData(root, frequencyMap);
  
  // Calculate compression ratio (original size / compressed size)
  // Convert binary string to bytes (divide by 8) for accurate comparison
  const originalSize = text.length * 8; // Assuming 8 bits per character
  const compressedSize = compressedData.length;
  const compressionRatio = originalSize / compressedSize;
  
  return { 
    compressedData, 
    huffmanData,
    compressionRatio
  };
};

// Main decompression function
export const decompressText = (
  compressedData: string, 
  huffmanData: string
): string => {
  if (!compressedData || !huffmanData) {
    return '';
  }
  
  // Deserialize Huffman data
  const { root } = deserializeHuffmanData(huffmanData);
  
  // Decode text
  return decodeText(compressedData, root);
}; 