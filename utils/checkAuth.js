import jwt from "jsonwebtoken";
// Cоздаем middleware - функция посредник
// CheckAuth.js решает, можно ли возвращать секрет инфу или нет

export default (req, res, next) => {
    // Из запросов вытаскиваем токен, удаляем слово "Bearer"
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    //

    if (token) {
        try {
            // декодируем токен
            const decoded = jwt.verify(token, "secret228");
            req.userId = decoded._id;
            next();
        } catch (error) {
            return res.status(402).json({
                message: "Попробуйте еще",
            });
        }
    } else {
        return res.status(403).json({
            message: "Нет доступа",
        });
    }

    //возвращаем клиенту токен
    // res.send(token)
    // next();
};
