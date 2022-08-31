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
      dokumenttyp: '',
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

  // Get userinput from main form, ask Objektkatalog API for Data and fill check up form.
  const getDataAndAskForCheckUpClickHandler = async (e) => {
    // Show loading widget.
    setIsLoading(true)

    // Prevent page reload.
    e.preventDefault()

    // Get objectId and document type from user input.
    let objectId = e.target.form.objectId.value
    let documentType = e.target.form.documentType.value

    // Set object state.
    await setObjectData((prevState) => {
        return {
          ...prevState,
          inventarnummer: objectId,
          dokumenttyp: documentType,
        }
      }
    )

    if (objectId) {
      // Get object data from objektkatalog.gnm.de.
      const [receivedObjectData, receivedVisibility] = await objektkatalogApi.getData(objectId);
      // If no response from Objektkatalog.
      switch (receivedObjectData.httpStatus) {
        // Server not reachable.
        case 503:
          await setLogState({
            log: {
              status: 'red',
              message: 'Objektkatalog nicht erreichbar!',
              code: '503',
              tip: 'Sind sie mit dem Internet verbunden und ist der Objektkatalog online?',
            }, // with message, code, tip
            logClass: 'active'
          })
          // Hide Loading
          setIsLoading(false)
          return;
        case 200:
          // Fill and open check up form.
          await setObjectData(prevState => {
            return {
              ...prevState,
              ...receivedObjectData
            }
          })
          // Show check up form.
          await setCheckUpVisibility(true)

          // Set success log but hide.
          await setLogState({
            log: {
              status: '',
              message: '',
              code: '',
              tip: '',
            },
            logClass: 'inactive'
          })
          break;
        default:
          // Set error log state.
          await setLogState({
            log: {
              status: 'red',
              message: 'Kein Objekt mit dieser Inventarnummer gefunden!',
              code: '',
              tip: 'Groß-/Kleinschreibung beachten und keine Leerzeichen verwenden!',
            }, // with message, code, tip
            logClass: 'active'
          })
          // Hide Loading
          setIsLoading(false)
          // Hide check up form.
          await setCheckUpVisibility(false)

      }
    } else {
      // Set error log.
      await setLogState({
        log: {
          status: 'red',
          message: 'Bitte Inventarnummer eingeben!',
          code: '',
          tip: '',
        },
        logClass: 'active'
      })
      // Hide check up form.
      await setCheckUpVisibility(false)
    }
    // Hide loading widget.
    setIsLoading(false)
  }
  // Component with
  // * Navigation (Nav) *
  // * Main form (this)*
  // * Loading widget (LoadingIcon)*
  // * Checkup form (DataForm)*
  // * Log (Log)*

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
              <select name="documentType" id="document-type" className={"input-field center cut"}>
                <option value="rp">Restaurierungsprotokoll</option>
                <option value="lbb">Leihgabenbegleitblatt</option>
                <option value="a">Analyse</option>
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
