"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.signup = exports.login = void 0;
const userModel_1 = __importDefault(require("@/models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};
const signRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};
const createSendToken = (user, status, response) => {
    const accessToken = signToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    const setCommonCookieOptions = (options) => {
        options.httpOnly = true;
    };
    const refreshTokenExpire = process.env.REFRESH_TOKEN_EXIPRES;
    const cookieTokenExpire = process.env.COOKIE_EXPIRES_IN;
    const refreshTokenCookieOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    };
    const accTokenCookieOption = {
        expires: new Date(Date.now() + cookieTokenExpire * 24 * 60 * 60 * 1000),
    };
    if (process.env.NODE_ENV === 'production') {
        setCommonCookieOptions(refreshTokenCookieOptions);
        setCommonCookieOptions(accTokenCookieOption);
    }
    response.cookie('access_token', accessToken);
    response.cookie('refresh_token', refreshToken);
    response.status(status).json({
        status: 'success',
        data: {
            user,
            token: accessToken,
        },
    });
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email }).select('+password');
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password',
        });
    }
    user.password = undefined;
    createSendToken(user, 200, res);
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, passwordConfirm } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide name, email, password and passwordConfirm',
        });
    }
    const user = yield userModel_1.default.create({ name, email, password, passwordConfirm });
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        data: {
            user,
            token,
        },
    });
});
exports.signup = signup;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.access_token) || !(cookies === null || cookies === void 0 ? void 0 : cookies.refresh_token)) {
        return res.sendStatus(204);
    }
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.status(200).json({
        status: 'success',
        message: 'Logout successfully',
    });
});
exports.logout = logout;
//# sourceMappingURL=authController.js.map