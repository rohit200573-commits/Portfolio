import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <section id="contact" className="py-32 border-t border-surface-border">
      <div className="flex flex-col lg:flex-row justify-between gap-16">
        
        <div className="lg:w-1/2">
          <h2 className="text-massive font-display font-black tracking-tighter leading-none mb-6">
            LET'S<br/>TALK
          </h2>
          <p className="text-secondary text-body-lg max-w-sm mb-12">
            HAVE A PROJECT IN MIND OR JUST WANT TO SAY HI? FEEL FREE TO REACH OUT.
          </p>
        </div>

        <div className="lg:w-1/2 relative">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="5de1ebb9-081e-42b2-8768-642b538b37e1" />
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative w-full group">
                <input type="text" id="name" name="name" placeholder="YOUR NAME" required className="w-full bg-transparent border-b border-surface-border py-4 text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-secondary/50 font-bold tracking-widest text-sm uppercase peer" />
              </div>
              <div className="relative w-full group">
                <input type="email" id="email" name="email" placeholder="YOUR EMAIL" required className="w-full bg-transparent border-b border-surface-border py-4 text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-secondary/50 font-bold tracking-widest text-sm uppercase peer" />
              </div>
            </div>
            
            <div className="relative w-full group">
              <input type="text" id="subject_msg" name="subject_msg" placeholder="SUBJECT" required className="w-full bg-transparent border-b border-surface-border py-4 text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-secondary/50 font-bold tracking-widest text-sm uppercase peer" />
            </div>
            
            <div className="relative w-full group">
              <textarea id="message" name="message" rows="4" placeholder="PROJECT DETAILS" required className="w-full bg-transparent border-b border-surface-border py-4 text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-secondary/50 font-bold tracking-widest text-sm uppercase peer resize-none"></textarea>
            </div>
            
            {/* Honeypot/Botcheck */}
            <input type="checkbox" name="botcheck" id="botcheck" className="hidden" tabIndex="-1" />
            <div className="hidden">
              <input type="text" id="website" name="website" tabIndex="-1" />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="self-start px-8 py-4 bg-primary text-background rounded-full font-bold tracking-widest text-sm uppercase hover:bg-accent hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'SENDING...' : 'SEND MESSAGE \u2192'}
            </motion.button>
          </form>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: toast.visible ? 1 : 0, y: toast.visible ? 0 : 10 }}
            className={`absolute bottom-[-60px] left-0 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase ${toast.type === 'error' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-green-500/20 text-green-500 border border-green-500/50'}`}
            style={{ pointerEvents: toast.visible ? 'auto' : 'none' }}
          >
            {toast.message}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

export default Contact;
