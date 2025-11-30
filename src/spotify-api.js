const axios = require('axios')
require('dotenv').config()

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
 * @param {string} artistId
 * @param {string} bearerToken
 * @returns artist data for specified artistId
 */
const getArtist = async (artistId, bearerToken) => {
  try {
    const token = bearerToken

    const res = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  } catch (err) {
    logError(err)
  }
}

/**
 * @param {string} artistId
 * @param {string} bearerToken
 * @returns related artists list for specified artistId
 */
const getRelatedArtists = async (artistId, bearerToken) => {
  try {
    const token = bearerToken

    const res = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  } catch (err) {
    logError(err)
  }
}

module.exports = { getBearerToken, getArtist, getRelatedArtists }
