import fs from "fs";
import path from "path";


class FileLoader {
  assetPath;
  devAssetPath = 'src/assets';
  buildAssetPath = 'resources/app/src/assets';
  packedAssetPath = 'resources/files/';

  getPackedStructure() {
    if (fs.existsSync(this.packedAssetPath)) {
      this.assetPath = this.packedAssetPath;
    } else if (fs.existsSync(this.buildAssetPath)) {
      this.assetPath = this.packedAssetPath;
    } else {
      this.assetPath = this.devAssetPath;
    }
  }

  getConfigFile() {
    this.getPackedStructure()
    console.log(this.assetPath)
    const ConfigFile = fs.readFileSync(path.resolve(this.assetPath, 'config/config.json'))
    return JSON.parse(ConfigFile.toString())
  }

  getTemplateDir() {
    return path.resolve(this.assetPath, 'templates');

  }
}

export {FileLoader}

