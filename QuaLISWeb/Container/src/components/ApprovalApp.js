import { mount } from 'approval/ApprovalApp';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default ({Login}) => {
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
