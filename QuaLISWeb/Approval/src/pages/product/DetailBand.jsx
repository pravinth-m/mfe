import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import Controls from './Controls'
import Controlswithcolumn from './Controlswithcolumn';
import Controlswithoutcolumn from './Controlswithoutcolumn';


const DetailBand = ({props}) => {
    const Layout=JSON.parse(props.layout.value);
    return (
<>
{Layout?
Layout.map((item)=>
    <Row>
        {item.children.length>0?
        item.children.map((column)=>
            <Col md={item.children.length===1?12
                :item.children.length===2?6:
                item.children.length===3?4:3}>
                    {column.children.map((component)=>{
                        return (component.children?
                        <Controlswithcolumn  data={component} props={props}/>: 
                        <Controlswithoutcolumn  data={component.children} props={props}/>)                    
                   }
                    )}
                  
            </Col>    
        )
        :""}           
    </Row>
        )
        :""}
        </>)
}
export default DetailBand;