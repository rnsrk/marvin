// Components
import {Galary} from './Galary'

// Modules
import {DocCreator} from "../DocCreator";
import Store from 'electron-store';

// React
import React from 'react'

////////////////////
//      Main      //
////////////////////


// Renders check up form and gives the possibility to change received values.
export const DataForm = ({checkUpVisibility, objectData, setObjectData, logState, setLogState}) => {

  // Variables
  let log;

  // Store
  const store = new Store()

  // Handlers
  // Change handler response to every keystroke!

  // Change date.
  const datumChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        datum: e.target.form.datum.value
      }
    })
  }
  // Change identifier.
  const inventarnummerChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        inventarnummer: e.target.form.inventarnummer.value
      }
    })
  }
  // Change title.
  const titelChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        titel: e.target.form.titel.value
      }
    })
  }

  // Change creator.
  const herstellerChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        hersteller: e.target.form.hersteller.value
      }
    })
  }
  // Change creation place.
  const herstellungsortChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        herstellungsort: e.target.form.herstellungsort.value
      }
    })
  }

  // Change creation date.
  const herstellungsdatumChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        herstellungsdatum: e.target.form.herstellungsdatum.value
      }
    })
  }

  // Change material and technic.
  const materialTechnikChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        materialTechnik: e.target.form.materialTechnik.value
      }
    })
  }

  // Change sizes.
  const masseChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        masse: e.target.form.masse.value
      }
    })
  }

  // Fill the template and save it.
  const fillTemplateClickHandler = async (e) => {
    e.preventDefault();
    const configJson = store.get('configJson')
    if (configJson.rootDir == null) {
      setLogState(
        {
          log: {
            status: 'red',
            message: 'Keine Hauptverzeichnis für die Ordnerstruktur angegeben!',
            tip: 'Bitte zu den Einstellungen wechseln, und dort ein Verzeichnis auswählen!'
          },
          logStatus: 'active'
        }
      )
    } else {
      const docCreator = new DocCreator(logState, objectData)
      log = await docCreator.fillTemplate();
      await docCreator.createMetsMods();

      // Set new state of log div with message and visibility class
      setLogState({
        log: log,
        logStatus: 'active'
      });
    }
  }

  // Renders data form
  return (
    <div className={'checkup ' + (checkUpVisibility ? 'open' : 'closed')}>
      <form className={'flex column pd-05rem'}>
        <Galary objectData={objectData}/>
        <div>
          <div>
            <label htmlFor={'template-datum'}>Datum</label>
            <input
              id={"template-datum"}
              name={"datum"}
              type={"date"}
              className={"full input-field"}
              defaultValue={objectData.datum}
              onChange={datumChangeHandler}
            />
          </div>
          <div>
            <label htmlFor={'template-inventarnummer'}>Inventarnummer</label>
            <input
              id={"template-inventarnummer"}
              name={"inventarnummer"}
              type={"text"}
              className={"full input-field"}
              defaultValue={objectData.inventarnummer}
              onChange={inventarnummerChangeHandler}
            />
          </div>
          <div>
            <label htmlFor={'template-titel'}>Titel</label>
            <input
              id={"template-titel"}
              name={"titel"}
              type={"text"}
              className={"full input-field"}
              defaultValue={objectData.titel}
              onChange={titelChangeHandler}
            />
          </div>
          <div>
            <label htmlFor={'template-hersteller'}>Hersteller</label>
            <input
              id={"template-hersteller"}
              name={"hersteller"}
              type={"text"}
              className={"full input-field"}
              defaultValue={objectData.hersteller}
              onChange={herstellerChangeHandler}
            />
          </div>
          <div>
            <label htmlFor={'template-herstellungsort'}>Herstellungsort</label>
            <input
              id={"template-herstellungsort"}
              name={"herstellungsort"}
              type={"text"}
              className={"full input-field"}
              defaultValue={objectData.herstellungsort}
              onChange={herstellungsortChangeHandler}
            />
          </div>
          <div>
            <label htmlFor={'template-herstellungsdatum'}>Herstellungsdatum</label>
            <input
              id={"template-herstellungsdatum"}
              name={"herstellungsdatum"}
              type={"text"}
              className={"full input-field"}
              defaultValue={objectData.herstellungsdatum}
              onChange={herstellungsdatumChangeHandler}
            />

          </div>
          <div>
            <label htmlFor={'template-materialTechnik'}>Material und Technik</label>
            <input
              id={"template-materialTechnik"}
              name={"materialTechnik"}
              type={"text"}
              className={"full input-field"}
              defaultValue={objectData.materialTechnik}
              onChange={materialTechnikChangeHandler}
            />
          </div>
          <div>
            <label htmlFor={'template-masse'}>Maße</label>
            <input
              id={"template-masse"}
              name={"masse"}
              type={"text"}
              className={"full input-field"}
              defaultValue={objectData.masse}
              onChange={masseChangeHandler}
            />
          </div>
        </div>
        <button
          type={"submit"}
          className={'send-button center top-distance'}
          onClick={fillTemplateClickHandler}
        >Dokument erstellen
        </button>
      </form>
    </div>
  )
}
