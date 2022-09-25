const path = require('path');
const fs = require('fs');
const {app} = require('electron');

class FileLoader {
  assetPath;
  assetBuildPath;
  assetInstallerPath;
  assetDevPath;

  constructor(props) {
    this.getAssetPath()
  }

  getAssetPath() {
    this.assetBuildPath = path.resolve(__dirname, '../assets');
    this.assetInstallerPath = path.resolve(__dirname, 'assets');
    this.assetDevPath = path.resolve(app.getAppPath(), 'assets');

    if (fs.existsSync(this.assetInstallerPath)) {
      this.assetPath = this.assetInstallerPath
    } else if (fs.existsSync(this.assetBuildPath)) {
      this.assetPath = this.assetBuildPath
    } else {
      this.assetPath = this.assetDevPath
    }
  }

  getConfigFile() {
    const fileBuffer = fs.readFileSync(path.resolve(this.assetPath, 'config/config.json'))
    return JSON.parse(fileBuffer.toString())
  }

  getTemplateDirPath() {
    return path.resolve(this.assetPath, 'templates');
  }
  getConfigDirPath() {
    return path.resolve(this.assetPath, 'config');
  }
  getImageDirPath() {
    return path.resolve(this.assetPath, 'images');
  }

  whereAmI () {
    console.log(__dirname , '__dirname');
    console.log(process.resourcesPath, 'resourcePath');
    console.log(process.cwd(), 'cwd');
    console.log(process.env.PWD, 'pwd');
    console.log(app.getAppPath(), 'getAppPath')
  }

}

module.exports = FileLoader;
