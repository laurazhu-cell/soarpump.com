/* Replace with the mailbox that should receive quote requests. */
const SITE_CONFIG={quoteEmail:'sales@soarpump.com',formEndpoint:''};
const form=document.querySelector('#quote-form');
const status=document.querySelector('#form-status');
const navButton=document.querySelector('.mobile-menu');
const navLinks=document.querySelector('.navlinks');
navButton?.addEventListener('click',()=>{navLinks?.classList.toggle('open')});
form?.addEventListener('submit',async event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  if(!data.name||!data.email||!data.company||!data.country){status.textContent='Please complete the required fields.';return}
  const subject=`Fire pump enquiry — ${data.company} — ${data.country}`;
  const body=[`Name: ${data.name}`,`Company: ${data.company}`,`Email: ${data.email}`,`Country: ${data.country}`,`Product / duty: ${data.product}`,`Quantity: ${data.quantity||'Not specified'}`,`Project details: ${data.message||'Not specified'}`].join('\n');
  if(SITE_CONFIG.formEndpoint){
    status.textContent='Sending your enquiry…';
    try{const response=await fetch(SITE_CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...data,subject,site:'Soar Pump'})});if(!response.ok)throw new Error('send failed');form.reset();status.textContent='Thank you. Your enquiry has been sent.'}catch(error){status.textContent='The online form could not send. Opening your email client instead.';window.location.href=`mailto:${SITE_CONFIG.quoteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
  }else{window.location.href=`mailto:${SITE_CONFIG.quoteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;status.textContent='Your email client should now open with the enquiry prepared.'}
});
