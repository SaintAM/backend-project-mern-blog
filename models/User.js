import mongoose from "mongoose";

// Создаем модель пользователя (авторизация/регистрация) в mongoDB
// type, required, unique - это настройки для полей
// required - обязательное поле
// unique - уникальное значение
// timestamps - так же добавляем время создания и обновления
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", UserSchema);
