import config from '../config/config.json'

// Icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';

// Modules
const {writeFile} = require('fs');

// React
import React, {useState} from "react";
import {Link} from "react-router-dom";


////////////////////
//      Main      //
////////////////////

export default function Settings() {
  let rootDir;
  const [disableButton, setDisableButton] = useState(true)

  async function selectFolderHandler() {
    return rootDir = await window.openFile();

  }



  // Handler
  function saveInputClickHandler(rootDir) {
    if (rootDir) {
      config.rootDir = rootDir
      writeFile('src/config/config.json', JSON.stringify(config, null, 2), (error) => {
        if (error) {
          console.log('An error has occurred ', error);
          return;
        }
        console.log('Data written successfully to disk');
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/"><ArrowBackIosIcon/></Link>
      </header>
      <main>
        <form>
          <label htmlFor={"output-root"}>
            Wurzelverzeichnis
          </label>
          <div className="col-sm-10 d-flex align-items-center flex sticky-edit">
            <input
              id={"root-dir"}
              className={"form-control select-folder-field edit-input"}
              defaultValue={config.rootDir}
              disabled={true}
            />
            <button className="edit-button text-end" onClick={
              (e) => {
                console.log(e)
                e.preventDefault()
                selectFolderHandler().then((rootDir) => {saveInputClickHandler(rootDir)})
              }
            }>
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
