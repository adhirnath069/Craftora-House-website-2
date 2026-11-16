(function(){
 var KEY='cx-edits:'+location.pathname, editing=false, bar, msg, imgInput, pending=null;
 var SKIP='SCRIPT,STYLE,SVG,NOSCRIPT,SELECT,TEXTAREA,INPUT,OPTION,IFRAME';
 function ownText(el){for(var n=el.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&n.nodeValue.trim())return true;return false}
 function inSkip(el){for(;el&&el!==document.body;el=el.parentElement){if(SKIP.indexOf(el.tagName.toUpperCase())>-1||el.id==='cx-bar')return true}return false}
 var texts=[];
 function collect(){
  texts=[];var all=document.body.querySelectorAll('*');
  for(var i=0;i<all.length;i++){var el=all[i];
   if(inSkip(el)||!ownText(el))continue;
   if(el.parentElement&&el.parentElement.closest('[data-cx-t]'))continue;
   el.setAttribute('data-cx-t',texts.length);texts.push(el)}
 }
 function imgs(){return [].slice.call(document.querySelectorAll('img')).filter(function(i){return !inSkip(i)})}
 function say(t){msg.textContent=t}
 function save(quiet){
  try{
   var data={t:texts.map(function(e){return e.innerHTML}),i:imgs().map(function(i){return i.getAttribute('src')})};
   localStorage.setItem(KEY,JSON.stringify(data));if(!quiet)say('Saved in this browser');
  }catch(e){say('Could not save here (use Export HTML)')}
 }
 function restore(){
  try{var d=JSON.parse(localStorage.getItem(KEY)||'null');if(!d)return;
   if(d.t&&d.t.length===texts.length)d.t.forEach(function(h,k){if(texts[k].innerHTML!==h)texts[k].innerHTML=h});
   var im=imgs();if(d.i&&d.i.length===im.length)d.i.forEach(function(s,k){if(s&&im[k].getAttribute('src')!==s)im[k].src=s});
  }catch(e){}
 }
 var t;function later(){clearTimeout(t);t=setTimeout(function(){save(true);say('Autosaved')},700)}
 function setEditing(on){
  editing=on;document.body.classList.toggle('cx-editing',on);bar.classList.toggle('cx-on',on);
  texts.forEach(function(e){if(on)e.setAttribute('contenteditable','true');else e.removeAttribute('contenteditable')});
  document.getElementById('cx-toggle').textContent=on?'Done':'✎ Edit page';
  document.getElementById('cx-toggle').className=on?'':'cx-primary';
  say(on?'Click text to edit. Click a photo to replace it.':'');
  if(!on)save(true);
 }
 function cleanHTML(){
  var c=document.documentElement.cloneNode(true);
  var b=c.querySelector('#cx-bar');if(b)b.remove();
  [].forEach.call(c.querySelectorAll('[contenteditable]'),function(e){e.removeAttribute('contenteditable')});
  [].forEach.call(c.querySelectorAll('[data-cx-t]'),function(e){e.removeAttribute('data-cx-t')});
  [].forEach.call(c.querySelectorAll('.cx-hover'),function(e){e.classList.remove('cx-hover')});
  c.querySelector('body').classList.remove('cx-editing');
  if(!c.querySelector('body').getAttribute('class'))c.querySelector('body').removeAttribute('class');
  return '<!doctype html>\n'+c.outerHTML;
 }
 function exportHTML(){
  var blob=new Blob([cleanHTML()],{type:'text/html'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='craftora-home-edited.html';bar.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href)},2000);say('Exported edited page');
 }
 function shrink(file,cb){
  var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){
   var M=1600,s=Math.min(1,M/Math.max(im.width,im.height)),c=document.createElement('canvas');
   c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
   cb(c.toDataURL('image/jpeg',.85))};im.onerror=function(){say('Could not read that image')};im.src=r.result};r.readAsDataURL(file)
 }
 function imgAt(x,y){var l=document.elementsFromPoint(x,y);for(var i=0;i<l.length;i++)if(l[i].tagName==='IMG'&&!inSkip(l[i]))return l[i];return null}
 function build(){
  bar=document.createElement('div');bar.id='cx-bar';
  bar.innerHTML='<span id="cx-msg"></span><button class="cx-only" id="cx-save">Save</button><button class="cx-only" id="cx-export">Export HTML</button><button class="cx-only" id="cx-reset">Reset</button><button id="cx-toggle" class="cx-primary">✎ Edit page</button>';
  document.body.appendChild(bar);msg=bar.querySelector('#cx-msg');
  imgInput=document.createElement('input');imgInput.type='file';imgInput.accept='image/*';imgInput.style.display='none';bar.appendChild(imgInput);
  imgInput.addEventListener('change',function(){var f=imgInput.files[0],target=pending;imgInput.value='';if(!f||!target)return;
   shrink(f,function(u){target.src=u;save();});});
  bar.querySelector('#cx-toggle').onclick=function(){setEditing(!editing)};
  bar.querySelector('#cx-save').onclick=function(){save()};
  bar.querySelector('#cx-export').onclick=exportHTML;
  bar.querySelector('#cx-reset').onclick=function(){if(confirm('Discard all saved edits and reload the original?')){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}};
  document.addEventListener('click',function(e){
   if(!editing||e.target.closest('#cx-bar'))return;
   var im=imgAt(e.clientX,e.clientY);
   if(im){e.preventDefault();e.stopPropagation();pending=im;imgInput.click();return}
   if(e.target.closest('[role=tab]'))return;
   if(e.target.closest('a,button,summary,label')){e.preventDefault()}
  },true);
  document.addEventListener('submit',function(e){if(editing){e.preventDefault();e.stopImmediatePropagation()}},true);
  document.addEventListener('keydown',function(e){if(editing&&e.target.closest&&e.target.closest('[data-cx-t]')){e.stopPropagation();if(e.key===' '&&e.target.closest('button,summary'))e.preventDefault()&&0}},true);
  document.addEventListener('keyup',function(e){if(editing&&e.key===' '&&e.target.closest&&e.target.closest('button,summary,a'))e.preventDefault()},true);
  document.addEventListener('input',function(e){if(editing&&e.target.closest&&e.target.closest('[data-cx-t]'))later()});
  document.addEventListener('paste',function(e){if(!editing||!e.target.closest||!e.target.closest('[data-cx-t]'))return;
   e.preventDefault();var s=(e.clipboardData||window.clipboardData).getData('text/plain');document.execCommand('insertText',false,s)});
  var last=null;
  document.addEventListener('mousemove',function(e){if(!editing)return;var im=imgAt(e.clientX,e.clientY);
   if(im!==last){if(last)last.classList.remove('cx-hover');if(im)im.classList.add('cx-hover');last=im}});
 }
 function init(){collect();restore();build()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
