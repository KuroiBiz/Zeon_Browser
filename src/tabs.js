import { navigateDirect } from "./navigation.js"

let tabs = []
let current = null

function switchTab(id){

document.querySelectorAll(".tab").forEach(t=>{
t.classList.remove("active")
})

document.querySelectorAll(".view").forEach(v=>{
v.style.display="none"
})

document.getElementById("tabbtn-"+id).classList.add("active")
document.getElementById("view-"+id).style.display="block"

current = id

}

export function setupTabs(){

document.getElementById("newTab").onclick = createTab

createTab()

}

export function createTab(url="https://duckduckgo.com"){

const id = "tab"+Date.now()

tabs.push(id)

const view = document.createElement("div")
view.id = "view-"+id
view.className="view"
view.style.display="none"

document.getElementById("views").appendChild(view)

const tab = document.createElement("div")
tab.className="tab"
tab.id="tabbtn-"+id
tab.innerText="Tab"

tab.onclick = ()=>switchTab(id)

document.getElementById("tabs").appendChild(tab)

switchTab(id)

navigateDirect(url)

}

export function closeTab(){

if(!current) return

document.getElementById("view-"+current).remove()
document.getElementById("tabbtn-"+current).remove()

tabs = tabs.filter(t => t !== current)

if(tabs.length){
switchTab(tabs[tabs.length-1])
}

}
