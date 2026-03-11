import { createTab, closeTab } from "./tabs.js"
import { navigateDirect } from "./navigation.js"
import { invoke } from "@tauri-apps/api/core"

export function setupUI(){

document.getElementById("go").onclick = go
document.getElementById("back").onclick = ()=>history.back()
document.getElementById("forward").onclick = ()=>history.forward()
document.getElementById("reload").onclick = ()=>invoke("reload")

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.key==="t"){
e.preventDefault()
createTab()
}

if(e.ctrlKey && e.key==="w"){
e.preventDefault()
closeTab()
}

if(e.ctrlKey && e.key==="r"){
e.preventDefault()
invoke("reload")
}

})

}

function go(){

const url = document.getElementById("url").value
navigateDirect(url)

}
