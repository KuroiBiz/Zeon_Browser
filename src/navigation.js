import { invoke } from "@tauri-apps/api/core"
import { cleanCookies } from "./cookies.js"

function normalize(input){

if(input.startsWith("http://") || input.startsWith("https://")){
return input
}

if(input.includes(".") && !input.includes(" ")){
return "https://" + input
}

return "https://duckduckgo.com/?q=" + encodeURIComponent(input)

}

export function setupNavigation(){

const bar = document.getElementById("url")

bar.addEventListener("keydown", async (e)=>{

if(e.key === "Enter"){

let input = bar.value
let url = normalize(input)

const final = await invoke("navigate",{input:url})

await invoke("record_history",{url:final})

cleanCookies(final)

}

})

}

export async function navigateDirect(url){

const final = await invoke("navigate",{input:url})

await invoke("record_history",{url:final})

cleanCookies(final)

}
