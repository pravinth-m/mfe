import React from "react"
import ProductCategory from '../pages/product/ProductCategory.jsx';
 const Checking=({Login,data,props})=>{
     console.log('checking')
    return(<>
        <div>{"checking"}{data&&data.displayName}{Login&&Login.displayName}</div>
        <ProductCategory {...props}></ProductCategory>
        </>
        
    )
  
}

export default Checking;