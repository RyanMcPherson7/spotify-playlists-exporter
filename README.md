## ⬇️ Spotify Playlist Exporter
Tool to export Spotify playlist content to `.csv` files. Extracts the name, artist, and added date.

## 🚀 Install and Use
1. Install [Node.js](https://nodejs.org/en)
2. Clone repo with `git clone https://github.com/RyanMcPherson7/spotify-playlists-exporter.git`
3. cd into project folder
4. Create a `.env` file in the project root with the following variables
    1. `CLIENT_ID` - from [Spotify developer console](https://developer.spotify.com/)
    2. `CLIENT_SECRET` - from [Spotify developer console](https://developer.spotify.com/)
    3. `USER_ID` - Spotify user id, find this by navigating to your profile in the Spotify web player and observing the URL path. e.g. `ryanmcpherson7`
    4. `FOLDER_BASE_PATH` - base path where your folder will be placed, e.g. C:/Users/ryan7/Desktop, ./artifact, .
6. Run `npm i`
7. Run `npm run start`
8. Output folder is located in the root of the project folder and is called `spotify-playlists-<date>`
