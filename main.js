require('dotenv').config()
const fs = require('fs')
const {
  getAllPlaylistsByUser,
  getAndExportPlaylistTracks,
} = require('./src/util')
const { getBearerToken } = require('./src/spotify-api')

const main = async () => {
  // generate access token
  const bearerToken = await getBearerToken()

  // fetch playlists by user
  const playlists = await getAllPlaylistsByUser(
    bearerToken,
    process.env.USER_ID,
  )

  // compute folder name
  const now = new Date()
  const date = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`
  const folderName = `${process.env.FOLDER_BASE_PATH}/spotify-playlists-${date}`

  // create base folder
  fs.rmSync(folderName, { recursive: true, force: true })
  fs.mkdirSync(folderName)

  // export tracks and write to files
  await Promise.all(
    playlists.map((playlist) =>
      getAndExportPlaylistTracks(
        bearerToken,
        playlist.id,
        playlist.name,
        folderName,
      ),
    ),
  )

  console.log(
    '\nSuccessfully extracted all playlist tracks, happy listening :D',
  )
}

main()
