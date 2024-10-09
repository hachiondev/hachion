import React from 'react'
import Curriculum from './Curriculum';
import QaFaqMain from './QaFaqMain';

const topics3 = [
    'What is Selenium 1.0 and Selenium 2.0?',
    'Why do we need webdriver when we have IDE available?',
    'What all browsers are supported by Webdriver?',
    'Is it true that if an object is identified using XPath then, my tests can break if I execute them on a separate browser?',
    'Can we program webdriver in any other language than Java?'
  ];
  const topics4=[
    'How can I configure the proxy if I need to?',
    'Is there any selenium support available to users for selenium?',
    'what is a hybrid framework?',
    'Are there frameworks over selenium available?',
    'Why selenium is a popular open source test solution for automation?'
  ]
const QaAutomationFaq = () => {
  return (
   <>
   <div>
   <QaFaqMain 
        heading="QA Automation FAQ's"
        topics={topics3}
        buttonText="Download FAQ's"
        additionalTopics={topics4}
      />

   </div>

   </>
  )
}

export default QaAutomationFaq