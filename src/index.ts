import * as fs from "fs";
import * as path from "path";
import { v4 } from "uuid";
import * as cp from "child_process";
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
            const config = new Config();
            const watchFolder = config.readWatchDir();
            const action = config.readAction();

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

                            // 액션 실행
                            for (let i = 0; i < action.length; i++) {
                                try {
                                    let triggerAction = action[i].slice(0);

                                    if (process.platform === "win32") {
                                        triggerAction = triggerAction.replace(
                                            /\//g,
                                            "\\"
                                        );
                                    }

                                    // 루트 권한 인가?
                                    if (process.getuid() !== 0) {
                                        throw new Error(
                                            "루트 권한을 가지고 있지 않습니다."
                                        );
                                    }

                                    const buf = cp.execSync(triggerAction, {
                                        cwd: watchFolder,
                                        encoding: "utf-8",
                                    });
                                    const stdout = buf;

                                    console.log(stdout);
                                } catch (e) {
                                    console.warn(e);
                                }
                            }
                        })
                    );
                });

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
