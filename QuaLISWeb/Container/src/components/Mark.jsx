import React,{lazy,Suspense} from 'react'
const MarketingLazy = lazy(() => import('./MarketingApp.js'));
//import MarketingLazy from './MarketingApp.js'
import Progress from './Progress.js';
class Mark extends React.Component{
  
    render(){
        console.log('mark')
        return(
             <Suspense  fallback={<Progress />}>
        <MarketingLazy Login={this.props.Login}> </MarketingLazy>
         </Suspense>
        )
        }
}
export default Mark;