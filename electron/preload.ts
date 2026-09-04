import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopAPI', {
  platform: process.platform,
  getInfo: () => ipcRenderer.invoke('platform:get-info'),
  toggleFullscreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
});
