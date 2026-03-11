import { invoke } from "@tauri-apps/api/core"

const COOKIE_WHITELIST = [
"google.com",
"github.com",
"youtube.com",
"twitter.com"
]

function isWhitelisted(url){
return COOKIE_WHITELIST.some(site => url.includes(site))
}

async function navigate(){

let input = document.getElementById("url").value

const finalUrl = await invoke("navigate",{input})

await invoke("record_history",{url:finalUrl})

cleanCookies(finalUrl)
}

function cleanCookies(url){

if(isWhitelisted(url)) return

const cookies = document.cookie.split(";")

for(const cookie of cookies){

const eqPos = cookie.indexOf("=")
const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie

document.cookie = name+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}
}

function reloadTab(){
invoke("reload")
}

document.getElementById("url").addEventListener("keydown",(e)=>{
if(e.key==="Enter"){
navigate()
}
})

window.navigate = navigate
window.reloadTab = reloadTab