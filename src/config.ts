import * as fs from "fs";
import * as path from "path";
import { Watch } from "typescript";

interface WatchOption {
    linux: Platform;
    windows: Platform;
}

interface Platform {
    watchDir: string;
    action: string[];
}

export class Config {
    private option!: WatchOption;

    constructor() {}

    /**
     * 설정 파일의 경로를 반환합니다.
     *
     * @returns {string}
     */
    readConfigPath() {
        const root = process.cwd();
        let configPath = path.resolve(root, "config", "config.json");

        if (!fs.existsSync(configPath)) {
            console.warn("config.json 파일이 존재하지 않습니다");
            configPath = <string>process.env.WATCH_DIR;
        }

        if (!fs.existsSync(configPath)) {
            throw new Error("WATCH_DIR 환경 변수가 존재하지 않습니다");
        }

        return configPath;
    }

    readOption() {
        let configPath = this.readConfigPath();

        this.option = JSON.parse(fs.readFileSync(configPath, "utf8"));

        return this.option;
    }

    /**
     * 액션을 반환합니다.
     *
     * @returns
     */
    readAction() {
        this.readOption();

        let action = [];

        if (process.platform === "linux") {
            action = this.option.linux.action;
        } else if (process.platform === "win32") {
            action = this.option.windows.action;
        } else {
            throw new Error("Unsupported platform");
        }

        return action;
    }

    /**
     * 감시할 폴더를 반환합니다.
     *
     * @returns
     */
    readWatchDir() {
        this.readOption();

        let watchDir = "./";
        if (process.platform === "linux") {
            watchDir = this.option.linux.watchDir;
        } else if (process.platform === "win32") {
            watchDir = this.option.windows.watchDir;
        } else {
            throw new Error("Unsupported platform");
        }

        return watchDir;
    }
}
