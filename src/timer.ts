namespace EntryPoint.Time {
    export function now() {
        if (typeof performance !== "undefined") {
            return performance.now();
        }
        return Date.now();
    }
}

export = EntryPoint.Time;
