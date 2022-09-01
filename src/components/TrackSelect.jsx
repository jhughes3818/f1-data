import React from 'react';
import tracks from '../data/tracks'
import Select from './Select'

function SelectTrack() {
    return (

        <form>
          <div className="mt-1">
              <Select array={tracks} />
          </div>
        </form>
      )
}

export default SelectTrack


