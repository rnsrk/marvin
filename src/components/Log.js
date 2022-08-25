// React
import React from 'react'

////////////////////
//      Main      //
////////////////////

export const Log = ({logState, setLogState}) => {
  let code;
  let tip;

    const closeLog = (e, logClass) => {
      e.preventDefault()
      setLogState({log: logState.log,
        logClass: 'inactive'});
    }

  const classes = 'round-box flex ' + logState.log.status + ' ' + logState.logClass
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
        <div>
          <button onClick={(e) => {closeLog(e)}}>x</button>
        </div>
        <div className={'scroll-y flex-full'} style={{maxHeight: 4 + 'em'}}>
          <p>{logState.log.message}</p>
          <p>{code}</p>
          <p>{tip}</p>
        </div>
      </div>
    </div>
  )
}


