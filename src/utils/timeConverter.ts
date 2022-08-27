export const millisecondsToString = (ms: number): string => {
    let time = "";
    const hours = Math.floor(ms / 3600000);
    if (hours > 0) {
        if (hours < 10)
            time = "0"
        time += hours; 
    }

    let rest = ms % 3600000;
    const minutes = Math.floor(rest / 60000);
    if (minutes > 0) {
        if (time)
            time += ":";

        if (minutes < 10)
            time += "0"
        time += minutes; 
    }

    rest = ms % 60000;
    const seconds = Math.ceil(rest / 1000);
    if (seconds > 0) {
        if (time)
            time += ":";

        if (seconds < 10)
            time += "0"
        time += seconds; 
    }

    return time || "unknown";
}