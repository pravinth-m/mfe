import React from 'react'
import Controls from './Controls';

const Controlswithoutcolumn=(data)=>{
    return(
        data.data.map((component)=>{
           return <Controls data={component} props={data.props}></Controls>
        })
   
    )
}
export default Controlswithoutcolumn;