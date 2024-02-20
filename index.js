// import type 'module' в package.json для работы с import (ES6)
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as PostController from "./controllers/PostConroller.js";
import * as UserController from "./controllers/UserController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

// ***Подключаемся к нашей базе данных mongoDB
// добавили в ссылке слово 'blog' и в базе данных сам создался
// blog и внутри него User, которого мы создавали
mongoose
  .connect(
    "mongodb+srv://SaintAm:HipPxSM83N5PVFQd@cluster0.njo4u0h.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongoDB ok"))
  .catch((err) => console.log("mongoDB error", err));

// Создаем экспресс приложение (веб-сервер)
const app = express();
// Чтобы ответ, пришедший в json-формате обрабатывался правильно
app.use(express.json());
//Если придется любой запрос на "/uploads", то проверь в этой папке есть то,
// что я передаю
app.use("/uploads", express.static("uploads"));
// Что бы можно было обращатся к бэку с фронта (снимаем блокировку)
app.use(cors());

// Загрузка картинок
const storage = multer.diskStorage({
  // Какой путь (папку) использовать для загрузки
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  // Оригинальное название
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//*************************АВТОРИЗАЦИЯ **************************
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

// *************************РЕГИСТРАЦИЯ*************************
// res - ответ клиенту
// req - что мы получаем
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

//**********************Получение данных о себе **********************
// Когда на адрес придет GET-запрос, CheckAuth проверит, правильный
// ли токен, если да, то продолжится выполнение запроса, выполнится
// ((req,res) => {...} то, что написано после CheckAuth)
app.get("/auth/me", checkAuth, UserController.getMe);

//*********************Загрузка/Получение IMG**********************

//upload.single - mildewear из multer-бибилиотеки
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  // возвращаем клиенту путь, по которому сохранили img
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// *************************ПОСТЫ*************************************
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);

// listen - запускает веб-сервер и выбираем на какой порт надо
// прекрепить приложение, передаем функцию в случае ошибки
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server ok");
});
