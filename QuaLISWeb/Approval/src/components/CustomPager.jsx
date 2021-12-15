import React, { useRef } from 'react';
//import '../pages/registration/registration.css'
import { Pager } from '@progress/kendo-react-data-tools';
import { injectIntl } from 'react-intl';
// import { withResizeDetector } from 'react-resize-detector';
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
import messages_en from '../assets/translations/en.json';
import messages_de from '../assets/translations/de.json';

const messages = {
  'en-US': messages_en,
  'ko-KR': messages_de
}

const CustomPager = (props) => {
  const ref = useRef(null);
  const handlePageChange = (e) => {
    props.handlePageChange(e)
  }
  loadMessages(messages[props.userInfo && props.userInfo.slanguagetypecode], "lang");
  const AdaptiveComponent = () => {
    // let divWidth =  JSON.parse(JSON.stringify(width) )
    return <div className={`pager_wrap ${props.width && props.width < (props.pagershowwidth ? props.pagershowwidth:33) ? 'show-list' : 'wrap-class'}`} ref={ref}>
      <LocalizationProvider language="lang">
        <Pager
          className="k-pagerheight"
          skip={parseInt(props.skip)}
          take={parseInt(props.take)}
          onPageChange={(e) => handlePageChange(e)}
          total={props.total}
          buttonCount={props.buttonCount}
          info={props.info}
          pageSizes={props.pageSize}
        // messagesMap={loadMessages(enMessages, "en")}
        />
      </LocalizationProvider>
    </div>;
  };
  // const AdaptiveWithDetector = withResizeDetector(AdaptiveComponent);
  return (
    // <AdaptiveWithDetector />
    <AdaptiveComponent />
  )
}
export default injectIntl(CustomPager);
