import * as fs from "fs";
import { EventEmitter } from "events";
import * as cron from "node-cron";
import { CronScheduler } from "./scheduler";
import Time from "./timer";

namespace EntryPoint {
    interface WatcherFileLink {
        filename: string;
        touch: number;
    }

    const TIME_INTERVAL = 2000;

    export class DebounceWatcher extends EventEmitter {
        private _touch: number;
        private _file: any;
        private _isWatch: boolean;
        private _watcher: WatcherFileLink[];

        constructor() {
            super();
            this._touch = Time.now();
            this._file = null;
            this._isWatch = false;
            this._watcher = [];
        }

        public touch() {
            const touch = this._touch;
            this._touch = Time.now() - touch;
            return this._touch;
        }

        private addDebounce(filename: string, touch: number): WatcherFileLink {
            const wathcerObject = <WatcherFileLink>{
                filename,
                touch,
            };
            this._watcher.push(wathcerObject);

            return wathcerObject;
        }

        private sortDebounce(): WatcherFileLink[] {
            this._watcher.sort((a: WatcherFileLink, b: WatcherFileLink) => {
                return b.touch - a.touch;
            });

            return this._watcher;
        }

        private removeOldWatcher() {
            const now = Time.now();
            const maxTime = now - TIME_INTERVAL;

            this._watcher = this._watcher.filter((watcher: WatcherFileLink) => {
                return watcher.touch > maxTime;
            });

            return this._watcher;
        }

        public addWatch(file: any) {
            if (!fs.existsSync(file)) {
                return;
            }

            this._file = file;

            fs.watch(this._file, (eventType: any, filename: any) => {
                const lastTouch = Time.now();
                const wathcerObject = this.addDebounce(filename, lastTouch);
            });

            // ??? ??? ??? ??? ??? ??????
            cron.schedule(CronScheduler.TWO_SECOND, () => {
                this.removeOldWatcher();
                this.sortDebounce();

                const firstWatcher = this._watcher[0];
                if (firstWatcher) {
                    this.emit("change", firstWatcher.filename);
                }
            });

            this._isWatch = true;
        }
    }
}

export = EntryPoint.DebounceWatcher;
