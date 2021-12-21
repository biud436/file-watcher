import * as fs from "fs";
import * as path from "path";

interface WatchOption {
    linux: Platform;
    windows: Platform;
}

interface Platform {
    watchDir: string;
}

export class Config {
    private option!: WatchOption;

    constructor() {}

    readWatchDir() {
        const root = process.cwd();
        let configPath = path.resolve(root, "config", "config.json");
        console.log(configPath);
        if (!fs.existsSync(configPath)) {
            console.warn("config.json 파일이 존재하지 않습니다");
            configPath = <string>process.env.WATCH_DIR;
        }
        if (!fs.existsSync(configPath)) {
            throw new Error("WATCH_DIR 환경 변수가 존재하지 않습니다");
        }
        this.option = JSON.parse(fs.readFileSync(configPath, "utf8"));

        let watchDir = "./";
        if (process.platform === "linux") {
            watchDir = this.option.linux.watchDir;
        } else if (process.platform === "win32") {
            watchDir = this.option.windows.watchDir;
        }

        return watchDir;
    }
}
