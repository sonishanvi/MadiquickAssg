# 🚀 Quick Setup Guide

## **Step 1: Set up MongoDB Atlas (Free)**

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Choose the free tier (M0 Sandbox)

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free)
   - Select a region close to you
   - Click "Create"

3. **Set up Database Access:**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (remember these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Set up Network Access:**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `password-vault`

## **Step 2: Update Environment Variables**

1. **Open `.env.local` file in your project**
2. **Replace the MongoDB URI:**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/password-vault?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

## **Step 3: Run the Application**

```bash
# Start the development server
npm run dev

# Open your browser
# Go to http://localhost:3000
```

## **Step 4: Test the Application**

1. **Sign up** for a new account
2. **Generate a password** using the generator
3. **Add a vault item** with the generated password
4. **Test search and filtering**

## **Troubleshooting**

### **If you see "500 Internal Server Error":**
- Check your MongoDB connection string
- Make sure your database user has read/write permissions
- Verify your network access allows connections from anywhere

### **If you see "Authorization token required":**
- Make sure you're logged in
- Check if the token is stored in localStorage
- Try logging out and logging back in

### **If fonts are too light:**
- The font visibility issues have been fixed
- Refresh your browser to see the changes

## **Example MongoDB Connection String:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/password-vault?retryWrites=true&w=majority
```

**Replace:**
- `myuser` with your database username
- `mypassword` with your database password  
- `cluster0.abc123` with your actual cluster details
