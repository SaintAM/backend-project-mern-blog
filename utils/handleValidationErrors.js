import { validationResult } from "express-validator";

export default (req, res, next) => {
    //validationResult - валидирует все ошибки, которые пришли (библиотека)
    const errors = validationResult(req);
    // если ошибки есть (т.е. не пусто) верни статус 400 и верни все
    // ошибки в json-формате
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }
		next()
};
