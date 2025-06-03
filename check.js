import fetch from "node-fetch"
import fs from "fs"
import { onStatusChange } from "./callback.js"

const STEAM_ID = process.env.STEAM_ID
const STEAM_API_KEY = process.env.STEAM_API_KEY
const response = await fetch(
  "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?" +
  `key=${STEAM_API_KEY}&` +
  `steamids=${STEAM_ID}`
)
const data = await response.json()
const player = data.response.players[0]
const currentState = player.personastate === 0 || !player.gameextrainfo ? "0" : "1"
const stateFile = "./status.txt"
if (!fs.existsSync(stateFile)) {
  fs.writeFileSync(stateFile, currentState)
  console.log("Initial run: state saved, no trigger.")
} else {
  const prevState = fs.readFileSync(stateFile, "utf-8")
  if (prevState !== currentState) {
    await onStatusChange(currentState, player)
    console.log(`Steam status changed: ${currentState}`)
  } else {
    // console.log("No status change.")
  }
  fs.writeFileSync(stateFile, currentState)
}
