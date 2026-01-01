const fs = require('fs')
const { getPlaylistsByUser, getPlaylistTracks } = require('./spotify-api')

/**
 * @param {number} startTimeMs
 * @param {number} endTimeMs
 * @returns a nicely formatted performance message
 */
const getPerformanceMessage = (startTimeMs, endTimeMs) => {
  const diff = endTimeMs - startTimeMs
  const elapsedSeconds = Math.floor(diff / 1000)
  const elapsedMilliSeconds = diff % 1000
  return `(${(elapsedSeconds + elapsedMilliSeconds / 1000).toFixed(3)} s)`
}

/**
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
  console.log('Searching for playlists by', userId, '\n')

  let hasMorePlaylists = true
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
    'Found',
    playlists.length,
    'playlists from',
    userId,
    getPerformanceMessage(startTime, endTime),
  )
  return playlists
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * fetches all tracks for a playlist and writes the name, artists, and added date to a file
 * @param {string} bearerToken
 * @param {string} playlistId
 * @param {string} playlistName
 * @param {string} folderName
 * @param {number} trackLimitPerRequest
 */
const getAndExportPlaylistTracks = async (
  bearerToken,
  playlistId,
  playlistName,
  folderName,
  trackLimitPerRequest = 50,
) => {
  const startTime = Date.now()
  const filename = `${folderName}/${playlistName}.csv`
  fs.appendFileSync(filename, 'Song,Artist,Date Added\n')

  let hasMoreTracks = true
  let trackOffset = 0
  const tracks = []

  while (hasMoreTracks) {
    let res = []
    res = await getPlaylistTracks(
      bearerToken,
      playlistId,
      trackLimitPerRequest,
      trackOffset,
    )

    if (res.status === 200) {
      trackOffset += trackLimitPerRequest
    } else {
      console.log(
        `${playlistName} - ${res.status}, ${res.message} -> sleeping for ${res.retryAfterSeconds}s 😴`,
      )

      await sleep(res.retryAfterSeconds * 1000)
      continue
    }

    if (res.data.length === 0) {
      hasMoreTracks = false
    }

    res.data.forEach((track) => {
      let artists = ''
      track.track.artists.forEach((artist) => {
        artists += artist.name + ', '
      })
      artists = artists.substring(0, artists.length - 2)

      tracks.push(`"${track.track.name}","${artists}","${track.added_at}"\n`)
    })
  }

  // write tracks to file
  fs.appendFileSync(filename, tracks.join(''))

  const endTime = Date.now()
  console.log(
    'Extracted',
    tracks.length,
    'tracks from',
    playlistName,
    getPerformanceMessage(startTime, endTime),
  )
}

module.exports = { getAllPlaylistsByUser, getAndExportPlaylistTracks }
