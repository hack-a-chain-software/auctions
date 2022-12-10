// This file does the following:
//
// 1. Iterate over all files in clients_config, each of which
//    should represent a different Vercel project of the app
//    with its own environment variables
// 2. Deploys the current code to that Vercel project by prebuilding
//    it with its environment variables
// 3. Depending on the PRODUCTION environment variable, the code will
//    be deployed as a preview or as a production version
const sh = require("shelljs");
const fs = require('fs');
const path = require('path');
const { parse } = require('dotenv');

// Script can be run in preview or test mode
const production = sh.env["PRODUCTION"]

// For the duration of this script, we want to operate from within the
// Rust project's folder. Let's change into that directory.
sh.cd(__dirname);

// Start iteration between all different client_config environment files
(async () => {
    const moveFrom = "../clients_config";
    const moveTo = __dirname;
    // Get the files as an array
    const files = await fs.promises.readdir(moveFrom);

    // Loop them all with the new for...of
    for (const file of files) {
        // Get the full paths
        const fromPath = path.join(moveFrom, file);
        const toPath = path.join(moveTo, ".env");

        // Now copy to .env in web folder
        fs.copyFileSync(fromPath, toPath);

        // Now read project_id and perform Vercel CLI commands

        // set project_id as env for deployment
        const envFile = parse(fs.readFileSync(".env"));
        sh.env["VERCEL_PROJECT_ID"] = envFile.VERCEL_PROJECT_ID

        console.log("-----------------");
        console.log(`Deploying ${file}`);
        console.log("-----------------");

        // execute prebuild and deploy
        sh.exec(`
                vercel pull --yes --token=${sh.env["VERCEL_TOKEN"]}
            `)
        sh.exec(`
                vercel build ${production ? "--prod" : ""} --token=${sh.env["VERCEL_TOKEN"]}    
            `);
        sh.exec(`
                vercel deploy ${production ? "--prod" : ""} --prebuilt --token=${sh.env["VERCEL_TOKEN"]}    
            `);

        // clear project_id from env
        sh.env["VERCEL_PROJECT_ID"] = undefined;

    }

})();