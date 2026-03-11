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

function cleanCookies(url){

if(isWhitelisted(url)) return

const cookies = document.cookie.split(";")

for(const cookie of cookies){
const eqPos = cookie.indexOf("=")
const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
}
}

async function navigate(){

let input = document.getElementById("url").value

if(!input.startsWith("http") && !input.includes(".")){
input = "https://duckduckgo.com/?q=" + encodeURIComponent(input)
}

const finalUrl = await invoke("navigate", { input })

await invoke("record_history", { url: finalUrl })

const frame = document.getElementById(currentTab)
frame.src = finalUrl

cleanCookies(finalUrl)
}

function newTab(url="https://duckduckgo.com"){

const id = "tab-"+Date.now()

const frame = document.createElement("iframe")
frame.id = id
frame.src = url
frame.className = "view"

document.getElementById("views").appendChild(frame)

const tabBtn = document.createElement("div")
tabBtn.className = "tab"
tabBtn.innerText = "New Tab"
tabBtn.onclick = ()=>switchTab(id)

tabBtn.id = "btn-"+id
document.getElementById("tabs").appendChild(tabBtn)

tabs.push(id)
switchTab(id)
}

function switchTab(id){

document.querySelectorAll(".view").forEach(v=>{
v.style.display="none"
})

document.querySelectorAll(".tab").forEach(t=>{
t.classList.remove("active")
})

document.getElementById(id).style.display="block"
document.getElementById("btn-"+id).classList.add("active")

currentTab = id
}

function closeTab(id){

if(!id) return

document.getElementById(id).remove()
document.getElementById("btn-"+id).remove()

tabs = tabs.filter(t => t !== id)

if(tabs.length){
switchTab(tabs[tabs.length-1])
}
}

function reloadTab(){

if(!currentTab) return

const frame = document.getElementById(currentTab)
frame.src = frame.src
}

function goBack(){
const frame = document.getElementById(currentTab)
frame.contentWindow.history.back()
}

function goForward(){
const frame = document.getElementById(currentTab)
frame.contentWindow.history.forward()
}

document.getElementById("url").addEventListener("keydown",(e)=>{
if(e.key==="Enter"){
navigate()
}
})

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.key.toLowerCase()==="r"){
e.preventDefault()
reloadTab()
}

if(e.key==="F5"){
e.preventDefault()
reloadTab()
}

if(e.ctrlKey && e.key.toLowerCase()==="t"){
e.preventDefault()
newTab()
}

if(e.ctrlKey && e.key.toLowerCase()==="w"){
e.preventDefault()
closeTab(currentTab)
}

if(e.ctrlKey && e.key.toLowerCase()==="l"){
e.preventDefault()
const bar=document.getElementById("url")
bar.focus()
bar.select()
}

})

window.onload = ()=>{
newTab()
}