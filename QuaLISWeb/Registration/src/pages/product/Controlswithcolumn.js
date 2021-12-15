import React from 'react'
import { Col, Row } from 'react-bootstrap';
import Controls from './Controls';

const Controlswithcolumn=(data)=>{
    return(
    <Row>
                                   {data.data.map((component)=>{
                                    return(<Col md={data.data.length===2
                                    ?6:data.data.length===3?4:3}>
                                       <Controls data={component} props={data.props}></Controls>
                                    </Col>
                                    )
                                   }
                       )}
                               </Row>
    )

}
export default Controlswithcolumn;