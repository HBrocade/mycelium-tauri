# src - Rust 源代码

Tauri 应用的 Rust 后端源代码,负责系统级功能、IPC 通信和插件管理。

## 目录结构

```text
src/
├── main.rs          # 应用入口点
├── lib.rs           # Tauri 核心库和配置
└── commands/        # Tauri 命令模块(前后端通信)
    ├── mod.rs      # 命令模块导出
    └── greet.rs    # 示例问候命令
```

---

## 核心文件

### [main.rs](./main.rs)

应用的入口点,负责启动 Tauri 应用。

代码结构:

```rust
// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  app_lib::run();
}
```

功能说明:

- **Windows 子系统配置**: 在 Release 模式下隐藏控制台窗口
- **委托执行**: 调用 `lib.rs` 的 `run()` 函数
- **最小化入口**: 保持入口文件简洁,核心逻辑在 lib.rs

注意事项:

- `#![cfg_attr(...)]` 是 Rust 的条件编译属性
- 仅在 Windows Release 构建时生效
- 开发模式下保留控制台用于调试

---

### [lib.rs](./lib.rs)

Tauri 应用的核心库文件,包含所有主要逻辑。

#### 1. 模块导入

```rust
mod commands;              // 导入命令模块
use commands::*;           // 导入所有命令
use tauri::Manager;        // Tauri 管理器 trait

#[cfg(debug_assertions)]
use tauri_plugin_global_shortcut::GlobalShortcutExt;
```

#### 2. 入口函数

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Tauri 应用构建和运行
}
```

`#[cfg_attr(mobile, tauri::mobile_entry_point)]` 支持移动平台入口。

#### 3. Builder 构建

```rust
let mut builder = tauri::Builder::default();
```

创建 Tauri 应用构建器,用于配置插件和功能。

#### 4. Debug 模式插件配置

全局快捷键插件:

```rust
#[cfg(debug_assertions)]
{
    builder = builder.plugin(
        tauri_plugin_global_shortcut::Builder::new()
            .with_handler(|app, _shortcut, event| {
                use tauri_plugin_global_shortcut::ShortcutState;
                if event.state == ShortcutState::Pressed {
                    if let Some(window) = app.get_webview_window("main") {
                        if window.is_devtools_open() {
                            let _ = window.close_devtools();
                        } else {
                            window.open_devtools();
                        }
                    }
                }
            })
            .build(),
    );
}
```

功能:

- 仅在 Debug 模式下启用
- 处理快捷键按下事件
- 切换开发者工具的打开/关闭状态

#### 5. Setup 钩子

```rust
.setup(|app| {
    // 日志插件(Debug 模式)
    if cfg!(debug_assertions) {
        app.handle().plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )?;
    }

    // 注册 F12 快捷键
    #[cfg(debug_assertions)]
    {
        app.global_shortcut().register("F12")?;
    }

    Ok(())
})
```

功能:

- 应用启动时执行一次
- 注册日志插件(Info 级别)
- 注册 F12 快捷键

#### 6. 命令注册

```rust
.invoke_handler(tauri::generate_handler![greet])
```

注册可从前端调用的 Tauri 命令。当前注册了 `greet` 命令。

添加新命令:

```rust
.invoke_handler(tauri::generate_handler![
    greet,
    new_command1,
    new_command2
])
```

#### 7. 运行应用

```rust
.run(tauri::generate_context!())
.expect("error while running tauri application");
```

生成 Tauri 上下文并启动应用,失败时 panic。

---

## 插件系统

### 当前启用的插件

#### 1. tauri-plugin-global-shortcut (Debug)

**依赖**: `tauri-plugin-global-shortcut = "2"`

功能:

- 全局快捷键监听
- 当前配置:F12 切换开发者工具

使用方式:

```rust
// 注册快捷键
app.global_shortcut().register("F12")?;

// 监听快捷键事件
.with_handler(|app, _shortcut, event| {
    // 处理逻辑
})
```

#### 2. tauri-plugin-log (Debug)

**依赖**: `tauri-plugin-log = "2"`

功能:

- 日志记录到文件和控制台
- 当前级别:Info

使用方式:

```rust
use log::{info, warn, error, debug, trace};

info!("应用已启动");
warn!("配置文件未找到,使用默认值");
error!("连接数据库失败: {}", err);
```

---

## 条件编译

### Debug vs Release

Debug 模式特性:

```rust
#[cfg(debug_assertions)]
{
    // 仅在 Debug 模式编译
    // - 全局快捷键
    // - 日志插件
    // - 开发者工具
}
```

Release 模式特性:

```rust
#[cfg(not(debug_assertions))]
{
    // 仅在 Release 模式编译
    // - Windows 无控制台窗口
    // - 移除调试功能
}
```

### 平台特定代码

移动平台:

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
```

Windows:

```rust
#[cfg(target_os = "windows")]
{
    // Windows 特定代码
}
```

macOS:

```rust
#[cfg(target_os = "macos")]
{
    // macOS 特定代码
}
```

---

## 开发指南

### 添加新命令

1. 在 `commands/` 创建新文件(如 `user.rs`)
2. 在 `commands/mod.rs` 添加 `pub mod user;`
3. 在 `commands/mod.rs` 导出命令:`pub use user::*;`
4. 在 `lib.rs` 注册命令:

   ```rust
   .invoke_handler(tauri::generate_handler![greet, user_command])
   ```

详见 [commands/README.md](./commands/README.md)

### 添加插件

```rust
// 1. 添加依赖到 Cargo.toml
// tauri-plugin-fs = "2"

// 2. 在 lib.rs 中注册
builder = builder.plugin(tauri_plugin_fs::init());
```

### 添加全局状态

```rust
use tauri::State;

// 定义状态
struct AppState {
    counter: std::sync::Mutex<i32>,
}

// 在 setup 中管理状态
.setup(|app| {
    app.manage(AppState {
        counter: std::sync::Mutex::new(0),
    });
    Ok(())
})

// 在命令中使用
#[tauri::command]
fn increment(state: State<AppState>) -> i32 {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    *counter
}
```

### 日志最佳实践

```rust
use log::{info, warn, error};

// 使用结构化日志
info!("用户登录: user_id={}, ip={}", user_id, ip);

// 错误处理
if let Err(e) = some_operation() {
    error!("操作失败: {}", e);
}

// 性能监控
let start = std::time::Instant::now();
perform_task();
info!("任务完成,耗时: {:?}", start.elapsed());
```

---

## 错误处理

### Result 类型

```rust
use tauri::Result;

#[tauri::command]
fn risky_operation() -> Result<String> {
    // 使用 ? 运算符传播错误
    let data = std::fs::read_to_string("file.txt")?;
    Ok(data)
}
```

### 自定义错误

```rust
use serde::Serialize;

#[derive(Debug, Serialize)]
struct CustomError {
    code: i32,
    message: String,
}

impl std::fmt::Display for CustomError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for CustomError {}
```

---

## 性能优化

### 异步操作

```rust
#[tauri::command]
async fn async_operation() -> Result<String> {
    let data = tokio::fs::read_to_string("file.txt").await?;
    Ok(data)
}
```

### 后台线程

```rust
use std::thread;

#[tauri::command]
fn heavy_computation() -> String {
    thread::spawn(|| {
        // 计算密集型任务
    })
    .join()
    .unwrap()
}
```

---

## 安全注意事项

1. **输入验证**: 始终验证前端传入的数据

   ```rust
   #[tauri::command]
   fn save_file(path: String, content: String) -> Result<()> {
       // 验证路径安全性
       if path.contains("..") {
           return Err("Invalid path".into());
       }
       // 执行操作
   }
   ```

2. **权限检查**: 确保命令具有必要的权限配置

3. **敏感数据**: 不要记录敏感信息

   ```rust
   // 错误示例
   info!("用户密码: {}", password); // 不要这样做!

   // 正确示例
   info!("用户登录成功: user_id={}", user_id);
   ```

---

## 相关文档

- [Tauri 命令开发](./commands/README.md)
- [Tauri 官方文档](https://tauri.app/)
- [Rust 异步编程](https://rust-lang.github.io/async-book/)
- [日志框架文档](https://docs.rs/log/)
