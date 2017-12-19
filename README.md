# chord-app-dk
npm install -g create-react-app
create-react-app chord-app-dk
cd chord-app-dk
npm start
npm install react-player --save
npm install --save webpack -S
npm install --save node-sass-chokidar

Add to package.json:
"build-css": "node-sass-chokidar src/ -o src/",
"watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive",
npm run watch-css
