"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnv = exports.checkEnvExampleKeys = exports.checkEnvKeys = void 0;
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const helper_1 = require("../utils/helper");
(0, dotenv_1.config)();
function checkEnvKeys() {
    const envPath = '.env';
    const examplePath = '.env.example';
    const envContent = helper_1.Helper.readFileContent(envPath);
    const exampleContent = helper_1.Helper.readFileContent(examplePath);
    const envKeys = parseEnvKeys(envContent);
    const exampleKeys = parseEnvKeys(exampleContent);
    const missingKeys = exampleKeys.filter((key) => !envKeys.includes(key));
    const extraKeys = envKeys.filter((key) => !exampleKeys.includes(key));
    if (missingKeys.length > 0 || extraKeys.length > 0) {
        console.error('Keys do not match:');
        if (missingKeys.length > 0) {
            console.error('Missing keys:', missingKeys);
        }
        if (extraKeys.length > 0) {
            console.info('Extra keys:', extraKeys);
        }
        return false;
    }
    console.info('Keys match.');
    return true;
}
exports.checkEnvKeys = checkEnvKeys;
function checkEnvExampleKeys() {
    const examplePath = '.env.example';
    const exampleContent = (0, fs_1.readFileSync)(examplePath, 'utf-8');
    const exampleKeys = parseEnvKeys(exampleContent);
    const missingKeys = exampleKeys.filter((key) => !(key in process.env));
    if (missingKeys.length > 0) {
        throw new Error(`Missing keys in process.env: ${missingKeys.join(', ')}`);
    }
    console.info('All keys from .env.example exist in the environment variables.');
}
exports.checkEnvExampleKeys = checkEnvExampleKeys;
function parseEnvKeys(content) {
    const lines = content.split('\n').filter((line) => line.trim() !== '' && !line.startsWith('#'));
    return lines.map((line) => {
        const keyValuePair = line.split('=');
        return keyValuePair[0].trim();
    });
}
function setEnv(envVar, defaultValue) {
    if (!process.env[envVar]) {
        if (defaultValue)
            return defaultValue;
        throw new Error(`Please define the Environment variable"${envVar}"`);
    }
    else
        return process.env[envVar];
}
exports.setEnv = setEnv;
//# sourceMappingURL=env-checker.js.map