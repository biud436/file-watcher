import * as fs from "fs";
import * as path from "path";
import { v4 } from "uuid";
import { EventEmitter } from "events";
import DebounceWathcer from "./debounce_watcher";
import TaskJob from "./job";
import { Config } from "./config";

namespace EntryPoint {
    export class App extends EventEmitter {
        private _watcher = new DebounceWathcer();

        constructor() {
            super();
            this.listen();
        }

        /**
         * Listen to events
         */
        listen() {
            this.on("ready", () => {
                this._watcher.on("change", (filename: string) => {
                    console.clear();

                    TaskJob.addTask(
                        new Promise((resolve, reject) => {
                            if (!filename) {
                                reject("error " + filename);
                            }
                            console.log(filename + "가 변경되었습니다");
                            resolve(filename);
                        })
                    );
                });

                const config = new Config();
                const watchFolder = config.readWatchDir();

                if (!fs.existsSync(watchFolder)) {
                    throw new Error(
                        watchFolder + "는 존재하지 않는 폴더입니다"
                    );
                }
                this._watcher.addWatch(watchFolder);
            });
        }

        emitAllEvents() {
            this.emit("ready");
        }

        start() {
            this.emitAllEvents();
        }
    }
}

const app = new EntryPoint.App();
app.start();
