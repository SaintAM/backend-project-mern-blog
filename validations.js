import { body } from "express-validator";

// Проверяет есть ли в теле запроса какая-либо информация
// и валидирует ее (потом будет нам возвращать ответ на клиент какие
// ошибки мы допустили)
export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль минимум 5 символов").isLength({ min: 5 }),
];
export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль минимум 5 символов").isLength({ min: 5 }),
    body("fullName", "Укажите имя").isLength({ min: 3 }),
    body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];
export const postCreateValidation = [
    body("title", "Введите заголовоу статьи").isLength({min:3}).isString(),
    body("text", "Введите текст статьи").isLength({ min: 5 }).isString(),
    body("tags", "Неверный формат тегов").optional().isString(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];