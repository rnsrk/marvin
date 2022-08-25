// Components
import {DataForm} from "./DataForm";
import {Log} from "./Log"
import SettingsIcon from '@mui/icons-material/Settings';

// React
import { Link } from "react-router-dom";
import React, {useState} from 'react'

// CSS
import '../assets/css/styles.css'
import ObjektkatalogApi from "../ObjektkatalogApi";


////////////////////
//      Main      //
////////////////////

export const App = () => {


  // States

   /* Initialize state of the log.
   * log: variables fpr logging message.
   * logClass: for visibility of log <div>.
   */
    const [logState, setLogState] = useState({
      log: {
        status: '',
        message: '',
        code: '',
        tip:'',
      }, // with message, code, tip
      logClass: 'inactive'
    });

  const [objectData, setObjectData] = useState(
    {
      datum: '',
      inventarnummer: '',
      titel: '',
      hersteller: '',
      herstellungsort: '',
      herstellungsdatum: '',
      materialTechnik: '',
      masse: '',
      httpStatus: 500,
    }
  );

  const [checkUpVisibility, setCheckUpVisibility] = useState(
    false
  );

    // Handler
    async function getDataAndAskForCheckUpClickHandler(e) {
      // Prevent page reload.
      e.preventDefault();

      // Get objectId from user input.
      let objectId = document.getElementById('object-id').value

      if (objectId) {

        // Get object data from objektkatalog.gnm.de
        let objektkatalogApi = new ObjektkatalogApi();
        let receivedObjectData = await objektkatalogApi.getData(objectId);
        if (receivedObjectData.httpStatus === 404) {
          setLogState({
            log: {
              status: 'red',
              message: 'Kein Objekt mit dieser Inventarnummer gefunden!',
              code: '',
              tip:'',
            }, // with message, code, tip
            logClass: 'active'
          })
        } else {
        console.log(receivedObjectData)
        // Fill and open check up form
        setObjectData(receivedObjectData)
        setCheckUpVisibility(true)
        }
      } else {
        setLogState({
          log: {
            status: 'red',
            message: 'Bitte Inventarnummer eingeben!',
            code: '',
            tip:'',
          }, // with message, code, tip
          logClass: 'active'
        })
      }
    }

    return (
      <div className="App">
        <header className="App-header">
          <nav className={"flex justify-content-end"}>
            <Link to="/settings"><SettingsIcon/></Link>
          </nav>
        </header>
        <main>
          <div className={"container"}>
            <form id={"object-id-form"} className={"flex-wrap"}>
              <div className={"center column flex justify-content-space-between "}>
                <label htmlFor="document-type" className={"center cut v-distance"}>Dokumenttyp:</label>
                <select name="document-type" id="document-type" className={"input-field center cut"}>
                  <option value="restaurierungsprotokoll">Restaurierungsprotokoll</option>
                  <option value="leihgabenbegleitblatt">Leihgabenbegleitblatt</option>
                  <option value="analyse">Analyse</option>
                </select>
              </div>
              <div className={"center column flex full justify-content-space-between"}>
                <label htmlFor={"object-id"} className={"center cut v-distance"}>Inventarnummer:</label>
                <input id={"object-id"} type={"text"} className={"center cut input-field"}/>
              </div>

                <button className={'send-button center top-distance'} onClick={getDataAndAskForCheckUpClickHandler}>
                  Dokument vorbereiten
                </button>

            </form>
          </div>
          <DataForm
            className={checkUpVisibility ? 'open' : 'closed'}
            objectData={objectData}
            setObjectData={setObjectData}
            logState={logState}
            setLogState={setLogState}
          />
        </main>
        <footer>
          {/* We give state and state setter of the parent as params to the child components, so that child events can change parent states */}
          <Log logState={logState} setLogState={setLogState}/>
        </footer>
      </div>
    )
}

export default App
