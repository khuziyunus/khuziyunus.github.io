const ENDPOINT='https://74cf7126dd9a.ngrok-free.app/web-message';
const messages=document.getElementById('messages');
const text=document.getElementById('text');
const send=document.getElementById('send');
const statusBox=document.getElementById('status');
const chat=document.querySelector('.chat');
const closeBtn=document.querySelector('.chat-close');
const overlay=document.createElement('div');
overlay.className='loading-overlay';
overlay.innerHTML='<div class="spinner"></div>';
chat.appendChild(overlay);
function addMsg(cls,content){
  const wrap=document.createElement('div');
  wrap.className='msg '+cls;
  const b=document.createElement('div');
  b.className='bubble';
  b.textContent=content;
  wrap.appendChild(b);
  messages.appendChild(wrap);
  messages.scrollTop=messages.scrollHeight;
}
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{ text.value=c.dataset.lang; }));
text.addEventListener('keydown',e=>{ if(e.key==='Enter'){ send.click(); } });
closeBtn.addEventListener('click',()=>{ chat.classList.toggle('hidden'); });
send.addEventListener('click',async()=>{
  const t=text.value.trim();
  if(!t){statusBox.textContent='Enter a message.';return}
  addMsg('user',t);
  try{
    send.disabled=true;
    statusBox.textContent='Processing…';
    statusBox.className='status';
    overlay.classList.add('show');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    const payload={ message:t };
    const res=await fetch(ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
      signal:controller.signal
    });
    const data=await res.json();
    statusBox.textContent=res.ok?'Answered':'Failed: '+res.status;
    statusBox.className=res.ok?'status ok':'status error';
    if(data&&data.answer){
      addMsg('bot',data.answer);
      if(data.source_language){
        statusBox.textContent+=` (language: ${data.source_language})`;
      }
    } else if(data&&data.error){
      statusBox.textContent='Error: '+data.error;
      statusBox.className='status error';
    }
  }catch(e){
    statusBox.textContent=String(e);
    statusBox.className='status error';
  }finally{
    send.disabled=false;
    text.value='';
    overlay.classList.remove('show');
    try{ clearTimeout(timeout); }catch(_){}
  }
});
