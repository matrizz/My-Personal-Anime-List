#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::time::Duration;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let splashscreen = app.get_webview_window("splashscreen").unwrap();
            let main = app.get_webview_window("main").unwrap();

            tauri::async_runtime::spawn(async move {
                std::thread::sleep(Duration::from_secs(5));
                splashscreen.close().unwrap();
                main.show().unwrap();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
