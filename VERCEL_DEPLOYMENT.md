# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **MongoDB Atlas Cluster** - A MongoDB database (https://www.mongodb.com/cloud/atlas)
3. **Git Repository** - Your code pushed to GitHub (or GitLab/Bitbucket)

## Step 1: Prepare Your MongoDB

### Create a MongoDB Atlas Cluster (if you haven't already):

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Add a database user with a strong password
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### Important: Whitelist Vercel IP

1. In MongoDB Atlas, go to "Network Access"
2. Add IP address: `0.0.0.0/0` (allows all IPs - Vercel uses dynamic IPs)
3. Or add specific Vercel IPs (check Vercel's IP ranges)

## Step 2: Generate a Strong JWT Secret

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep this secret safe - you'll need it for Vercel.

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Push your code to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Connect your GitHub account
   - Select the project
   - Choose framework (Node.js)

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"
5. Continue to next step (Set Environment Variables)

## Step 4: Set Environment Variables in Vercel

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB connection string from Step 1 |
| `JWT_SECRET` | Your generated JWT secret from Step 2 |
| `NODE_ENV` | `production` |

4. Click "Save"

## Step 5: Deploy

1. Go back to "Deployments" tab
2. Click "Redeploy" (to apply environment variables)
3. Wait for the build to complete (usually 2-3 minutes)

## Step 6: Test Your Deployment

Once deployment is complete:

1. Click the deployment URL to open your app
2. Log in with your credentials
3. Try creating a customer, PM, and job
4. Verify the dashboard displays correctly

## Troubleshooting

### "Cannot find module" errors
- Make sure all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`

### MongoDB Connection Errors
- Verify `MONGODB_URI` environment variable is set correctly
- Check MongoDB whitelist includes Vercel IPs (`0.0.0.0/0`)
- Ensure database user has correct password

### API returns 404
- Check that `vercel.json` is configured correctly
- Verify routes are using `/api/` prefix
- Check server logs in Vercel dashboard

### Frontend shows "Connection error"
- Open browser DevTools (F12)
- Check Console for errors
- Verify API calls are going to correct URL
- Check that `config.js` is properly loaded

## Local Development (After Deploying to Vercel)

Your local development still works as before:

```bash
# Create .env file with your local MongoDB
echo "MONGODB_URI=mongodb://localhost:27017/precast" > .env
echo "JWT_SECRET=dev-secret-key" >> .env

# Start development server
npm run dev
```

Your frontend will detect `localhost` and use the local API.

## Production Environment Variables

Your `vercel.json` automatically passes these to Vercel:
- `MONGODB_URI` → MongoDB database connection
- `JWT_SECRET` → JWT token signing secret
- `NODE_ENV` → Set to "production"

## Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS instructions from your domain registrar
4. Wait for DNS propagation (can take up to 48 hours)

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Keep `JWT_SECRET` private** - Only store in Vercel environment variables
3. **Use strong MongoDB password** - At least 16 characters
4. **Enable CORS** - Already configured in `server.js` for production
5. **Use HTTPS** - Vercel provides free SSL certificates

## Performance Optimization

For production, consider:

1. **MongoDB Indexes** - Already configured in models
2. **Connection Pooling** - Mongoose handles this
3. **CDN** - Vercel serves static files from CDN automatically
4. **Caching** - Consider adding Redis for session/data caching

## Rollback

If something goes wrong:

1. In Vercel dashboard, go to "Deployments"
2. Find a previous successful deployment
3. Click the three dots and select "Redeploy"

## Monitoring

Monitor your deployed app:

1. Go to "Settings" → "Analytics" in Vercel dashboard
2. Watch real-time requests, status codes, and latency
3. Enable email notifications for deployment failures

## Next Steps

After successful deployment:

1. Share the live URL with your team
2. Set up a custom domain if desired
3. Configure monitoring and alerts
4. Plan for scaling if needed

---

**Questions?** Check Vercel documentation: https://vercel.com/docs
