// JobApplicationForm.jsx
import React, { useState } from 'react';
import styles from './JobApplicationForm.module.css';

const departments = [
  'Engineering', 'Sales', 'Marketing', 'HR',
  'Finance', 'Operations', 'Support', 'Product'
];

const positions = {
  Engineering:  ['Frontend Dev', 'Backend Dev', 'Full Stack', 'DevOps', 'QA Engineer'],
  Sales:        ['Sales Rep', 'Account Exec', 'Sales Manager'],
  Marketing:    ['Marketing Spec', 'Content Writer', 'SEO Specialist', 'Social Media'],
  HR:           ['HR Generalist', 'Recruiter', 'HR Manager'],
  Finance:      ['Financial Analyst', 'Accountant', 'Finance Manager'],
  Operations:   ['Ops Manager', 'Project Manager', 'Business Analyst'],
  Support:      ['Support Specialist', 'Customer Success'],
  Product:      ['Product Manager', 'Product Owner', 'Product Analyst']
};

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '',
    department: '', position: '', employmentType: 'full-time',
    expectedSalary: '', startDate: '',
    experience: '', education: '', skills: '', portfolio: '', linkedin: '',
    resume: null, coverLetter: null,
    relocation: 'no', workAuthorization: 'yes', noticePeriod: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  // const [submitted, setSubmitted] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
  const set = (name, value) => {
    setFormData(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') set(name, files[0]);
    else if (type === 'checkbox') set(name, checked);
    else set(name, value);
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim())  e.firstName  = 'Required';
    if (!formData.lastName.trim())   e.lastName   = 'Required';
    if (!formData.email.trim())      e.email      = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.phone.trim())      e.phone      = 'Required';
    if (!formData.department)        e.department = 'Required';
    if (!formData.position)          e.position   = 'Required';
    if (!formData.resume)            e.resume     = 'Resume is required';
    if (!formData.agreeTerms)        e.agreeTerms = 'Please confirm to proceed';
    return e;
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const errs = validate();

  if (Object.keys(errs).length !== 0) {
    setErrors(errs);
    return;
  }

  try {
    const form = new FormData();

    const requestData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      department: formData.department,
      position: formData.position,
      employmentType: formData.employmentType,
      expectedSalary: formData.expectedSalary,
      startDate: formData.startDate,
      experience: formData.experience,
      education: formData.education,
      skills: formData.skills,
      portfolio: formData.portfolio,
      linkedin: formData.linkedin,
      relocation: formData.relocation,
      noticePeriod: formData.noticePeriod
    };

    form.append(
      "data",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    form.append("resume", formData.resume);

    const res = await fetch(
      "https://api.test.hachion.co/job-application-aboutus",
      {
        method: "POST",
        body: form
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to submit application");
    }

    setSuccessMessage("Application submitted successfully!");
    setErrorMessage("");
    setSubmitted(true);

  } catch (error) {
    setErrorMessage(error.message || "Something went wrong");
    setSuccessMessage("");
  }
};

  // Live progress: count filled required fields (max 5 steps)
  const filledCount = [
    formData.firstName, formData.lastName, formData.email, formData.phone,
    formData.department, formData.position, formData.resume, formData.agreeTerms
  ].filter(Boolean).length;
  const progressLevel = Math.round((filledCount / 8) * 5);

  // ── Sub-components ────────────────────────────

  const Field = ({ label, required, error, children }) => (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.labelReq}> *</span>}
        </label>
      )}
      {children}
      {error && <span className={styles.errorMessage}>⚠ {error}</span>}
    </div>
  );

  const Toggle = ({ name, options }) => (
    <div className={styles.toggleGroup}>
      {options.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          className={`${styles.toggle} ${formData[name] === value ? styles.toggleSelected : ''}`}
          onClick={() => set(name, value)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const FileField = ({ name, label, hint, required, error }) => {
    const file = formData[name];
    return (
      <Field label={label} required={required} error={error}>
        <div className={`${styles.fileInput} ${file ? styles.fileInputActive : ''}`}>
          <input
            type="file"
            name={name}
            accept=".pdf,.doc,.docx"
            className={styles.file}
            onChange={handleChange}
          />
          <div className={styles.fileIcon}>{file ? '✅' : '📄'}</div>
          <div className={styles.fileText}>
            <span className={styles.fileLabel}>
              {file ? file.name : `Upload ${label}`}
            </span>
            <span className={styles.fileHint}>{hint}</span>
          </div>
        </div>
      </Field>
    );
  };

  // ── Success State ─────────────────────────────
  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.successScreen}>
            <div className={styles.successIcon}>🎉</div>
            <div className={styles.successTitle}>Application Sent!</div>
            <p className={styles.successSub}>
              Thanks <strong>{formData.firstName}</strong>! We've received your
              application and will be in touch within 3–5 business days.
            </p>
            <button
              className={styles.backBtn}
              onClick={() => { setSubmitted(false); setFormData(f => ({ ...f, agreeTerms: false, resume: null, coverLetter: null })); }}
            >
              ← Submit Another
            </button>
          </div>
          <div className={styles.footerNote}>
            Your data is encrypted and handled per our privacy policy.
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ─────────────────────────────────
  return (
    <div className={styles.container}>
      {/* Brand bar sits outside the card */}
      <div style={{ width: '100%', maxWidth: 680, margin: '0 auto' }}>
        <div className={styles.brandBar}>
          <div className={styles.brandDot} />
          <span className={styles.brandText}>Careers · Open Positions</span>
        </div>

        <div className={styles.formWrapper}>

          {/* ── Hero ── */}
          <div className={styles.heroSection}>
            <div className={styles.heroTag}>
              <div className={styles.heroTagDot} />
              Now Hiring
            </div>
            <h1 className={styles.heroTitle}>
              Shape the <span className={styles.heroAccent}>future</span>
              <br />with your talent.
            </h1>
            <p className={styles.heroSub}>Complete the form below — takes less than 5 minutes.</p>

            {/* Decorative SVG */}
            <svg className={styles.heroDeco} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="55" stroke="white" strokeWidth="1" strokeDasharray="6 4"/>
              <circle cx="60" cy="60" r="38" stroke="white" strokeWidth="1" opacity="0.6"/>
              <circle cx="60" cy="60" r="20" stroke="white" strokeWidth="1" opacity="0.4"/>
              <line x1="5"  y1="60" x2="115" y2="60"  stroke="white" strokeWidth="0.6" opacity="0.4"/>
              <line x1="60" y1="5"  x2="60"  y2="115" stroke="white" strokeWidth="0.6" opacity="0.4"/>
            </svg>
          </div>

          {/* ── Progress ── */}
          <div className={styles.progressBar}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`${styles.progressStep} ${
                  i < progressLevel
                    ? styles.progressDone
                    : i === progressLevel
                    ? styles.progressActive
                    : ''
                }`}
              />
            ))}
          </div>
{errorMessage && (
  <div className={styles.errorMessage} style={{marginBottom:"1rem"}}>
    ⚠ {errorMessage}
  </div>
)}

{successMessage && (
  <div className={styles.successMessage} style={{marginBottom:"1rem",color:"green"}}>
    ✅ {successMessage}
  </div>
)}
          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Section 01 — Personal */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>👤</div>
                <span className={styles.sectionTitle}>Personal Information</span>
                <span className={styles.sectionCount}>01 / 04</span>
              </div>

              <div className={styles.row}>
                <Field label="First Name" required error={errors.firstName}>
                  <input
                    className={`${styles.input} ${errors.firstName ? styles.errorInput : ''}`}
                    name="firstName" placeholder="Alex"
                    value={formData.firstName} onChange={handleChange}
                  />
                </Field>
                <Field label="Last Name" required error={errors.lastName}>
                  <input
                    className={`${styles.input} ${errors.lastName ? styles.errorInput : ''}`}
                    name="lastName" placeholder="Johnson"
                    value={formData.lastName} onChange={handleChange}
                  />
                </Field>
              </div>

              <div className={styles.row}>
                <Field label="Email" required error={errors.email}>
                  <input
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                    name="email" placeholder="alex@email.com"
                    value={formData.email} onChange={handleChange}
                  />
                </Field>
                <Field label="Phone" required error={errors.phone}>
                  <input
                    type="tel"
                    className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
                    name="phone" placeholder="+1 555 000 0000"
                    value={formData.phone} onChange={handleChange}
                  />
                </Field>
              </div>

              <Field label="Address">
                <input
                  className={styles.input}
                  name="address" placeholder="City, Country"
                  value={formData.address} onChange={handleChange}
                />
              </Field>
            </div>

            {/* Section 02 — Role */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>💼</div>
                <span className={styles.sectionTitle}>Role & Employment</span>
                <span className={styles.sectionCount}>02 / 04</span>
              </div>

              <div className={styles.row}>
                <Field label="Department" required error={errors.department}>
                  <select
                    className={`${styles.select} ${errors.department ? styles.errorInput : ''}`}
                    name="department"
                    value={formData.department}
                    onChange={(e) => { set('department', e.target.value); set('position', ''); }}
                  >
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Position" required error={errors.position}>
                  <select
                    className={`${styles.select} ${errors.position ? styles.errorInput : ''}`}
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    disabled={!formData.department}
                  >
                    <option value="">Select position</option>
                    {(positions[formData.department] || []).map(p => <option key={p}>{p}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Employment Type">
                <Toggle name="employmentType" options={[
                  { label: 'Full Time', value: 'full-time' },
                  { label: 'Part Time', value: 'part-time' },
                  { label: 'Contract',  value: 'contract'  }
                ]} />
              </Field>

              <div className={styles.row}>
                <Field label="Expected Salary ($)">
                  <input
                    type="number"
                    className={styles.input}
                    name="expectedSalary" placeholder="85,000"
                    value={formData.expectedSalary} onChange={handleChange}
                  />
                </Field>
                <Field label="Earliest Start Date">
                  <input
                    type="date"
                    className={styles.input}
                    name="startDate"
                    value={formData.startDate} onChange={handleChange}
                  />
                </Field>
              </div>
            </div>

            {/* Section 03 — Professional */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>🚀</div>
                <span className={styles.sectionTitle}>Professional Background</span>
                <span className={styles.sectionCount}>03 / 04</span>
              </div>

              <div className={styles.row}>
                <Field label="Years of Experience">
                  <input
                    type="number"
                    className={styles.input}
                    name="experience" placeholder="5" min="0" step="0.5"
                    value={formData.experience} onChange={handleChange}
                  />
                </Field>
                <Field label="Highest Education">
                  <select
                    className={styles.select}
                    name="education"
                    value={formData.education} onChange={handleChange}
                  >
                    <option value="">Select level</option>
                    <option value="highschool">High School</option>
                    <option value="bachelor">Bachelor's</option>
                    <option value="master">Master's</option>
                    <option value="phd">PhD</option>
                  </select>
                </Field>
              </div>

              <Field label="Key Skills">
                <textarea
                  className={styles.textarea}
                  name="skills" placeholder="React, Node.js, Figma, SQL…" rows="2"
                  value={formData.skills} onChange={handleChange}
                />
              </Field>

              <div className={styles.row}>
                <Field label="Portfolio URL">
                  <input
                    type="url" className={styles.input}
                    name="portfolio" placeholder="https://yoursite.com"
                    value={formData.portfolio} onChange={handleChange}
                  />
                </Field>
                <Field label="LinkedIn URL">
                  <input
                    type="url" className={styles.input}
                    name="linkedin" placeholder="https://linkedin.com/in/…"
                    value={formData.linkedin} onChange={handleChange}
                  />
                </Field>
              </div>

              <div className={styles.row}>
                <Field label="Open to Relocation?">
                  <Toggle name="relocation" options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No',  value: 'no'  }
                  ]} />
                </Field>
                <Field label="Notice Period">
                  <input
                    className={styles.input}
                    name="noticePeriod" placeholder="e.g. 30 days"
                    value={formData.noticePeriod} onChange={handleChange}
                  />
                </Field>
              </div>
            </div>

            {/* Section 04 — Documents */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>📎</div>
                <span className={styles.sectionTitle}>Documents</span>
                <span className={styles.sectionCount}>04 / 04</span>
              </div>

              <FileField
                name="resume" label="Resume / CV"
                hint="PDF, DOC, DOCX · Max 10MB"
                required error={errors.resume}
              />
              {/* <FileField
                name="coverLetter" label="Cover Letter"
                hint="PDF, DOC, DOCX · Max 5MB (optional)"
              /> */}
            </div>

            {/* Submit */}
            <div className={styles.section}>
              <label className={styles.terms}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span className={styles.termsText}>
                  I confirm that all information provided is{' '}
                  <strong>accurate and complete</strong>,
                  and I agree to the application terms and conditions.
                </span>
              </label>
              {errors.agreeTerms && (
                <span className={styles.errorMessage} style={{ marginBottom: '1rem', display: 'flex' }}>
                  ⚠ {errors.agreeTerms}
                </span>
              )}

              <button type="submit" className={styles.submitButton}>
                <span>Submit Application</span>
                <span>→</span>
              </button>
            </div>

          </form>

          <div className={styles.footerNote}>
            Your data is encrypted and handled in accordance with our privacy policy.
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;