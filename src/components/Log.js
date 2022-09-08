// React
import React from 'react'

////////////////////
//      Main      //
////////////////////

export const Log = ({logState, setLogState}) => {
  let code;
  let tip;

    const closeLog = (e) => {
      e.preventDefault()
      setLogState({log: logState.log,
        logClass: 'inactive'});
    }

  const classes = 'round-box flex pd-05rem ' + logState.log.status + ' ' + logState.logClass
  if (logState.log.code) {
    code = ' Code: ' + logState.log.code
  } else {
    code = ''
  }
  if (logState.log.tip) {
    tip = ' Tipp: ' + logState.log.tip
  } else {
    tip = ''
  }
  return (
    <div className={'log '}>
      <div id={'log-content'} className={classes}>
        <div className={"log-close-button"}>
          <button onClick={closeLog}>x</button>
        </div>
        <div className={'scroll-y flex-full pd-05rem'} style={{maxHeight: 4 + 'em'}}>
          <p>{logState.log.message}</p>
          <p>{code}</p>
          <p>{tip}</p>
        </div>
      </div>
    </div>
  )
}


