import { setupNavigation } from "./navigation.js"
import { setupTabs } from "./tabs.js"
import { setupUI } from "./ui.js"

function startBrowser(){

setupTabs()
setupNavigation()
setupUI()

}

window.addEventListener("DOMContentLoaded", startBrowser)