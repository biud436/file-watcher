import * as fs from "fs";
import * as path from "path";

interface WatchOption {
    watchDir: string;
}

export class Config {
    private option!: WatchOption;

    constructor() {}

    readWatchDir() {
        let configPath = path.join(__dirname, "config", "../config.json");
        if (!fs.existsSync(configPath)) {
            console.warn("config.json 파일이 존재하지 않습니다");
            configPath = <string>process.env.WATCH_DIR;
        }
        if (!fs.existsSync(configPath)) {
            throw new Error("WATCH_DIR 환경 변수가 존재하지 않습니다");
        }
        this.option = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "config", "../config.json"),
                "utf8"
            )
        );
        const { watchDir } = this.option;

        return watchDir;
    }
}
