const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "سليمان للعقارات - النسخة الاحترافية",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // إذا كنا في مرحلة التطوير يفتح من السيرفر المحلي، وفي الإنتاج يفتح ملفات الـ build
  const startURL = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../out/index.html')}`;

  win.loadURL(startURL);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});