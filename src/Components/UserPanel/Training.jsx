import React from 'react'
import './Home.css';
import image1 from '../../Assets/icon4.png';
import Hadoop from '../../Assets/hadoop.png'
import Salesforce from '../../Assets/Salesforce.png';
import Blueprism from '../../Assets/BluePrism.png';
import Service from '../../Assets/ServiceNow.png';
import Aws from '../../Assets/AWS.png';
import Pega from '../../Assets/pega.png';
import Ios from '../../Assets/ios 2.png';
import Rpa from '../../Assets/uiPath.png';
import bi from '../../Assets/Power BI.png';


 const Training = () => {
  return (
<>
<div className='training'>

<h1 className='training-heading'>Hachion Popular Training</h1>
<div className='training-first'>
<div className='training-list'>
  <img className='list-image' src={image1} alt='img1'/>
  <h4 className='training-name'>QA Automation</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Hadoop} alt='img2'/>
  <h4 className='training-name'>Hadoop</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Salesforce} alt='img3'/>
  <h4 className='training-name'>Salesforce</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Blueprism} alt='img1'/>
  <h4 className='training-name'>Blue Prism</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Service} alt='img1'/>
  <h4 className='training-name'>Service now</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Aws} alt='img1'/>
  <h4 className='training-name'>AWS Developer</h4>
</div>

</div>
<div className='training-second'>
<div className='training-list'>
  <img className='list-image' src={Aws} alt='img1'/>
  <h4 className='training-name'>AWS SysOps</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Pega} alt='img2'/>
  <h4 className='training-name'>Pega</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Ios} alt='img3'/>
  <h4 className='training-name'>IOS Developer</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={Rpa} alt='img1'/>
  <h4 className='training-name'>RPA UI Path</h4>
</div>
<div className='training-list'>
  <img className='list-image' src={bi} alt='img1'/>
  <h4 className='training-name'>Power BI</h4>
</div>
<div className='training-list'>
 
  <h3 className='view-more'>  View More Trainings</h3>
</div>

</div>
</div>
</>
  )
}
export default Training;
