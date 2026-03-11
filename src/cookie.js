const COOKIE_WHITELIST = [
"google.com",
"github.com",
"youtube.com"
]

function allowed(url){

return COOKIE_WHITELIST.some(site => url.includes(site))

}

export function cleanCookies(url){

if(allowed(url)) return

const cookies = document.cookie.split(";")

for(const cookie of cookies){

const eq = cookie.indexOf("=")
const name = eq > -1 ? cookie.substr(0,eq) : cookie

document.cookie = name +
"=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"

}

}
