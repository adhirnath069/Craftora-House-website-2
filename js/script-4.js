(function(){
 document.documentElement.classList.add('js-ic');
 function go(){
  var list=[].slice.call(document.querySelectorAll('header button svg,main li>svg.w-\\[18px\\],main ul li>svg,footer a svg'));
  list=list.filter(function(s){return !s.closest('#mb')});
  var groups=new Map();
  list.forEach(function(s){
   s.classList.add('ico');
   [].forEach.call(s.querySelectorAll('path,rect,circle'),function(p){p.setAttribute('pathLength','1')});
   var g=s.parentElement.parentElement,n=groups.get(g)||0;groups.set(g,n+1);
   s.style.setProperty('--d',(n*.15)+'s');
  });
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.5}):null;
  list.forEach(function(s){io?io.observe(s):s.classList.add('on')});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
