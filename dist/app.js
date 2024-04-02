"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("@/routes/userRoutes"));
const authRoutes_1 = __importDefault(require("@/routes/authRoutes"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/auth', authRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map