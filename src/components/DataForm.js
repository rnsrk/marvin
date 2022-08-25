// React
import React from 'react'

////////////////////
//      Main      //
////////////////////

export const DataForm = () => {
  return (<div>
      <form className={'flex column'}>
        <div >
          <label htmlFor={'template-inventarnummer'} >Inventarnummer</label>
          <input className={"full input-field"}/>
        </div>
        <div >
          <label htmlFor={'template-titel'}>Titel</label>
          <input type={"text"} className={"full input-field"}/>
        </div>
        <div>
          <label htmlFor={'template-hersteller'}>Hersteller</label>
          <input type={"text"} className={"full input-field"}/>
        </div>
        <div>
          <label htmlFor={'template-herstellungsort'}>Herstellungsort</label>
          <input type={"text"} className={"full input-field"}/>
        </div>
        <div >
          <label htmlFor={'template-herstellungsdatum'}>Herstellungsdatum</label>
          <input type={"text"} className={"full input-field"}/>
        </div>
        <div >
          <label htmlFor={'template-materialTechnik'}>Material und Technik</label>
          <input type={"text"} className={"full input-field"}/>
        </div>
        <div>
          <label htmlFor={'template-masse'}>Maße</label>
          <input type={"text"} className={"full input-field"}/>
        </div>
        <button type={"submit"} className={'send-button center top-distance'} >Dokument erstellen</button>
      </form>
    </div>
  )
}
