// server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db'); // ✅ import connectDB

const PORT = process.env.PORT || 5001;

// ✅ connect to MongoDB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Failed to connect to MongoDB", err);
});
