export default function MainMenu (browserWindow) {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CommandOrControl+N',
          click () {
            browserWindow.webContents.send('menu:new-project')
          }
        },
        {
          label: 'New Repository',
          accelerator: 'CommandOrControl+T',
          click () {
            browserWindow.webContents.send('menu:new-repository')
          }
        }
      ]
    }
  ]
}
