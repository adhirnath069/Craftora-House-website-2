(function(){
 var KEY='cx-theme',root=document.documentElement,btns=[];
 function stored(){try{var t=localStorage.getItem(KEY);return t==='light'||t==='dark'?t:null}catch(e){return null}}
 function sys(){return window.matchMedia&&matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}
 function cur(){return root.getAttribute('data-theme')==='dark'?'dark':'light'}
 function paint(){var d=cur()==='dark';btns.forEach(function(b){b.setAttribute('aria-pressed',d);b.setAttribute('aria-label',d?'Switch to light theme':'Switch to dark theme');b.title=d?'Light theme':'Dark theme'})}
 function apply(t,animate){
  if(animate){root.classList.add('cx-theming');setTimeout(function(){root.classList.remove('cx-theming')},450)}
  root.setAttribute('data-theme',t);paint();
 }
 function make(extra){
  var b=document.createElement('button');b.type='button';b.className='cx-theme '+(extra||'');b.style.position='relative';
  b.innerHTML='<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 13.2A8.5 8.5 0 1 1 10.8 3a6.8 6.8 0 0 0 10.2 10.2z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  b.addEventListener('click',function(){var n=cur()==='dark'?'light':'dark';try{localStorage.setItem(KEY,n)}catch(e){}apply(n,true)});
  btns.push(b);return b;
 }
 function init(){
  if(!root.getAttribute('data-theme'))root.setAttribute('data-theme',stored()||sys());
  var nav=document.querySelector('header nav.nav');
  if(nav)nav.appendChild(make('md-desk'));
  var mb=document.getElementById('mb');
  if(mb&&mb.parentNode){var w=document.createElement('div');w.className='flex items-center gap-1 md:hidden';mb.parentNode.insertBefore(w,mb);w.appendChild(make());w.appendChild(mb)}
  paint();
  if(window.matchMedia){var mq=matchMedia('(prefers-color-scheme:dark)');var f=function(){if(!stored())apply(sys(),true)};mq.addEventListener?mq.addEventListener('change',f):mq.addListener&&mq.addListener(f)}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
