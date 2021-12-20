import * as fs from "fs";
import * as path from "path";

interface WatchOption {
    watchDir: string;
}

export class Config {
    private option!: WatchOption;

    constructor() {}

    readWatchDir() {
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
