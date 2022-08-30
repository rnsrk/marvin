// Components
import {DataForm} from "./DataForm";
import {Log} from "./Log"
import SettingsIcon from '@mui/icons-material/Settings';

// Modules
import ObjektkatalogApi from "../ObjektkatalogApi";

// React
import {NavLink} from "react-router-dom";
import React, {useState} from 'react'

// CSS
import '../assets/css/styles.css'
import {LoadingIcon} from "./LoadingIcon";


////////////////////
//      Main      //
////////////////////

export const App = () => {

  // Variables
  const objektkatalogApi = new ObjektkatalogApi();

  // States

  const [isLoading, setIsLoading] = useState(false);

  const [logState, setLogState] = useState({
    log: {
      status: '',
      message: '',
      code: '',
      tip: '',
    }, // with message, code, tip
    logClass: 'inactive'
  });

  const [objectData, setObjectData] = useState(
    {
      datum: '',
      hersteller: '',
      herstellungsdatum: '',
      herstellungsort: '',
      httpStatus: 500,
      inventarnummer: '',
      masse: '',
      materialTechnik: '',
      titel: '',
    }
  );

  const [checkUpVisibility, setCheckUpVisibility] = useState(
    false
  );

  // Handler
  const getDataAndAskForCheckUpClickHandler = async (e) => {
    setIsLoading(true)
    // Prevent page reload.
    e.preventDefault()
    let objectId = ''
    objectId = e.target.form.objectId.value
    // Get objectId from user input.

    await setObjectData((prevState) => {
        return {
          ...prevState,
          inventarnummer: objectId,
        }
      }
    )

    if (objectId) {
      // Get object data from objektkatalog.gnm.de
      const [receivedObjectData, receivedVisibility] = await objektkatalogApi.getData(objectId);
      if (receivedObjectData.httpStatus !== 200) {
        await setLogState({
          log: {
            status: 'red',
            message: 'Kein Objekt mit dieser Inventarnummer gefunden!',
            code: '',
            tip: '',
          }, // with message, code, tip
          logClass: 'active'
        })
        await setCheckUpVisibility(false)
      } else {
        // Fill and open check up form
        await setObjectData(receivedObjectData)
        await setCheckUpVisibility(true)
        await setLogState({
          log: {
            status: '',
            message: '',
            code: '',
            tip: '',
          }, // with message, code, tip
          logClass: 'inactive'
        })
      }
    } else {
      await setLogState({
        log: {
          status: 'red',
          message: 'Bitte Inventarnummer eingeben!',
          code: '',
          tip: '',
        }, // with message, code, tip
        logClass: 'active'
      })
      await setCheckUpVisibility(false)
    }
    setIsLoading(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        <nav className={"flex justify-content-end"}>
          <NavLink className={'nav-icon'} to="/settings"><SettingsIcon/></NavLink>
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
              <input
                id={"object-id"}
                name="objectId"
                type={"text"}
                className={"center cut input-field"}
              />
            </div>

            <button className={'send-button center top-distance'} onClick={getDataAndAskForCheckUpClickHandler}>
              Dokument vorbereiten
            </button>

          </form>
        </div>
        <LoadingIcon isLoading={isLoading}/>
        <DataForm
          checkUpVisibility={checkUpVisibility}
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
