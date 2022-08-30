// Modules
import {fillTemplate} from "../DocxInserter";

// React
import React from 'react'

////////////////////
//      Main      //
////////////////////

export const DataForm = ({checkUpVisibility, objectData, setObjectData, logState, setLogState}) => {
  let log;

  // Handlers
  const datumChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        datum: e.target.form.datum.value
      }
    })
  }

  const inventarnummerChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        inventarnummer: e.target.form.inventarnummer.value
      }
    })
  }

  const titelChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        titel: e.target.form.titel.value
      }
    })
  }

  const herstellerChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        hersteller: e.target.form.hersteller.value
      }
    })
  }

  const herstellungsortChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        herstellungsort: e.target.form.herstellungsort.value
      }
    })
  }

  const herstellungsdatumChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        herstellungsdatum: e.target.form.herstellungsdatum.value
      }
    })
  }

  const materialTechnikChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        materialTechnik: e.target.form.materialTechnik.value
      }
    })
  }

  const masseChangeHandler = (e) => {
    setObjectData((prevState) => {
      return {
        ...prevState,
        masse: e.target.form.masse.value
      }
    })
  }

  const fillTemplateClickHandler = async (e) => {
    e.preventDefault();
    log = await fillTemplate(logState, objectData);
    // Set new state of log div with message and visibility class
    setLogState({
      log: log,
      logStatus: 'active'
    });
  }

  return (<div className={'checkup ' + (checkUpVisibility ? 'open' : 'closed')}>
      <form className={'flex column '}>
        <div >
          <label htmlFor={'template-datum'} >Datum</label>
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
          <label htmlFor={'template-inventarnummer'} >Inventarnummer</label>
          <input
            id={"template-inventarnummer"}
            name={"inventarnummer"}
            type={"text"}
            className={"full input-field"}
            defaultValue={objectData.inventarnummer}
            onChange={inventarnummerChangeHandler}
          />
        </div>
        <div >
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
        <div >
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
        <div >
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
        <button
          type={"submit"}
          className={'send-button center top-distance'}
          onClick={fillTemplateClickHandler}
        >Dokument erstellen</button>
      </form>
    </div>
  )
}
