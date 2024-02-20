import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

export const login = async (req, res) => {
  try {
    // Ищем в нашей моделе User.js пользователя с такой почтой
    const user = await UserModel.findOne({ email: req.body.email });
    // Если нету такого пользователя, возвращаем ошибку
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    // Валидируем наш пароль
    // Сходится ли пароль клиента с данными, которые в БД
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    // Если пароль не верный выдаем ошибку
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    // Если логин и пароль верны, создаем токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret228",
      {
        expiresIn: "30d",
      }
    );
    // Вытаскиваем все данные, кроме пароля и передаем на клиент
    // (нет смысла на клиент передавать хэш-пароль)
    const { passwordHash, ...userData } = user._doc;
    // Если ошибок нет, то на клиент возвращаем:
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const register = async (req, res) => {
  try {
    // Шифруем пароль
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Подготавливаем документ на создание пользователя
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    // Создаем самого пользователя в mongoDB и сохр в базе данных
    const user = await doc.save();
    // После того, как мы проверили на ошибки, шифранули пароль,
    // и создали и сохранили user в базе данных, создаем токен
    // шифруем только id (после того как расшифруем токен и там id)
    // нам хватит информации для проверки авторизации
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret228",
      {
        expiresIn: "30d",
      }
    );
    // Вытаскиваем все данные, кроме пароля и передаем на клиент
    // (нет смысла на клиент передавать хэш-пароль)
    // в "_doc" все наши данные без "мусора"
    const { passwordHash, ...userData } = user._doc;
    // Если ошибок нет, то на клиент возвращаем:
    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // Проверяем, если такой user
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    return res.status(500).json({
      message: "Нет доступа",
    });
  }
};
