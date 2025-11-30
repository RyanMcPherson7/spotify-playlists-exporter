const { getPlaylistsByUser } = require('./spotify-api')

/**
 * 
 * @param {number} startTimeMs 
 * @param {number} endTimeMs 
 * @returns a nicely formatted performance message
 */
const getPerformanceMessage = (startTimeMs, endTimeMs) => {
  const diff = endTimeMs - startTimeMs
  const elapsedSeconds = Math.floor(diff / 1000)
  const elapsedMilliSeconds = (diff / 1000) % 1000
  return `(${elapsedSeconds + elapsedMilliSeconds} s)`
}

/**
 * 
 * @param {string} bearerToken 
 * @param {string} userId 
 * @param {number} playlistLimitPerRequest 
 * @returns list of { name, id } of each playlist created by a user
 */
const getAllPlaylistsByUser = async (
  bearerToken,
  userId,
  playlistLimitPerRequest = 50,
) => {
  const startTime = Date.now()
  console.log('Searching for playlists by', userId)

  hasMorePlaylists = true
  let playlistOffset = 0
  const playlists = []

  while (hasMorePlaylists) {
    const res = await getPlaylistsByUser(
      bearerToken,
      userId,
      playlistLimitPerRequest,
      playlistOffset,
    )

    if (res.length === 0) {
      hasMorePlaylists = false
      continue
    }

    res.forEach((playlist) => {
      if (playlist.owner.id === userId) {
        playlists.push({
          name: playlist.name,
          id: playlist.id,
        })
      }
    })

    playlistOffset += playlistLimitPerRequest
  }

  const endTime = Date.now()
  console.log(
    'found',
    playlists.length,
    'playlists from',
    userId,
    getPerformanceMessage(startTime, endTime),
  )
  return playlists
}

module.exports = { getAllPlaylistsByUser }
