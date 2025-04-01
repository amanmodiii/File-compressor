# File Compression System - Modernized

A comprehensive file compression system that uses the Huffman algorithm for text file compression. This update includes several modern features and security improvements.

## Key Features

### Technical Improvements

- **UUID-based Identification**: Replaced numeric IDs with UUIDs for improved security and unique identification across distributed systems.
- **Key-only Storage**: Only Huffman keys are stored in the database, not the compressed data, improving security and reducing database load.
- **Binary File Format**: Compressed data is stored in binary format instead of strings of 0s and 1s, dramatically reducing file size.
- **Manual Decompression**: Users must enter the Huffman key manually during decompression, ensuring better security and control.
- **Immediate Download**: Compressed files are now automatically downloaded after compression, with the Huffman key saved to the user's account.

### UI/UX Enhancements

- **Modern Typography**: Implemented a font system using Inter, Poppins, and JetBrains Mono for better readability and visual appeal.
- **Smooth Animations**: Added subtle animations using Framer Motion for a more engaging user experience.
- **Dark Mode Support**: Full dark mode implementation across all components for comfortable use in different lighting conditions.
- **Responsive Design**: Improved layout and component design for various screen sizes.
- **Better Feedback**: Enhanced status messages and instructional texts to guide users through the compression/decompression process.

## How It Works

### Compression Process

1. Upload a text file or enter text directly in the editor.
2. The system compresses the text using the Huffman algorithm.
3. The binary compressed file is automatically downloaded to your device.
4. The Huffman key (but not the compressed data) is saved to your account for future reference.

### Decompression Process

1. Upload a .huff compressed file (in binary format).
2. Manually enter the Huffman key that was generated during compression.
3. The system converts the binary data back to a bit string, uses the key to rebuild the Huffman tree, and decompresses the data.
4. Download the decompressed content as a text file.

## Binary Format Benefits

The system now converts the compressed data (originally a long string of 0s and 1s) into a compact binary format:

1. **Space Efficiency**: Each 8 bits are stored as a single byte rather than 8 characters, reducing file size by up to 8x.
2. **Faster Transfers**: Smaller file sizes mean quicker downloads and uploads.
3. **Better Storage**: Binary data is more efficiently stored both in memory and on disk.
4. **Industry Standard**: Uses standard base64 encoding for transferring binary data over HTTP.

## Huffman Key Format

The Huffman key is stored as a JSON object containing a frequency map of characters in the original text. Example:

```json
{
  "frequencyMap": {
    "a": 10,
    "b": 5,
    "c": 15,
    " ": 20
  }
}
```

This key is essential for the decompression process as it allows the algorithm to rebuild the Huffman tree.

## Security Considerations

- No compressed data is stored on the server, only the Huffman key.
- UUIDs are used instead of sequential IDs, making it harder to guess or enumerate resources.
- Client-side decompression is available for sensitive files.
- User authentication is required for all operations.
- Binary file format is more secure than plain text for data transmission.

## Technical Stack

- **Frontend**: React, Next.js, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth with HTTP-only cookies

## Future Improvements

- Add support for compressing other file types beyond text
- Implement file sharing capabilities
- Add encryption options for the Huffman keys
- Support for batch compression/decompression

## Getting Started

### Prerequisites
- Node.js (v16+)
- Postgresql

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/file-compressor.git
cd file-compressor
```

2. Set up the backend
```
cd backend
npm install
cp .env.example .env
npm run dev
```

3. Set up the frontend
```
cd ../frontend
npm install
npm run dev
```

4. Open your browser and navigate to http://localhost:3000

## API Endpoints

### Backend API Routes

- `POST /api/compression/compress` - Compress a text file
- `GET /api/compression/files` - Get all compressed files
- `GET /api/compression/files/:id` - Get a specific file
- `GET /api/compression/decompress/:id` - Decompress a file
- `DELETE /api/compression/files/:id` - Delete a file

## License

This project is licensed under the MIT License - see the LICENSE file for details. 