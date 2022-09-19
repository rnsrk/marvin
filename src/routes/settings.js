// Modules
import {FileLoader} from "../FileLoader";

// Electron
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// React
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {Input} from "../components/Input";
import EditIcon from "@mui/icons-material/Edit";
import {writeFile} from "fs";


////////////////////
//      Main      //
////////////////////

export default function Settings() {
  const fileLoader = new FileLoader()
  const initialConfig = fileLoader.getConfigFile()
  console.log(initialConfig)
  const getConfigPath = async (path) => {
    return await ipcRenderer.invoke('assetPath:getAssetPath', path)
  }

// States
  const [configFile, setConfigFile] = useState(
    initialConfig
  )
  const [restart, setRestart] = useState(
    false
  )

//Functions
  async function selectFolderHandler(e) {
    e.preventDefault()
    const rootDirFromWindow = await window.openFile();
    setConfigFile((prevState) => {
      return {
        ...prevState,
        rootDir: rootDirFromWindow
      }
    })
    await saveInputClickHandler(rootDirFromWindow)
  }

// Handler
  async function saveInputClickHandler(rootDirFromWindow) {
    let config2Safe = {
      rootDir: rootDirFromWindow
    }
    if (rootDirFromWindow) {
      let message;
      const configPath = await getConfigPath('config/config.json')
      await writeFile(configPath, JSON.stringify(config2Safe, null, 2), (err) => {
        if (err) {
          message = err;
        } else {
          message = 'saved file'
        }
        return message
      })
      setRestart(true)
      return restart;
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <NavLink className={'nav-icon'} to="/"><ArrowBackIosIcon/></NavLink>
      </header>
      <main>
        <section className={"flex-center column"}>
          <h3>Einstellungen</h3>
          <form onSubmit={selectFolderHandler} className={"pd-05rem"}>
            <label className={"center cut v-distance"} htmlFor={"output-root"}>
              Hauptverzeichnis
            </label>
            <div className="align-items-center flex">
              <Input configFile={configFile}/>
              <button type="submit" className="edit-button text-end">
                <i className="fas fa-edit d-block">
                  <EditIcon sx={{fontSize: 16}} color={'#d5d5d5'}/>
                </i>
              </button>
            </div>
          </form>
        </section>
      </main>
      <footer>
      </footer>
    </div>
  );
}
