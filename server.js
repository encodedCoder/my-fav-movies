const os = require("os");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5412;

// Serve static files from the 'images' folder
app.use("/images", express.static(path.join(__dirname, "images")));

// API endpoint to get image filenames
app.get("/api/images", (req, res) => {
  const imagesDir = path.join(__dirname, "images");
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Unable to scan directory" });
    }
    // Filter images by common extensions
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    );
    res.json(imageFiles);
  });
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Function to get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name of Object.keys(interfaces)) {
    for (let iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// Starts the server and logs the local IP address and port to the console.
app.listen(PORT, "0.0.0.0", () => {
  const localIP = getLocalIP();
  console.log(`Server is running on http://${localIP}:${PORT}`);
});
