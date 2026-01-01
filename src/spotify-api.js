const axios = require('axios')

/**
 * @param {Object} error
 */
const logError = (error) => {
  console.error(
    'Status code:',
    error.response.status,
    error.response.statusText,
  )

  const hours = Math.floor(error.response.headers['retry-after'] / 60 / 60)
  const minutes = Math.ceil((error.response.headers['retry-after'] / 60) % 60)
  console.error(
    'Please wait',
    hours,
    'hours and',
    minutes,
    'minutes before trying again',
  )
}

/**
 * @returns bearer token from Spotify
 */
const getBearerToken = async () => {
  try {
    const res = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
      data: 'grant_type=client_credentials',
    })

    return res.data.access_token
  } catch (err) {
    logError(err)
  }
}

/**
 * @param {string} bearerToken
 * @param {string} userId
 * @param {number} limit - max number of playlists to return, max is 50
 * @param {number} offset - playlist offset from the first, default is 0
 * @returns limit number of playlists from a particular user
 */
const getPlaylistsByUser = async (
  bearerToken,
  userId,
  limit = 50,
  offset = 0,
) => {
  const res = await axios({
    method: 'get',
    url: `https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}&offset=${offset}`,
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  })

  return res.data.items
}

/**
 * @param {string} bearerToken
 * @param {string} playlistId
 * @param {number} limit - max number of playlists to return, max is 50
 * @param {number} offset - playlist offset from the first, default is 0
 * @returns limit number of playlist tracks from a particular playlist, explicitly only
 *          returns date added, song name, and artists
 */
const getPlaylistTracks = async (
  bearerToken,
  playlistId,
  limit = 50,
  offset = 0,
) => {
  const fieldsFilter = encodeURIComponent(
    'items(added_at,track(name,artists(name)))',
  )

  let res = {}
  try {
    res = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=${fieldsFilter}&limit=${limit}&offset=${offset}`,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
  } catch (error) {
    return {
      ...error.response.data.error,
      retryAfterSeconds: error.response.headers['retry-after'],
    }
  }

  return {
    status: 200,
    data: res.data.items,
  }
}

module.exports = { getBearerToken, getPlaylistsByUser, getPlaylistTracks }
