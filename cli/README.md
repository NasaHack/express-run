# Express App Starter CLI Tool

Run the following command:

```bash
npx run-express
```

- Enter a **project name** when prompted.
- If the folder already exists, you’ll be asked to choose a different name.
- The commands will automatically:
  - Clone my personal [run-express](https://github.com/NasaHack/express-run) repository.
  - Install dependencies.
  - Open the project in **VS Code** (if installed) or in the default file manager.

## Example Output

**POSSIBLE SUCCESS :**

```bash
✒️ [INPUT] : Enter project name: my-new-project
✅ [SUCCESS] : Project cloned successfully!
✅ [SUCCESS] : Package name updated to my-new-project
✅ [SUCCESS] : Project sanitized and installed dependencies successfully!
✅ [SUCCESS] : Project opened successfully!!
```

**POSSIBLE `PARTIAL` FAILURE:**

```txt
✒️ [INPUT] : Enter project name: my-new-project
    ...
    ...
    ...
⚠️ [WARNING] : Faild to opened project! Try to open project manually!
ℹ️ [INFO]    : Try these commands to open project:

⚡️ cd my-new-project
🔧 npm install
💻 open .
```

**POSSIBLE FAILURE:**

```txt
✒️ [INPUT] : Enter project name: .
❌ [ERROR] : Current diretory is not empty! Please consider using a unique name for your project.
```

**POSSIBLE FAILURE:**

```txt
✒️ [INPUT] : Enter project name: new-project
❌ [ERROR] : Already a folder exist with the same name! Please consider using a unique name for your project.
```
