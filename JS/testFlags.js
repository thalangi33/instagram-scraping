const fs = require("fs-extra");
const util = require("util");

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

async function readStatus() {
    const data = await fs.promises.readFile("status.txt", "utf8");
    return data;
}

async function writeStatus(jsonInfo) {
    fs.writeFileSync("status.txt", JSON.stringify(jsonInfo),(e) => {
        if (err) {
            console.log(err);
        }
    })
}
async function statusGet(){
    let temp = {}
    await readStatus().then(data => {
        //console.log(data)
        temp = JSON.parse(data)
    });
    return temp
}

async function main(){
    let temp = await statusGet()
    console.log("hello" + temp.nextMaxId)
}

main()

