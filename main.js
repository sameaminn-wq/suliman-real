const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // تسمح بتشغيل Prisma و Node داخل Electron
    },
    icon: path.join(__dirname, 'public/icon.ico')
  });

  // تحديد مسار تشغيل التطبيق
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    // في نسخة الـ EXE، نقوم بتحميل ملف الـ index الناتج عن بناء Next.js
    win.loadFile(path.join(__dirname, 'out/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});