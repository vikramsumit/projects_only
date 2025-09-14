# TODO: Switch auth_system to MongoDB

- [x] Update package.json: remove pg, add mongoose
- [x] Update config/database.js: replace PostgreSQL connection with MongoDB connection using mongoose
- [x] Rewrite models/user.js: use mongoose schema for User model
- [x] Update controllers/authControllers.js: adjust for MongoDB user model (return objects instead of arrays)
- [x] Update server.js: use connectDB instead of createTable
- [ ] Set MONGO_URI in .env (e.g., mongodb://username:password@localhost:27017/auth_system)
- [ ] Ensure MongoDB is running locally
- [ ] Test the application
