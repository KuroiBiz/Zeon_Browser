#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::{HashMap, HashSet};
use std::sync::Mutex;
use tauri::{Manager, State};
use url::Url;

use tokio::fs::File;
use tokio::io::AsyncWriteExt;

struct BrowserState {
    tabs: Mutex<HashMap<String,String>>,
    history: Mutex<Vec<String>>,
    bookmarks: Mutex<Vec<String>>,
    cookie_whitelist: Mutex<HashSet<String>>,
}

fn normalize_input(input:&str)->String{

    if input.starts_with("http://") || input.starts_with("https://"){
        input.to_string()
    }
    else if input.contains('.') && !input.contains(' '){
        format!("https://{}",input)
    }
    else{
        format!("https://duckduckgo.com/?q={}",input.replace(" ","+"))
    }
}

#[tauri::command]
fn new_tab(state:State<BrowserState>,url:String)->String{

    let id=format!("tab-{}",uuid::Uuid::new_v4());

    state.tabs.lock().unwrap().insert(id.clone(),url);

    id
}

#[tauri::command]
fn close_tab(state:State<BrowserState>,id:String){

    state.tabs.lock().unwrap().remove(&id);
}

#[tauri::command]
fn navigate(window:tauri::WebviewWindow,input:String)->Result<String,String>{

    let url=normalize_input(&input);

    let parsed=Url::parse(&url).map_err(|e|e.to_string())?;

    window.navigate(parsed).map_err(|e|e.to_string())?;

    Ok(url)
}

#[tauri::command]
fn record_history(state:State<BrowserState>,url:String){

    state.history.lock().unwrap().push(url);
}

#[tauri::command]
fn add_bookmark(state:State<BrowserState>,url:String){

    state.bookmarks.lock().unwrap().push(url);
}

#[tauri::command]
fn get_bookmarks(state:State<BrowserState>)->Vec<String>{

    state.bookmarks.lock().unwrap().clone()
}

#[tauri::command]
async fn download(url:String,path:String)->Result<(),String>{

    let response=reqwest::get(url).await.map_err(|e|e.to_string())?;

    let bytes=response.bytes().await.map_err(|e|e.to_string())?;

    let mut file=File::create(path).await.map_err(|e|e.to_string())?;

    file.write_all(&bytes).await.map_err(|e|e.to_string())?;

    Ok(())
}

#[tauri::command]
fn add_cookie_whitelist(state:State<BrowserState>,site:String){

    state.cookie_whitelist.lock().unwrap().insert(site);
}

#[tauri::command]
fn is_cookie_allowed(state:State<BrowserState>,url:String)->bool{

    let whitelist=state.cookie_whitelist.lock().unwrap();

    whitelist.iter().any(|site|url.contains(site))
}

#[tauri::command]
fn reload(window:tauri::WebviewWindow){

    let _=window.eval("window.location.reload()");
}

fn main(){

    tauri::Builder::default()

        .manage(BrowserState{

            tabs:Mutex::new(HashMap::new()),
            history:Mutex::new(Vec::new()),
            bookmarks:Mutex::new(Vec::new()),
            cookie_whitelist:Mutex::new(HashSet::new())

        })

        .invoke_handler(tauri::generate_handler![

            new_tab,
            close_tab,
            navigate,
            record_history,
            add_bookmark,
            get_bookmarks,
            download,
            reload,
            add_cookie_whitelist,
            is_cookie_allowed

        ])

        .run(tauri::generate_context!())

        .expect("browser failed");
}