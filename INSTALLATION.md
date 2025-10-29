# Installation Guide - Lindsay Precast Operations Control System

This guide will help you set up the Lindsay Precast Operations Control System with MongoDB.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

## Step-by-Step Installation

### 1. MongoDB Installation and Setup

#### On macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### On Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a Windows service

#### On Linux (Ubuntu/Debian):
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Verify MongoDB is running:
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

### 2. Project Setup

#### Clone or download the project:
```bash
cd operation-control-system
```

#### Install dependencies:
```bash
npm install
```

### 3. Environment Configuration

The project already includes a `.env` file with default settings for local development:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lindsay-precast
JWT_SECRET=lindsay_precast_super_secret_jwt_key_change_in_production_2024
NODE_ENV=development
```

**Important for Production:**
- Change `JWT_SECRET` to a strong, unique secret
- Update `MONGODB_URI` if using a remote MongoDB instance
- Set `NODE_ENV=production`

### 4. Seed the Database

Populate the database with initial data (users, jobs, inventory, etc.):

```bash
npm run seed
```

You should see output confirming:
- 5 users created
- 4 employees created
- 6 customers created
- 6 jobs created
- 5 inventory items created
- 2 production schedules created

### 5. Start the Server

#### Development mode (with auto-restart):
```bash
npm run dev
```

#### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

### 6. Access the Application

Open your web browser and navigate to:
```
http://localhost:5000
```

## Default Login Credentials

Use these credentials to log in:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| jsmith | password | Project Manager |
| mjones | password | Project Manager |
| rwilliams | password | Project Manager |
| kdavis | password | Project Manager |

## Troubleshooting

### MongoDB Connection Issues

**Error: "Connection refused"**
- Ensure MongoDB is running: `sudo systemctl status mongodb` (Linux) or `brew services list` (macOS)
- Check if MongoDB is listening on port 27017: `netstat -an | grep 27017`

**Error: "Authentication failed"**
- If you've set up MongoDB authentication, update `MONGODB_URI` in `.env`:
  ```
  MONGODB_URI=mongodb://username:password@localhost:27017/lindsay-precast
  ```

### Port Already in Use

If port 5000 is already in use:
1. Change the `PORT` in `.env` to a different port (e.g., 5001)
2. Restart the server

### Module Not Found Errors

If you see "Cannot find module" errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Seed Script Fails

If the seed script fails:
1. Make sure MongoDB is running
2. Check the MongoDB URI in `.env`
3. Try dropping the database first:
   ```bash
   mongosh lindsay-precast --eval "db.dropDatabase()"
   npm run seed
   ```

## Database Management

### View database contents:
```bash
mongosh lindsay-precast
```

Then in the MongoDB shell:
```javascript
// Show all collections
show collections

// Query examples
db.users.find().pretty()
db.jobs.find().pretty()
db.inventory.find().pretty()
```

### Reset database:
```bash
mongosh lindsay-precast --eval "db.dropDatabase()"
npm run seed
```

### Backup database:
```bash
mongodump --db lindsay-precast --out ./backups/
```

### Restore database:
```bash
mongorestore --db lindsay-precast ./backups/lindsay-precast/
```

## Production Deployment

### Using MongoDB Atlas (Cloud)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lindsay-precast
   NODE_ENV=production
   ```

### Environment Variables for Production

Create a `.env.production` file:
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_unique_secret_key_here
NODE_ENV=production
```

### Using PM2 for Process Management

Install PM2:
```bash
npm install -g pm2
```

Start the application:
```bash
pm2 start server.js --name lindsay-precast
pm2 save
pm2 startup
```

## Next Steps

1. **Explore the Dashboard**: Log in and familiarize yourself with the interface
2. **Create a Test Job**: Use the `create_job` command in the terminal
3. **Review API Documentation**: Check `README.md` for API endpoints
4. **Customize**: Modify the system to match your specific needs
5. **Set Up Backups**: Configure regular database backups
6. **Enable SSL**: For production, set up HTTPS

## Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Review the troubleshooting section above
3. Check MongoDB logs: `tail -f /var/log/mongodb/mongod.log` (Linux)
4. Verify all prerequisites are installed correctly

## Security Notes

⚠️ **Important Security Reminders:**

1. Change default passwords before deploying to production
2. Use a strong, unique JWT_SECRET
3. Enable MongoDB authentication in production
4. Use environment variables for sensitive data
5. Keep dependencies updated: `npm audit` and `npm update`
6. Use HTTPS in production
7. Implement rate limiting for API endpoints
8. Regular database backups

---

**Congratulations!** Your Lindsay Precast Operations Control System should now be running with MongoDB.

