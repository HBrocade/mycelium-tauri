# src-tauri - Tauri 后端代码

这是 Mycelium Tauri 应用的 Rust 后端代码目录,负责系统级功能和前后端通信。

## 目录结构

```text
src-tauri/
├── src/                    # Rust 源代码
│   ├── main.rs            # 应用入口
│   ├── lib.rs             # Tauri 核心库
│   └── commands/          # Tauri 命令(IPC)
├── Cargo.toml             # Rust 包配置
├── Cargo.lock             # 依赖锁文件
├── build.rs               # 构建脚本
├── tauri.conf.json        # Tauri 应用配置
├── capabilities/          # 权限配置
├── icons/                 # 应用图标
├── gen/                   # 自动生成文件
└── target/                # 编译输出目录
```

---

## 核心文件说明

### Cargo.toml

Rust 项目配置文件,定义依赖和元数据。

项目信息:

```toml
[package]
name = "mycelium-tauri"
version = "0.1.0"
edition = "2021"
```

主要依赖:

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tauri = { version = "2.9.2", features = ["devtools"] }
tauri-plugin-log = "2"
tauri-plugin-global-shortcut = "2"
```

---

### tauri.conf.json

Tauri 应用配置文件。

关键配置:

| 配置项 | 值 | 说明 |
| ------ | -- | ---- |
| `productName` | `"mycelium-tauri"` | 应用名称 |
| `version` | `"0.1.0"` | 版本号 |
| `identifier` | `"com.tauri.dev"` | 应用唯一标识 |
| `frontendDist` | `"../dist"` | 前端构建输出路径 |
| `devUrl` | `"http://localhost:1420"` | 开发服务器地址 |
| `beforeDevCommand` | `"yarn dev:web"` | 开发前执行的命令 |
| `beforeBuildCommand` | `"yarn build"` | 构建前执行的命令 |

窗口配置:

```json
{
  "windows": [{
    "title": "Mycelium",
    "width": 800,
    "height": 600,
    "titleBarStyle": "Overlay",
    "hiddenTitle": true
  }]
}
```

`titleBarStyle: "Overlay"` 允许自定义标题栏(macOS 风格)。

---

### build.rs

Tauri 构建脚本,在编译前执行。

```rust
fn main() {
  tauri_build::build()
}
```

自动处理图标生成、资源嵌入等构建任务。

---

## 源代码目录 (src/)

详细说明见 [src/README.md](./src/README.md)

### 主要文件

- **[main.rs](./src/main.rs)** - 应用入口,调用 lib.rs
- **[lib.rs](./src/lib.rs)** - Tauri 核心逻辑和插件配置
- **[commands/](./src/commands/)** - Tauri 命令模块

---

## 配置目录

### capabilities/

权限配置目录,定义应用可访问的系统资源。

**[default.json](./capabilities/default.json)**:

```json
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "log:default",
    "global-shortcut:default"
  ]
}
```

### gen/schemas/

Tauri 自动生成的 JSON Schema 文件,用于配置验证。

---

## 图标资源 (icons/)

多平台应用图标资源。

| 文件 | 平台 | 说明 |
| ---- | ---- | ---- |
| `icon.icns` | macOS | macOS 应用图标 |
| `icon.ico` | Windows | Windows 应用图标 |
| `icon.png` | Linux/通用 | 通用图标 |
| `32x32.png` | 所有平台 | 小尺寸图标 |
| `128x128.png` | 所有平台 | 中等尺寸图标 |
| `128x128@2x.png` | macOS/Retina | 高清图标 |
| `Square*.png` | Windows Store | Windows 应用商店图标 |

---

## 编译输出 (target/)

Rust 编译输出目录,包含构建产物。

```text
target/
├── debug/              # 调试构建
│   ├── mycelium-tauri  # 可执行文件
│   └── deps/           # 依赖库
└── release/            # 发布构建(优化版)
```

**注意**: 该目录已在 `.gitignore` 中忽略,不应提交到版本控制。

---

## 技术栈

### Rust 版本

- **Edition**: 2021
- **推荐 MSRV**: 1.77.2+

### Tauri 框架

- **版本**: 2.9.2
- **特性**: 启用 devtools(开发者工具)

### 核心依赖

#### serde / serde_json

- JSON 序列化/反序列化
- 用于前后端数据交互

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct User {
    name: String,
    age: u32,
}
```

#### tauri-plugin-log

- 日志记录插件
- 支持文件日志和控制台输出

#### tauri-plugin-global-shortcut

- 全局快捷键支持
- 当前配置:F12 打开开发者工具(仅 Debug 模式)

---

## 开发工作流

### 1. 开发模式

```bash
# 在项目根目录运行
yarn dev

# 或直接运行 Tauri
cd src-tauri
cargo tauri dev
```

流程:

1. 执行 `beforeDevCommand`: 启动 Vite 开发服务器
2. 编译 Rust 代码
3. 启动 Tauri 窗口加载 `http://localhost:1420`

### 2. 生产构建

```bash
yarn build

# 或
cd src-tauri
cargo tauri build
```

流程:

1. 执行 `beforeBuildCommand`: Vite 构建前端
2. 编译 Rust 代码(Release 模式)
3. 打包应用(.app / .exe / .AppImage 等)

### 3. 仅编译 Rust

```bash
cd src-tauri
cargo build          # 调试构建
cargo build --release # 发布构建
cargo check          # 快速检查(不生成二进制)
```

### 4. 添加依赖

```bash
cd src-tauri
cargo add <crate-name>
```

---

## 调试功能

### F12 开发者工具

在 Debug 模式下,按 F12 打开 Chrome DevTools。

实现位置: [src/lib.rs](./src/lib.rs)

```rust
#[cfg(debug_assertions)]
let builder = builder
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .setup(|app| {
        app.global_shortcut().on_shortcut("F12", |_app, _shortcut| {
            if let Some(window) = _app.get_webview_window("main") {
                window.open_devtools();
            }
        })?;
        Ok(())
    });
```

### 日志查看

使用 `tauri-plugin-log` 记录日志:

```rust
use log::{info, warn, error};

info!("应用启动");
warn!("警告信息");
error!("错误信息");
```

---

## 常见任务

### 添加新的 Tauri 命令

1. 在 `src/commands/` 创建新文件
2. 在 `src/commands/mod.rs` 导出命令
3. 在 `src/lib.rs` 的 `invoke_handler!` 中注册

详见 [src/commands/README.md](./src/commands/README.md)

### 添加插件

```bash
# 添加依赖
cd src-tauri
cargo add tauri-plugin-<name>
```

```rust
// 在 lib.rs 中注册
let builder = builder.plugin(tauri_plugin_<name>::init());
```

### 修改窗口配置

编辑 `tauri.conf.json` 的 `windows` 数组。

### 添加权限

编辑 `capabilities/default.json`,添加所需权限标识符。

---

## 安全注意事项

1. **CSP (内容安全策略)**: 在 `tauri.conf.json` 配置
2. **权限最小化**: 只授予必要的权限
3. **输入验证**: 在 Tauri 命令中验证前端输入
4. **敏感数据**: 不要在前端暴露敏感配置,使用环境变量

---

## 平台特定配置

### macOS

- 配置 `Info.plist` 权限(相机、麦克风等)
- 代码签名和公证(发布时)

### Windows

- 配置 `.exe` 资源信息
- UWP/MSIX 打包(可选)

### Linux

- AppImage / .deb / .rpm 打包
- 桌面文件配置

---

## 相关文档

- [Rust 源代码说明](./src/README.md)
- [Tauri 命令开发](./src/commands/README.md)
- [Tauri 官方文档](https://tauri.app/)
- [Cargo 官方文档](https://doc.rust-lang.org/cargo/)
- [Rust 编程语言](https://www.rust-lang.org/)
