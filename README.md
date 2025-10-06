# 🔐 Password Vault - Secure Password Manager

A modern, secure password manager built with Next.js, TypeScript, and MongoDB. Features client-side encryption, password generation, and secure vault management.

## 🌟 Features

### 🔒 **Security Features**
- **Client-Side Encryption**: Your passwords are encrypted in your browser before being sent to the server
- **Zero-Knowledge Architecture**: Server never sees your plaintext passwords
- **Master Password Protection**: All vault data is encrypted with your master password
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing

### 🛠️ **Core Functionality**
- **Password Generator**: Create strong passwords with customizable options
- **Secure Vault**: Store and manage passwords, usernames, URLs, and notes
- **Search & Filter**: Find vault items quickly with intelligent search and filtering
- **Copy to Clipboard**: Auto-clear clipboard after 15 seconds for security
- **CRUD Operations**: Create, read, update, and delete vault items

### 🎨 **User Experience**
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Search**: Instant search through vault items
- **Smart Filtering**: Filter by type (Websites, Applications, Accounts, Recent)
- **Mobile Responsive**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/password-vault.git
   cd password-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Choose the free M0 Sandbox cluster

2. **Configure Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password
   - Set privileges to "Read and write to any database"

3. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

4. **Get Connection String**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `password-vault`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/password-vault` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret key | `your-nextauth-secret` |

## 📱 How It Works

### 🔐 **Authentication Flow**

1. **Sign Up**
   - User creates account with email and password
   - Password is hashed with bcrypt
   - User data is stored in MongoDB
   - JWT token is generated for session

2. **Login**
   - User enters email and password
   - Password is verified against stored hash
   - JWT token is generated and stored in localStorage
   - User is redirected to dashboard

### 🛡️ **Encryption Flow**

1. **Adding Vault Items**
   - User enters master password (stored locally)
   - Vault data is encrypted with AES encryption using master password
   - Only encrypted data is sent to server
   - Server stores encrypted data (never sees plaintext)

2. **Viewing Vault Items**
   - Server sends encrypted data to browser
   - User's master password decrypts data locally
   - Plaintext is displayed only in browser
   - Data is never stored in plaintext on server

### 🔍 **Search & Filter Flow**

1. **Search Process**
   - User types search query
   - Each vault item is decrypted locally
   - Search matches against title, username, URL, notes
   - Results are filtered and displayed

2. **Filter Process**
   - User selects filter type (Websites, Apps, Accounts, Recent)
   - Items are categorized based on content analysis
   - Filtered results are displayed

## 🏗️ **Project Structure**

```
password-vault/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   └── vault/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   ├── PasswordGenerator.tsx
│   │   ├── SearchFilter.tsx
│   │   └── VaultItem.tsx
│   └── lib/
│       ├── auth.ts
│       ├── database.ts
│       ├── encryption.ts
│       └── models/
│           ├── User.ts
│           └── VaultItem.ts
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔧 **API Endpoints**

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Vault Management
- `GET /api/vault` - Get all vault items for user
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update vault item
- `DELETE /api/vault/[id]` - Delete vault item

## 🛡️ **Security Features**

### Client-Side Encryption
- **AES Encryption**: All vault data encrypted with crypto-js
- **Master Password**: User's master password never leaves browser
- **Zero-Knowledge**: Server never sees plaintext passwords
- **Secure Storage**: Only encrypted data stored in database

### Authentication Security
- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt for password security
- **Route Protection**: Protected routes require authentication
- **Auto-logout**: Sessions expire for security

### Data Protection
- **Encrypted Storage**: All sensitive data encrypted
- **Secure Transmission**: HTTPS for all communications
- **Input Validation**: All inputs validated and sanitized
- **Error Handling**: Secure error messages

## 🎯 **Usage Guide**

### 1. **Getting Started**
1. Sign up for a new account
2. Set your master password (remember this!)
3. Start adding vault items

### 2. **Adding Vault Items**
1. Click "Add Item" button
2. Fill in the form:
   - **Title**: Name for the account (e.g., "Gmail Account")
   - **Username**: Your username/email
   - **Password**: Use the password generator or enter manually
   - **URL**: Website URL (e.g., "https://gmail.com")
   - **Notes**: Additional information
3. Click "Add Item"
4. Enter your master password when prompted

### 3. **Using Password Generator**
1. Adjust password length with slider
2. Select character types:
   - Uppercase (A-Z)
   - Lowercase (a-z)
   - Numbers (0-9)
   - Symbols (!@#$)
   - Exclude look-alike characters
3. Click "Generate Password"
4. Copy password to clipboard

### 4. **Managing Vault Items**
1. **View Items**: Click "Decrypt Item" to view details
2. **Edit Items**: Click "Edit" to modify
3. **Delete Items**: Click "Delete" to remove
4. **Copy Data**: Use "Copy" buttons for quick copying

### 5. **Search & Filter**
1. **Search**: Type keywords to find items
2. **Filter**: Use dropdown to filter by type:
   - **All Items**: Show everything
   - **Recent**: Last 7 days
   - **Websites**: Web-based accounts
   - **Applications**: App-based accounts
   - **Accounts**: General accounts

## 🚀 **Deployment**

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Static deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 🧪 **Testing**

### Manual Testing
1. **Authentication**: Test signup/login flow
2. **Vault Operations**: Test CRUD operations
3. **Encryption**: Verify data is encrypted
4. **Search/Filter**: Test search and filtering
5. **Password Generator**: Test password generation

### Security Testing
1. **Encryption**: Verify data is encrypted in database
2. **Authentication**: Test protected routes
3. **Session Management**: Test token expiration
4. **Input Validation**: Test with malicious inputs

## 🔧 **Development**

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit checks

## 📝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Troubleshooting**

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URI
   - Verify network access settings
   - Ensure database user has correct permissions

2. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify environment variables
   - Clear browser localStorage

3. **Encryption Errors**
   - Ensure master password is set
   - Check browser console for errors
   - Verify crypto-js is installed

### Getting Help
- Check the [Issues](https://github.com/yourusername/password-vault/issues) page
- Create a new issue with detailed description
- Include error messages and steps to reproduce

## 🎉 **Acknowledgments**

- **Next.js** - React framework
- **MongoDB** - Database
- **Tailwind CSS** - Styling
- **crypto-js** - Encryption
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens

## 📞 **Contact**

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Project Link**: [https://github.com/yourusername/password-vault](https://github.com/yourusername/password-vault)

---

**⭐ If you found this project helpful, please give it a star!**