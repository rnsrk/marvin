// Modules
import path from "path";

// Config
import configImport from '/src/assets/config/config.json'

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
  // States
  const [config, setConfig] = useState(
    configImport
  )

  const [restart, setRestart] = useState(
    false
  )

  //Functions
  async function selectFolderHandler(e) {
    e.preventDefault()
    const rootDirFromWindow = await window.openFile();
    setConfig((prevState) => {
      return {
        ...prevState,
        rootDir: rootDirFromWindow
      }
    })
    const saveResult = await saveInputClickHandler(rootDirFromWindow)
  }

  // Handler
  async function saveInputClickHandler(rootDirFromWindow) {
    let config2Safe = {
      rootDir: rootDirFromWindow
    }
    if (rootDirFromWindow) {
      console.log(__dirname);
      let message;
      await writeFile('/resources/files/config/config.json', JSON.stringify(config2Safe, null, 2), (err) => {
        if (err) {
          message = err;
        } else {
          message = 'saved file'
        }
        return message
      })
      setRestart(true)
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
              <Input config={config} setConfig={setConfig}/>
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
