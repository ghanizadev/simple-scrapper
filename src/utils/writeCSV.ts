import path from "path";
import fs from "fs";

export default {
    async to(name: string, data: string) {
        const directory = path.resolve("public", "exports", name);
        fs.writeFileSync(directory, data);
    }
}