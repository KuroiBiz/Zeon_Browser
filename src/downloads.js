import { invoke } from "@tauri-apps/api/core"

export async function download(url){

const path = "/tmp/" + Date.now()

try{

await invoke("download",{url,path})

alert("Download finished")

}catch(e){

alert("Download failed")

}

}
