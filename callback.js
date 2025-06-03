import fetch from "node-fetch"

const ATP_HOST = process.env.ATP_HOST
const ATP_IDENTIFIER = process.env.ATP_IDENTIFIER
const ATP_PASSWORD = process.env.ATP_PASSWORD

export async function onStatusChange (status, player) {
  console.log(`Callback received status: ${status}, game: ${player?.gameextrainfo}`)
  if (status === "1") {
    await sendPost(player)
  }
}

async function sendPost (player) {
  const data = await createSession(ATP_IDENTIFIER, ATP_PASSWORD)
  const text = `${player.realname || data.handle} が ${player?.gameextrainfo} を始めました。\n\n※これは steam-bluesky-notifier による自動送信です。\nhttps://github.com/mimonelu/steam-bluesky-notifier`
  await createPost(data.accessJwt, data.did, text)
}

async function createSession (identifier, password) {
  const response = await fetch(`${ATP_HOST}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier,
      password,
    })
  })
  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`)
  }
  const data = await response.json()
  return data
}

async function createPost (accessJwt, did, text) {
  const response = await fetch(`${ATP_HOST}/xrpc/com.atproto.repo.createRecord`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessJwt}`,
    },
    body: JSON.stringify({
      repo: did,
      collection: "app.bsky.feed.post",
      record: {
        $type: "app.bsky.feed.post",
        text,
        createdAt: new Date().toISOString(),
        via: "steam-bluesky-notifier",
      }
    })
  })
  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.statusText}`)
  }
  const data = await response.json()
  return data
}
