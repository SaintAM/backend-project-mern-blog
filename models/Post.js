import mongoose from "mongoose";

// Создаем модель пользователя (авторизация/регистрация) в mongoDB
// type, required, unique - это настройки для полей
// required - обязательное поле
// unique - уникальное значение
// timestamps - так же добавляем время создания и обновления
const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Post", PostSchema);
