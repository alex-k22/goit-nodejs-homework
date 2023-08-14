import { HttpError } from "../helpers/index.js";

const isEmptyBody = async(req, res, next) => {
    const {length} = Object.keys(req.body);
    if (!length) {
        next(HttpError(400, "missing fields"));
    }
    next();
}

export default isEmptyBody;