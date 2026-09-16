# STACK

## React × GitHub × ChatGPT Web × AW

### 1. まず、役割を分ける

```text
React       = Develop
GitHub      = Canon
ChatGPT Web = Intelligence
AW          = Debug / Fix / Verify / Deploy
GitHub Actions = CI execution
GitHub Pages   = Serve
```

### 2. React = 開発

ReactはUIを作るための開発基盤。

```text
React
 ├─ UI
 ├─ State
 ├─ Component
 └─ Browser Runtime
```

小さなアプリでも、画面が変化するならstateを使う。

### 3. GitHub = Canon

GitHubは単なるコード置き場ではない。

```text
GitHub
 ├─ Code
 ├─ README
 ├─ Issues
 ├─ Actions
 └─ History
```

現在の正本をGitHubに置く。

### 4. ChatGPT Web = Intelligence

ChatGPT Webは、考える・調べる・整理する・設計する・レビューするためのインターフェース。

```text
Human
  ↓
ChatGPT Web
  ↓
GitHub Canon
```

### 5. AW = Agent Workflow

AWはコード生成だけではなく、開発後のループを回す。

```text
Issue
 ↓
AW
 ↓
Debug
 ↓
Fix
 ↓
Test
 ↓
Deploy
```

### 6. DebugもAW

CI/CDの失敗を人間がログから手作業で追いかけるのではなく、AWがログを読み、原因を特定し、修正し、再実行する。

```text
GitHub Actions
      ↓
     Error
      ↓
      AW
      ↓
   Logs解析
      ↓
   原因特定
      ↓
     修正
      ↓
     Push
      ↓
      CI
      ↓
    Success
```

### 7. CI/CD = GitHub Actions

```text
git push
   ↓
GitHub Actions
   ↓
npm install
   ↓
npm run build
   ↓
Deploy
   ↓
GitHub Pages
```

ActionsはCIを実行する場所。AWはその前後を制御する。

### 8. STACK全体

```text
Human
  │ Goal / Judgment
  ↓
ChatGPT Web
  │ Intelligence
  ↓
GitHub
  │ Canon
  ↓
AW
  │ Debug → Fix → Test → Deploy
  ↓
GitHub Actions
  │ CI execution
  ↓
Production
```

### 9. 人間の役割

```text
従来
考える → 書く → テスト → デプロイ → エラー対応

STACK
Goal
 ↓
ChatGPT
 ↓
GitHub Canon
 ↓
AW
 ↓
CI/CD
 ↓
Result
 ↓
Human Judgment
```

人間はGoalと最終判断を担当する。

### 10. まとめ

```text
React          = Make
GitHub         = Canon
ChatGPT Web    = Think
AW             = Debug / Fix / Verify / Deploy
GitHub Actions = Execute CI
Pages          = Serve
```

> ChatGPTが考え、AWが回す。
>
> GitHubをCanonにして、開発からデバッグ、検証、公開までを閉じたループにする。
