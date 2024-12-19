import React from 'react'

const ImportLead = () => {
  return (
    <div className="import-lead-form">
    <form>
     <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:'2vw'}}>
      <p>CSV File Format</p>
      <buttton className='download-btn'>Download</buttton>
     </div>
     <div className='lead-form'>
     <div className="mb-3">
<label for="formFile" class="form-label">Upload CSV file</label>
<input class="form-control" type="file" id="formFile"/>
<p>Note : Upload the Leads carefully using CSV File Format to  upload Multiple Leads.</p>
<button className='upload-btn'>Upload</button>
</div>
</div>
    </form>
  </div>
  )
}

export default ImportLead