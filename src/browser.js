import { invoke } from "@tauri-apps/api/core"

let tabs = []
let currentTab = null

const COOKIE_WHITELIST = [
  "google.com",
  "github.com",
  "youtube.com"
]

function isWhitelisted(url){
  return COOKIE_WHITELIST.some(site => url.includes(site))
}

async function navigate(){

  let input = document.getElementById("url").value

  const finalUrl = await invoke("navigate", { input })

  await invoke("record_history", { url: finalUrl })

  const frame = document.getElementById(currentTab)
  frame.src = finalUrl

  cleanCookies(finalUrl)
}

function cleanCookies(url){

  if(isWhitelisted(url)) return

  const cookies = document.cookie.split(";")

  for(const cookie of cookies){
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

function newTab(url="https://google.com"){

  const id = "tab-"+Date.now()

  const frame = document.createElement("iframe")
  frame.id = id
  frame.src = url
  frame.className = "view"

  document.getElementById("views").appendChild(frame)

  tabs.push(id)
  switchTab(id)
}

function switchTab(id){

  document.querySelectorAll(".view").forEach(v=>{
    v.style.display="none"
  })

  document.getElementById(id).style.display="block"
  currentTab = id
}

window.onload = ()=>{
  newTab()
}