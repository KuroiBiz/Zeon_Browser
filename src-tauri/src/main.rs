#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::{Manager, WebviewUrl};

struct BrowserState {
    history: Mutex<Vec<String>>,
}

fn is_ad_url(url: &str) -> bool {
    // intentionally light filtering to avoid breaking websites
    let ad_domains = [
        "doubleclick.net",
        "googlesyndication.com",
        "adsystem.com",
        "adservice.google",
        "adnxs.com",
        "taboola.com",
        "outbrain.com",
    ];

    ad_domains.iter().any(|d| url.contains(d))
}

#[tauri::command]
fn navigate(window: tauri::WebviewWindow, url: String) -> Result<(), String> {
    if is_ad_url(&url) {
        println!("Blocked ad request: {}", url);
        return Ok(());
    }

    window
        .navigate(WebviewUrl::External(url.parse().unwrap()))
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn record_history(state: tauri::State<BrowserState>, url: String) {
    let mut history = state.history.lock().unwrap();
    history.push(url);
}

#[tauri::command]
fn get_history(state: tauri::State<BrowserState>) -> Vec<String> {
    state.history.lock().unwrap().clone()
}

fn main() {
    tauri::Builder::default()
        .manage(BrowserState {
            history: Mutex::new(Vec::new()),
        })
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            println!("Zeon Browser started");

            // small JS hook injected when page loads
            window.eval(
                r#"
                console.log("Zeon Browser runtime active");
                "#,
            )?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            navigate,
            record_history,
            get_history
        ])
        .run(tauri::generate_context!())
        .expect("error while running Zeon Browser");
}