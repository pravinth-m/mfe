import { mount } from 'marketing/MarketingApp';
import React, { useRef, useEffect,lazy } from 'react';
import { useHistory } from 'react-router-dom';
//import {fetchRecord} from 'marketing/MarketingActionApp'
//const Mark = lazy(() => import('./MarketAction.js'));

export default ({Login}) => {
 // fetchRecord('SAMEPLEdATA')
   // Mark();
    console.log('Login',Login)
  const ref = useRef(null);
  const history = useHistory();
  console.log('Login',Login)
  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      initialPath: history.location.pathname,
      onNavigate: ({ pathname: nextPathname }) => {
        const { pathname } = history.location;

        if (pathname !== nextPathname) {
          history.push(nextPathname);
          console.log(nextPathname)
        }
      },
    },Login,true);

    history.listen(onParentNavigate);
  }, []);
  console.log('Login',Login)
  return <div ref={ref} />;
};
