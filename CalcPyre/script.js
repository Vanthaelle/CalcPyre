// Same calculator logic as before
const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');
const keys = document.getElementById('keys');
let expression='';

function render(){
  exprEl.textContent=expression||'0';
  const val=evaluateSafe(expression);
  resultEl.textContent=val!==null?String(val):'0';
}
function sanitizeForEval(s){return s.replace(/[^0-9+\-*/().\s]/g,'');}
function balancedParens(s){
  let d=0; for(const ch of s){if(ch==='(')d++; if(ch===')'){d--; if(d<0)return false;} }
  return d===0;
}
function evaluateSafe(s){
  if(!s||s.trim()==='')return null;
  const clean=sanitizeForEval(s);
  if(!balancedParens(clean))return null;
  if(/[+\-*/.]$/.test(clean.trim()))return null;
  try{
    const val=Function('"use strict";return('+clean+')')();
    return(typeof val==='number'&&isFinite(val))?Math.round(val*1e12)/1e12:null;
  }catch{return null;}
}
keys.addEventListener('click',e=>{
  const btn=e.target.closest('button[data-key]');
  if(!btn)return;
  handleKey(btn.getAttribute('data-key'));
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();handleKey('=');}
  else if(e.key==='Backspace'){e.preventDefault();handleKey('back');}
  else if(e.key==='Escape'){handleKey('clear');}
  else if(/^[0-9+\-*/().]$/.test(e.key)){handleKey(e.key);}
});
function handleKey(k){
  if(k==='clear'){expression='';render();return;}
  if(k==='back'){expression=expression.slice(0,-1);render();return;}
  if(k==='='){
    const val=evaluateSafe(expression);
    if(val!==null){expression=String(val);render();}
    else{resultEl.textContent='ERR';setTimeout(render,700);}
    return;
  }
  expression+=k;render();
}
render();