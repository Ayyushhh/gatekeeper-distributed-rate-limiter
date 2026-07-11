"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URL = "http://localhost:8085/rate-limit/check";
async function main() {
    const requests = [];
    for (let i = 0; i < 100; i++) {
        requests.push(fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clientKey: "ayush",
            }),
        }).then(async (r) => {
            console.log("Status:", r.status);
            const text = await r.text();
            console.log(text);
            return {
                allowed: r.status === 200,
            };
        }));
    }
    const results = await Promise.all(requests);
    const allowed = results.filter((r) => r.allowed).length;
    const denied = results.filter((r) => !r.allowed).length;
    console.log({
        allowed,
        denied,
    });
}
main();
//# sourceMappingURL=stress.js.map