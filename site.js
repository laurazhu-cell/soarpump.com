/* Netlify Forms stores submissions for this site; mailbox alerts require separate Netlify configuration. */
const CONTACT_EMAIL='sales@soarpump.com';
const form=document.querySelector('#quote-form');
const status=document.querySelector('#form-status');
const navButton=document.querySelector('.mobile-menu');
const navLinks=document.querySelector('.navlinks');
navButton?.addEventListener('click',()=>{navLinks?.classList.toggle('open')});
form?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  if(['name','email','company','country'].some(key=>!String(data.get(key)||'').trim())){
    status.textContent='Please complete the required fields.';
    return;
  }
  if(String(data.get('bot-field')||'').trim())return;
  if(location.protocol==='file:'){
    status.textContent=`Online enquiries work on the published website. Please email ${CONTACT_EMAIL} instead.`;
    return;
  }
  const button=form.querySelector('[type="submit"]');
  button.disabled=true;
  status.textContent='Submitting your enquiry…';
  try{
    const response=await fetch(form.action,{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams(data).toString()
    });
    if(!response.ok)throw new Error('Form submission failed');
    form.reset();
    status.textContent='Thank you. Your enquiry was submitted to our website. We will reply by email.';
  }catch(error){
    status.textContent=`Your enquiry was not submitted. Please email ${CONTACT_EMAIL} directly.`;
  }finally{button.disabled=false;}
});
