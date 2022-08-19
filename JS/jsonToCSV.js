const fs = require("fs-extra");
const { Parser } = require("json2csv");

async function readResponse() {
    const data = await fs.promises.readFile(
        "./fetch_data/response/1_response.json",
        "utf8"
    );
    return data;
}

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

async function main() {
    let temp;
    let KOL = "53yfp";
    await readResponse().then((data) => {
        temp = JSON.parse(data);
    });
    const fields = [
        "profileUrl",
        "username",
        "fullName",
        "imgUrl",
        "id",
        "isPrivate",
        "isVerified",
        "query",
    ];
    const opts = { fields };

    const parser = new Parser(opts);
    // console.log(JSON.stringify(temp));
    // console.log("hell")

    data = temp["users"];

    for (let item of data) {
        renameKey(item, "full_name", "fullName");
        renameKey(item, "profile_pic_url", "imgUrl");
        renameKey(item, "pk", "id");
        renameKey(item, "is_private", "isPrivate");
        renameKey(item, "is_verified", "isVerified");
        Object.assign(item, {
            profileUrl: `https://www.instagram.com/${item.username}`,
            query: `https://www.instagram.com/${KOL}`,
        });
    }
    // data["fullName"] = data["full_name"];
    // delete data["full_name"];

    const updatedJson = JSON.stringify(data);

    console.log(updatedJson);
    const cvs = parser.parse(data);
    console.log(cvs);
    await fs.promises.writeFile("testewew.csv", cvs);
}

main();
