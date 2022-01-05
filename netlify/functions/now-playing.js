const {getSecrets} = require("@netlify/functions");
const SpotifyWebApi = require("spotify-web-api-node")

module.exports.handler = async function handler(event, context) {

  const spotifyApi = new SpotifyWebApi();

  const secrets = await getSecrets(event);
  if(secrets.spotify) {
    spotifyApi.setAccessToken(secrets.spotify.bearerToken)

    const currentTrack = await spotifyApi.getMyCurrentPlayingTrack()

    const response = {
      href: currentTrack.body.item.href,
      name: currentTrack.body.item.name
    }

    if(currentTrack) {
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      } 
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "failed to read playing track"})
    }
  } else {
    return {
      statusCode: 401,
      body: "You can't access this"
    }
  }
}