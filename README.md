# Dependencies
Node.js  
react-player
node-sass-chokidar
webpack

# Assumptions  
Given url was unreachable due to cross origin limitations. Contents of url was saved in songs.json in /src  
CORS Chrome addon was used to test url using fetch function. This is implemented but commented out due to issues with  
the youtube player and this addon.

# Future Enhancements
Smoother animation of progress bar  
Capo information  
Add additional chords to chords map constant to allow other songs to be loaded  
More unit testing for response & player  
Some general styling around the player and other elements

# chord-app-dk - To install from scratch
Node.js installed
npm install -g create-react-app  
create-react-app chord-app-dk  
cd chord-app-dk  
npm start  
npm install react-player --save  
npm install --save webpack -S  
npm install --save node-sass-chokidar  

Add to 'scripts' section on package.json:  
"build-css": "node-sass-chokidar src/ -o src/",  
"watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive", 

npm run watch-css  
copy contents of src and public on github

# chord-app-dk - To install from github
Node.js & Git installed  
git clone https://github.com/DavidKil/chord-app-dk.git  
cd chord-app-dk  
npm install  
npm start  
open http://localhost:3000  
