# fragments

lint Script to run ESlint from the command line:
"lint": "eslint --config .eslintrc.js src/\*\*"

To run ESlint:
npn run lint

The start script for server in package.json goes as:
"start": "node src/server.js",
and to start it:
npm start

dev starts the server using nodemon and watches changes in src folder, keeping in sync, Script is:
"dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src",
And to run it,
npm run dev

debug is same as dev but starts node inspector on port 9229 which can help attaching a debugger, Script is:
"debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
And to run it,
npm run debug
