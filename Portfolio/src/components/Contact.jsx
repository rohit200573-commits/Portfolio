import { useState } from 'react';

function Contact() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Honeypot checks
    if (formData.get('website')) return;
    if (formData.get('botcheck') === 'on') return;

    setLoading(true);

    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject_msg');
    const rawMsg = formData.get('message');

    try {
      // Web3Forms payload
      const web3Data = new FormData();
      web3Data.append('access_key', '5de1ebb9-081e-42b2-8768-642b538b37e1');
      web3Data.append('name', name);
      web3Data.append('email', email);
      web3Data.append('subject', `[Portfolio] ${subject} — from ${name}`);
      web3Data.append('message', rawMsg);

      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3Data
      });
      const w3Json = await w3Res.json();

      if (!w3Json.success) {
        throw new Error(w3Json.message || 'Submission failed.');
      }

      // Also save to our backend
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message: rawMsg, website: '' })
      }).catch(() => {});

      showToast('MESSAGE SENT.', 'success');
      e.target.reset();

    } catch (error) {
      console.error('Contact error:', error);
      showToast(error.message || 'ERROR. EMAIL DIRECTLY.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact reveal-on-scroll">
      <div className="contact-inner">
        <h2 className="massive-text">LET'S TALK</h2>
        <div className="contact-form-wrapper">
          <form className="minimal-form" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="5de1ebb9-081e-42b2-8768-642b538b37e1" />
            
            <div className="form-row">
              <input type="text" id="name" name="name" placeholder="YOUR NAME" required />
              <input type="email" id="email" name="email" placeholder="YOUR EMAIL" required />
            </div>
            
            <input type="text" id="subject_msg" name="subject_msg" placeholder="SUBJECT" required />
            <textarea id="message" name="message" rows="3" placeholder="PROJECT DETAILS" required></textarea>
            
            {/* Honeypot/Botcheck */}
            <input type="checkbox" name="botcheck" id="botcheck" style={{ display: 'none' }} tabIndex="-1" />
            <div className="form-group honeypot-field" style={{ display: 'none' }}>
              <input type="text" id="website" name="website" tabIndex="-1" />
            </div>

            <button type="submit" className="btn-pill inverted" disabled={loading}>
              <span>{loading ? 'SENDING...' : 'SEND MESSAGE \u2192'}</span>
            </button>
          </form>
          
          <div className={`toast ${toast.visible ? '' : 'hidden'} ${toast.type === 'error' ? 'toast-error' : ''}`}>
            {toast.message}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
