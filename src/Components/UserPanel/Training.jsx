import React from 'react'
import './Home.css';
import image1 from '../../Assets/icon4.webp';
import Hadoop from '../../Assets/hadoop.webp'
import Salesforce from '../../Assets/Salesforce.webp';
import Blueprism from '../../Assets/BluePrism.webp';
import Service from '../../Assets/ServiceNow.webp';
import Aws from '../../Assets/AWS.webp';
import Pega from '../../Assets/pega.webp';
import Ios from '../../Assets/ios 2.webp';
import Rpa from '../../Assets/uiPath.webp';
import bi from '../../Assets/Power BI.webp';


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
