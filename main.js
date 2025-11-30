require('dotenv').config()
const { getAllPlaylistsByUser } = require('./src/util')
const { getBearerToken } = require('./src/spotify-api')

const main = async () => {
  const bearerToken = await getBearerToken()

  const playlists = await getAllPlaylistsByUser(
    bearerToken,
    process.env.USER_ID,
    50,
  )
}

// TODO: each file should be created under a folder named with today's date
// TODO: for each playlist in list
// TODO: create a file named after the playlist
// TODO: while there's content from the track requests
// TODO: for each track in response
// TODO: create structure and append to new list
// TODO: write the structured list.join('')
// TODO: increment offset

main()
