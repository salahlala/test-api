"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const port = process.env.PORT || 3000;
const optionsConnect = {
    useNewUrlParser: true,
    useUnifiedTopology: false,
};
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect(process.env.MONGODB_URI, optionsConnect).then(() => {
    console.log('DB connection successful!');
});
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=index.js.map