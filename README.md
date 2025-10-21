# The Fashion Bot

An AI-powered automated checkout bot that remembers your details and completes purchases instantly. Just submit your information once, paste a product link, and let the bot handle the rest!

## Features

- **One-Time Setup**: Save your shipping and payment details once
- **Instant Checkout**: Paste product links and automate the entire checkout process
- **Multi-Store Support**: Currently supports Stanley 1913 and Tones Fashion stores
- **Secure & Private**: Bank-level encryption for your data
- **24/7 Availability**: Shop whenever you want

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- React Router for navigation
- Recoil for state management
- Tailwind CSS for styling
- ShadCN UI components
- Zod for form validation
- Axios for API calls
- Cookies for authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Puppeteer for browser automation
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fashion-bot
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start the backend server:
```bash
node index.js
```

The backend server should now be running on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/thefashionbot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

## Usage

### For New Users

1. **Sign Up**: Visit the landing page and click "Sign Up"
2. **Onboarding**: Complete the one-time setup with your:
   - Basic details (name, phone)
   - Shipping address
   - Payment information
3. **Dashboard**: Access your dashboard after onboarding
4. **Start Shopping**: Click "Start Checkout" to place an order

### For Existing Users

1. **Login**: Use your credentials to log in
2. **Dashboard**: View your saved information
3. **Place Order**:
   - Click "Start Checkout"
   - Select a store (Stanley or Tones Fashion)
   - Paste the product URL
   - Enter quantity
   - For Tones Fashion: Select size
   - Submit and watch the bot work!
4. **Edit Details**: Go to Settings to update your information

## Supported Stores

### Stanley 1913
- No size selection required
- Requires only product URL and quantity

### Tones Fashion (Shopify)
- Size selection required
- Supports sizes: XS, S, M, L, XL, XXL

### Coming Soon
- Nike
- Adidas
- Supreme

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to existing account
- `GET /api/auth/me` - Get current user (protected)

### User Management
- `GET /api/user/details` - Get user details (protected)
- `PUT /api/user/details` - Update user details (protected)

### Automation
- `POST /api/automation/start` - Start automation bot (protected)

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes with middleware
- CORS enabled for frontend origin
- Cookies for secure token storage

## Important Notes

⚠️ **For Educational/Testing Purposes Only**
- The checkout completion step is commented out for safety
- Uncomment in production only with proper authorization
- Test with dummy data first

⚠️ **Payment Information**
- Store payment details securely
- Consider using payment tokenization in production
- Never log sensitive payment information

## License

Private - All Rights Reserved