require('dotenv').config()
const fs = require('fs')
const {
  getAllPlaylistsByUser,
  getAndExportPlaylistTracks,
} = require('./src/util')
const { getBearerToken } = require('./src/spotify-api')

const main = async () => {
  const bearerToken = await getBearerToken()

  const playlists = await getAllPlaylistsByUser(
    bearerToken,
    process.env.USER_ID,
    50,
  )

  const now = new Date()
  const date = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`
  const folderName = `./spotify-playlists-${date}`
  fs.mkdirSync(folderName)

  await Promise.all(
    playlists.map((playlist) =>
      getAndExportPlaylistTracks(
        bearerToken,
        playlist.id,
        playlist.name,
        folderName,
        50,
      ),
    ),
  )

  console.log('\nSuccessfully extracted all playlist tracks, happy listening :D')
}

main()
