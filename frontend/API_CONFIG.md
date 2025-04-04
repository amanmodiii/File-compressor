# Frontend API Configuration

This guide explains how to configure the frontend to connect to your deployed backend API.

## Local Development

For local development, the frontend connects to your local backend at `http://localhost:5000`.

## Production Deployment

When deploying to production, you need to update the API endpoint to point to your deployed backend URL.

### Step 1: Create Environment Variables

Create a `.env.local` file in the frontend directory with the following content:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

Replace `https://your-backend-url.railway.app` with your actual deployed backend URL.

### Step 2: Set Railway Environment Variables

When deploying to Railway, add the environment variable in the Railway dashboard:

1. Go to your frontend service in Railway
2. Navigate to the "Variables" tab
3. Add a new variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: Your deployed backend URL (e.g., `https://your-backend-url.railway.app`)

## Updating API Client (if needed)

If your frontend uses a custom API client, make sure it reads the environment variable:

```typescript
// example: services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include'
    });
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  // Add other methods as needed
};
```

## Troubleshooting

If you encounter connection issues:

1. Verify that your `NEXT_PUBLIC_API_URL` is set correctly
2. Ensure your backend's CORS configuration allows requests from your frontend domain
3. Check that both services are running properly
4. Check the browser console for any error messages related to API requests 