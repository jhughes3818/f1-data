import React, {useState} from 'react'
import yearsSupported from '../data/years'
import Select from './Select'



function YearsSelect(props) {




  return (

    
      <div className="mt-1">
          <Select array={yearsSupported} />
      </div>
    
  )
}

export default YearsSelect
