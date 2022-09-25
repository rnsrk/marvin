// Modules
import Store from 'electron-store';

// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// React
import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import {Input} from "../components/Input";
import EditIcon from "@mui/icons-material/Edit";


////////////////////
//      Main      //
////////////////////

export default function Settings() {
  const store = new Store()
  const initialConfigJson = store.get('configJson')
// States
  const [configFile, setConfigFile] = useState(
    initialConfigJson
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
    saveInputClickHandler(rootDirFromWindow)
  }

// Handler
  function saveInputClickHandler(rootDirFromWindow) {
    let config2Safe = {
      rootDir: rootDirFromWindow
    }
    if (rootDirFromWindow) {
      store.set(
        'configJson', config2Safe
      )
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
