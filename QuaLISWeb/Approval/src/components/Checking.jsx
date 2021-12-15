import React from "react"
import Type1Component from './type1component/Type1Component.jsx';
 const Checking=({Login,data,props})=>{
     console.log('checking')
    return(<>
        <div>{"checking"}{data&&data.displayName}{Login&&Login.displayName}</div>
        <Type1Component {...props}></Type1Component>
        </>
        
    )
  
}

export default Checking;