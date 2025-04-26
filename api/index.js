import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import Post from "./models/Post.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || "asd8sfc7shvsl";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));

const port = process.env.PORT || 4000;


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");

    app.listen(port, () => {
      console.log(`Sunucu ${port} portunda başarıyla çalışıyor`);
      console.log(`Test URL: http://localhost:${port}/api-test`);
    });
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
  });

  //authentication endpoints
app.post("/register", async (req, res) => {
  console.log("Register isteği alındı:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Kullanıcı adı ve şifre gereklidir" });
  }

  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    console.log("Kullanıcı oluşturuldu:", userDoc);
    res.json({ message: "Kullanıcı başarıyla oluşturuldu", id: userDoc._id });
  } catch (e) {
    console.error("Register hatası:", e);

    if (e.code === 11000) {
      return res
        .status(400)
        .json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
    }

    res.status(400).json({ error: "Kayıt işlemi başarısız" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Kullanıcı adı ve şifre gereklidir" });
  }

  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json({ error: "Kullanıcı bulunamadı" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, userDoc.password);

    if (isPasswordCorrect) {
      const token = jwt.sign({ username, id: userDoc._id }, secret, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        id: userDoc._id,
        username,
        token,
      });
    } else {
      res.status(400).json({ error: "Yanlış şifre" });
    }
  } catch (e) {
    console.error("Login hatası:", e);
    res.status(500).json({ error: "Giriş işlemi başarısız" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Çıkış yapıldı" });
});

//api endpoints

app.get("/profile", (req, res) => {
  const tokenFromCookie = req.cookies.token;
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ error: "Yetkilendirme gerekli" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.error("Token doğrulama hatası:", err);
      return res.status(401).json({ error: "Geçersiz token" });
    }

    res.json(info);
  });
});


const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Sadece resim dosyaları yüklenebilir!"), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }
    
    const { originalname, path: filePath } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = filePath + "." + ext;
    fs.renameSync(filePath, newPath);
    
    const { title, summary, content } = req.body;
    
    if (!title || !summary || !content) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    
    try {
      // Since your Post schema requires an ObjectId for author
      // you can either:
      // 1. Create a default user ID for anonymous posts
      // 2. Or make author field nullable in your schema
      
      // Option 1: Using a default user ID (replace with a valid ObjectId from your User collection)
      const defaultAuthorId = '6804eece1b188289b5f12420'; // This MUST be a valid ObjectId
      
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: defaultAuthorId, // Use the default author ID
      });
      
      res.json(postDoc);
    } catch (error) {
      console.error("Post creation error:", error);
      res.status(500).json({ error: "An error occurred while creating the post" });
    }
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "An error occurred while uploading the file" });
  }
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const {originalname, path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }

    // Get post info directly from request body
    const {id, title, summary, content} = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    try {
      const postDoc = await Post.findById(id);
      
      if (!postDoc) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Skip author verification for now
      // Update the post directly
      await Post.findByIdAndUpdate(id, {
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });

      // Fetch the updated post to return in the response
      const updatedPost = await Post.findById(id);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Error updating post', error: error.message });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

export default app;
