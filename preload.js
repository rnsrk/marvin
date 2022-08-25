const { ipcRenderer } = require('electron')

window.openFile = async () => {
  return await ipcRenderer.invoke('dialog:openFile')
}


