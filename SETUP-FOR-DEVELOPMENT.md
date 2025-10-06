# 🚀 Development Setup Guide

## **📋 Quick Setup for Local Development**

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/password-vault.git
cd password-vault
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**

#### **Create .env.local manually**
Create `.env.local` with your actual credentials:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/password-vault?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-actual-jwt-secret

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-actual-nextauth-secret
```

### **4. Start Development Server**
```bash
npm run dev
```

### **5. Open Application**
Navigate to [http://localhost:3000](http://localhost:3000)

## **🔒 Security Notes**

- **`.env.local`** - Contains your real credentials (NOT committed to Git)
- **`.env.example`** - Contains placeholder values (committed to Git)
- **`.env.real`** - Backup of your real credentials (NOT committed to Git)

## **🛠️ Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Check for linting errors
npm run lint:fix        # Fix linting errors
npm run type-check      # Check TypeScript types

# Security
npm run security-check  # Check for hardcoded credentials
npm run pre-commit     # Run all checks before commit
```

## **📁 File Structure**

```
password-vault/
├── .env.example        # Template with placeholder values (committed)
├── .env.local         # Your real credentials (NOT committed)
├── .gitignore         # Ensures .env files are not committed
├── README.md          # Project documentation
├── SECURITY.md        # Security guidelines
├── DEPLOYMENT.md      # Deployment guide
└── src/               # Source code
```

## **🚨 Important Security Reminders**

1. **Never commit `.env.local`** - It contains your real credentials
2. **Only commit `.env.example`** - It has placeholder values
3. **Always use environment variables** - Never hardcode credentials
4. **Run security check** before committing: `npm run security-check`

## **🔧 Troubleshooting**

### **MongoDB Connection Issues**
- Check your MongoDB URI in `.env.local`
- Ensure your MongoDB Atlas cluster is running
- Verify network access settings in MongoDB Atlas

### **Authentication Issues**
- Check JWT_SECRET is set in `.env.local`
- Clear browser localStorage
- Restart the development server

### **Build Issues**
- Run `npm run type-check` to check TypeScript errors
- Run `npm run lint` to check for linting errors
- Ensure all environment variables are set

## **📞 Getting Help**

- Check the [README.md](README.md) for detailed documentation
- Review [SECURITY.md](SECURITY.md) for security guidelines
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Create an issue on GitHub if you need help

---

**Happy coding! 🚀**
