(function(){
 var b=document.getElementById('mb'),m=document.getElementById('mm'),i=document.getElementById('mi');
 function set(o){m.classList.toggle('hidden',!o);m.classList.toggle('flex',o);b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');i.setAttribute('d',o?'M5 5l14 14M19 5L5 19':'M3 7h18M3 12h18M3 17h18')}
 b.addEventListener('click',function(){set(m.classList.contains('hidden'))});
 m.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
 var tabs=[].slice.call(document.querySelectorAll('[role=tab]'));
 function pick(k){tabs.forEach(function(t,j){var on=j===k;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;document.getElementById('p'+j).hidden=!on});tabs[k].focus()}
 tabs.forEach(function(t,k){t.addEventListener('click',function(){pick(k)});t.addEventListener('keydown',function(e){if(e.key==='ArrowRight')pick((k+1)%tabs.length);if(e.key==='ArrowLeft')pick((k+tabs.length-1)%tabs.length)})});
 var ba=document.getElementById('ba'),bar=document.getElementById('bar');bar.addEventListener('input',function(){ba.style.setProperty('--pos',bar.value+'%')});
 document.getElementById('pf').addEventListener('submit',function(e){e.preventDefault();document.getElementById('ok').textContent='Thank you. We will reply within 2 business days.';e.target.reset()});
})();
