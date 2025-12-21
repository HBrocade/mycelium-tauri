# commands - Tauri 命令模块

这是 Tauri 前后端通信的核心模块,定义了所有可从前端调用的 Rust 函数(IPC)。

## 目录结构

```text
commands/
├── mod.rs          # 模块导出文件
└── greet.rs        # 示例问候命令
```

---

## 什么是 Tauri 命令？

Tauri 命令是使用 `#[tauri::command]` 宏标注的 Rust 函数,允许前端通过 IPC(进程间通信)调用。

### 基本概念

- **前端 → 后端**: JavaScript/TypeScript 调用 Rust 函数
- **序列化**: 参数和返回值通过 JSON 序列化传输
- **异步支持**: 支持同步和异步命令

---

## 文件说明

### [mod.rs](./mod.rs)

命令模块的入口文件,负责导出所有命令。

代码结构:

```rust
mod greet;                // 声明 greet 模块

pub use greet::greet;     // 导出 greet 命令
```

添加新命令:

```rust
mod greet;
mod user;        // 1. 声明新模块
mod database;    // 2. 可以有多个模块

pub use greet::greet;
pub use user::*;         // 3. 导出模块中的所有公共函数
pub use database::*;
```

---

### [greet.rs](./greet.rs)

示例问候命令,演示基本的 Tauri 命令结构。

代码:

```rust
/// Greet command
/// Returns a greeting message with the provided name
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

组成部分:

1. **文档注释** (`///`): 描述命令功能
2. **宏标注** (`#[tauri::command]`): 标记为 Tauri 命令
3. **函数签名**:
   - `pub fn` - 公共函数
   - `greet` - 命令名称(前端调用时使用)
   - `name: &str` - 参数(从前端传入)
   - `-> String` - 返回值(发送回前端)
4. **函数体**: 业务逻辑

前端调用:

```typescript
import { invoke } from '@tauri-apps/api/core';

// 调用 greet 命令
const message = await invoke<string>('greet', { name: 'Claude' });
console.log(message); // "Hello, Claude! You've been greeted from Rust!"
```

---

## 命令开发指南

### 1. 创建新命令

步骤:

1. 在 `commands/` 目录创建新文件(如 `user.rs`):

   ```rust
   #[tauri::command]
   pub fn get_user_info(user_id: i32) -> Result<User, String> {
       // 实现逻辑
   }
   ```

2. 在 `mod.rs` 中声明和导出:

   ```rust
   mod user;
   pub use user::*;
   ```

3. 在 `lib.rs` 中注册命令:

   ```rust
   .invoke_handler(tauri::generate_handler![
       greet,
       get_user_info  // 添加新命令
   ])
   ```

4. 前端调用:

   ```typescript
   const user = await invoke('get_user_info', { userId: 123 });
   ```

---

### 2. 命令参数类型

#### 基础类型

```rust
#[tauri::command]
pub fn basic_types(
    s: String,          // 字符串
    i: i32,             // 整数
    f: f64,             // 浮点数
    b: bool,            // 布尔值
) -> String {
    format!("{} {} {} {}", s, i, f, b)
}
```

#### 复杂类型

```rust
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct UserInput {
    name: String,
    age: u32,
}

#[derive(Serialize)]
struct UserOutput {
    id: i32,
    name: String,
}

#[tauri::command]
pub fn create_user(input: UserInput) -> UserOutput {
    UserOutput {
        id: 1,
        name: input.name,
    }
}
```

前端调用:

```typescript
const result = await invoke('create_user', {
  input: { name: 'Alice', age: 30 }
});
```

#### 可选参数

```rust
#[tauri::command]
pub fn optional_params(required: String, optional: Option<i32>) -> String {
    match optional {
        Some(value) => format!("{}: {}", required, value),
        None => required,
    }
}
```

---

### 3. 返回值类型

#### 成功返回

```rust
#[tauri::command]
pub fn simple_return() -> String {
    "Success".to_string()
}
```

#### 错误处理

```rust
#[tauri::command]
pub fn fallible_operation(path: String) -> Result<String, String> {
    if path.is_empty() {
        return Err("Path cannot be empty".to_string());
    }

    std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}
```

前端调用:

```typescript
try {
  const content = await invoke('fallible_operation', { path: '/path/to/file' });
  console.log(content);
} catch (error) {
  console.error('Error:', error);
}
```

#### 复杂返回

```rust
#[derive(Serialize)]
struct Response {
    success: bool,
    data: Option<String>,
    error: Option<String>,
}

#[tauri::command]
pub fn complex_return() -> Response {
    Response {
        success: true,
        data: Some("Data here".to_string()),
        error: None,
    }
}
```

---

### 4. 异步命令

#### 基础异步

```rust
#[tauri::command]
async fn async_operation() -> Result<String, String> {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    Ok("Done".to_string())
}
```

#### 异步文件操作

```rust
#[tauri::command]
async fn read_file_async(path: String) -> Result<String, String> {
    tokio::fs::read_to_string(path)
        .await
        .map_err(|e| e.to_string())
}
```

#### HTTP 请求

```rust
// 需要添加依赖: reqwest = { version = "0.11", features = ["json"] }

#[tauri::command]
async fn fetch_data(url: String) -> Result<String, String> {
    let response = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?;

    response.text()
        .await
        .map_err(|e| e.to_string())
}
```

---

### 5. 访问应用状态

#### 使用 State

```rust
use tauri::State;
use std::sync::Mutex;

struct AppState {
    counter: Mutex<i32>,
}

#[tauri::command]
fn increment(state: State<AppState>) -> i32 {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    *counter
}

#[tauri::command]
fn get_count(state: State<AppState>) -> i32 {
    *state.counter.lock().unwrap()
}
```

在 lib.rs 中管理状态:

```rust
.setup(|app| {
    app.manage(AppState {
        counter: Mutex::new(0),
    });
    Ok(())
})
```

---

### 6. 访问 Window 和 App

#### 获取 Window

```rust
use tauri::Window;

#[tauri::command]
fn window_operation(window: Window) -> String {
    window.set_title("New Title").unwrap();
    "Title updated".to_string()
}
```

#### 获取 AppHandle

```rust
use tauri::AppHandle;

#[tauri::command]
fn app_operation(app: AppHandle) -> String {
    // 访问应用资源
    let config = app.config();
    config.product_name.clone().unwrap_or_default()
}
```

---

### 7. 事件系统

#### 发送事件到前端

```rust
use tauri::Emitter;

#[tauri::command]
async fn long_task(app: AppHandle) -> Result<String, String> {
    // 发送进度更新
    app.emit("progress", 25).unwrap();

    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    app.emit("progress", 50).unwrap();

    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    app.emit("progress", 100).unwrap();

    Ok("Task completed".to_string())
}
```

前端监听:

```typescript
import { listen } from '@tauri-apps/api/event';

const unlisten = await listen<number>('progress', (event) => {
  console.log('Progress:', event.payload);
});

await invoke('long_task');
unlisten();
```

---

## 最佳实践

### 1. 命令组织

```text
commands/
├── mod.rs
├── user.rs          # 用户相关命令
├── database.rs      # 数据库操作
├── file_system.rs   # 文件系统
└── network.rs       # 网络请求
```

### 2. 错误处理

```rust
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
pub enum CommandError {
    #[error("File not found: {0}")]
    FileNotFound(String),

    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("Database error: {0}")]
    Database(String),
}

#[tauri::command]
fn robust_operation(input: String) -> Result<String, CommandError> {
    if input.is_empty() {
        return Err(CommandError::InvalidInput("Input cannot be empty".to_string()));
    }

    // 业务逻辑
    Ok("Success".to_string())
}
```

### 3. 日志记录

```rust
use log::{info, warn, error};

#[tauri::command]
pub fn logged_operation(input: String) -> Result<String, String> {
    info!("Operation started with input: {}", input);

    match perform_operation(&input) {
        Ok(result) => {
            info!("Operation completed successfully");
            Ok(result)
        }
        Err(e) => {
            error!("Operation failed: {}", e);
            Err(e.to_string())
        }
    }
}
```

### 4. 输入验证

```rust
#[tauri::command]
pub fn save_file(path: String, content: String) -> Result<(), String> {
    // 验证路径
    if path.contains("..") || path.starts_with('/') {
        return Err("Invalid path".to_string());
    }

    // 验证内容大小
    if content.len() > 1_000_000 {
        return Err("Content too large".to_string());
    }

    // 执行操作
    std::fs::write(path, content)
        .map_err(|e| e.to_string())
}
```

---

## 性能优化

### 1. 使用引用避免克隆

```rust
// 推荐
#[tauri::command]
pub fn process_string(s: &str) -> String {
    s.to_uppercase()
}

// 避免(不必要的克隆)
#[tauri::command]
pub fn process_string(s: String) -> String {
    s.to_uppercase()
}
```

### 2. 批量操作

```rust
#[tauri::command]
pub fn batch_operation(items: Vec<String>) -> Vec<String> {
    items.iter()
        .map(|item| process_item(item))
        .collect()
}
```

### 3. 后台线程

```rust
use std::thread;

#[tauri::command]
pub async fn heavy_computation(data: Vec<i32>) -> Result<i32, String> {
    let result = tokio::task::spawn_blocking(move || {
        // CPU 密集型任务
        data.iter().sum()
    })
    .await
    .map_err(|e| e.to_string())?;

    Ok(result)
}
```

---

## 调试技巧

### 1. 打印调试

```rust
#[tauri::command]
pub fn debug_command(input: String) -> String {
    println!("Input: {}", input);
    eprintln!("Error stream output");
    input
}
```

### 2. 使用日志

```rust
use log::debug;

#[tauri::command]
pub fn logged_command(input: String) -> String {
    debug!("Command called with: {}", input);
    input
}
```

### 3. 返回详细错误

```rust
#[tauri::command]
pub fn detailed_error(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read {}: {:?}", path, e))
}
```

---

## 相关文档

- [Tauri 命令文档](https://tauri.app/v1/guides/features/command)
- [Serde 序列化](https://serde.rs/)
- [Tokio 异步运行时](https://tokio.rs/)
- [Rust 错误处理](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
