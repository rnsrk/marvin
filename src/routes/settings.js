// Config
import configImport from '/resources/config/config.json'

// Components
import {Log} from "../components/Log";

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
      let message;
      await writeFile('resources/config/config.json', JSON.stringify(config2Safe, null, 2), (err) => {
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
        <form onSubmit={selectFolderHandler}>
          <label htmlFor={"output-root"}>
            Wurzelverzeichnis
          </label>
          <div className="col-sm-10 d-flex align-items-center flex sticky-edit">
            <Input config={config} setConfig={setConfig}/>
            <button type="submit" className="edit-button text-end">
              <i className="fas fa-edit d-block">
                <EditIcon sx={{fontSize: 16}} color={'#d5d5d5'}/>
              </i>
            </button>
          </div>
        </form>
      </main>
      <footer>
      </footer>
    </div>
  );
}
