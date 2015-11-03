var textInput=document.getElementById("text");var ramInput=document.getElementById("ram");var initialPcInput=document.getElementById("initialpc");var recLimInput=document.getElementById("recursionlimit");var pcText=document.getElementById("PC");var pswText=document.getElementById("PSW");var r0Text=document.getElementById("R0");var r1Text=document.getElementById("R1");var r2Text=document.getElementById("R2");var r3Text=document.getElementById("R3");var errorText=document.getElementById("error");if(!String.prototype.trim){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}}function rsv(){errorText.innerHTML="";var r=textInput.value.trim();var e=ramInput.value.trim();var t=initialPcInput.value.trim();var a=recLimInput.value.trim();if(r.length===0)pE("Text is empty");if(e.length===0)pE("RAM is empty");if(t.length===0)pE("Initial PC is empty");if(a.length===0)pE("recLim is empty");if(isNaN(t))pE("Initial PC "+t+" is not a number");if(isNaN(a))pE("Recursion limit "+a+" is not a number");t=parseInt(t);a=parseInt(a);r=r.replace(/\(\*.*\*\)/g,"");r=r.split("\n");var n=[];var i=[];if(e.charAt(0)==="["){if(e.charAt(e.length-1)!=="]")pE("Mismatched brackets: "+e);e=e.substring(1,e.length-1)}e=e.split(";");if(e.length===0)pE("RAM parse error");for(var s=0;s<e.length;s++){i.push(parseInt(e[s]))}for(var s=0;s<r.length;s++){n.push(pI(r[s]))}var c=new Img(i,n);console.log(c);sv(c,t,a)}function pI(r){r=r.trim();if(r.charAt(r.length-1)===";")r=r.substring(0,r.length-1);var e=r.substring(0,3);switch(e){case"Lod":case"Sto":case"Mov":case"Add":case"Sub":case"Mul":case"Div":case"Cmp":var t=r.match(/{(.*)}/);if(t.length!==2)pE("Parse error for "+r);var a={};t=t[1].split(";");for(var n=0;n<t.length;n++){var i=t[n].split("=");var s=i[0].trim();var c=i[1].trim();if(!isNaN(c))c=parseInt(c);a[s]=c}return new Inst(e,a);case"Blt":case"Beq":case"Bgt":case"Jmp":var l=r.substring(3);var v=l.trim();if(v.charAt(0)==="("){if(v.charAt(v.length-1)!==")")pE("Mismatched parentheses: "+r);v=v.substring(1,v.length-1)}if(isNaN(v))pE("Int expected for "+r);v=parseInt(v);var a={};a.displacement=v;return new Inst(e,a);case"Cpz":var l=r.substring(3);var u=l.trim();if(!(u==="R0"||u==="R1"||u==="R2"||u==="R3"))pE("Register expected for "+r);var a={};a.r=u;return new Inst(e,a);case"Hlt":return new Inst(e,{});default:pE("Unknown instruction "+e)}}function pE(r){errorText.innerHTML+=r+"\n";throw r}function pS(r,e,t){pcText.value=r;pswText.value=e;r0Text.value=t.r0;r1Text.value=t.r1;r2Text.value=t.r2;r3Text.value=t.r3}function Inst(r,e){this.type=r;this.vals=e}function Rgs(r,e,t,a){this.r0=r;this.r1=e;this.r2=t;this.r3=a}function Img(r,e){this.data=r;this.text=e}function reG(r,e){switch(r){case"R0":return e.r0;case"R1":return e.r1;case"R2":return e.r2;case"R3":return e.r3;default:pE("Unknown register "+r)}}function reP(r,e,t){switch(e){case"R0":return new Rgs(r,t.r1,t.r2,t.r3);case"R1":return new Rgs(t.r0,r,t.r2,t.r3);case"R2":return new Rgs(t.r0,t.r1,r,t.r3);case"R3":return new Rgs(t.r0,t.r1,t.r2,r);default:pE("Unknown register "+e)}}function raG(r,e){return e[r]}function raP(r,e,t){var a=t.slice();a.splice(e,0,r);return a}function cy(r,e,t,a,n,i){if(n>i)pE("Recursion limit "+i+" exceeded");var s=a.text;var c=a.data;var l=raG(r,s);var v=r+1;pS(r,e,t);switch(l.type){case"Lod":var u=l.vals.rd;var o=l.vals.addr;var p=raG(o,c);var m=reP(p,u,t);cy(v,e,m,a,n+1,i);break;case"Sto":var g=l.vals.rs;var o=l.vals.addr;var p=reG(g,t);var d=raP(p,o,c);cy(v,e,t,new Img(d,s),n+1,i);break;case"Mov":var u=l.vals.rd;var g=l.vals.rs;var f=reG(g,t);var m=reP(f,u,t);cy(v,e,m,a,n+1,i);break;case"Add":var u=l.vals.rd;var g=l.vals.rs;var h=l.vals.rt;var I=reG(g,t);var y=reG(h,t);var m=reP(I+y,u,t);cy(v,e,m,a,n+1,i);break;case"Sub":var u=l.vals.rd;var g=l.vals.rs;var h=l.vals.rt;var I=reG(g,t);var y=reG(h,t);var m=reP(I-y,u,t);cy(v,e,m,a,n+1,i);break;case"Mul":var u=l.vals.rd;var g=l.vals.rs;var h=l.vals.rt;var I=reG(g,t);var y=reG(h,t);var m=reP(I*y,u,t);cy(v,e,m,a,n+1,i);break;case"Div":var u=l.vals.rd;var g=l.vals.rs;var h=l.vals.rt;var I=reG(g,t);var y=reG(h,t);var m=reP(Math.floor(I/y),u,t);cy(v,e,m,a,n+1,i);break;case"Cmp":var g=l.vals.rs;var h=l.vals.rt;var I=reG(g,t);var y=reG(h,t);var p=I-y;cy(v,p,t,a,n+1,i);break;case"Cpz":var E=l.vals.r;var p=reG(E,t);cy(v,p,t,a,n+1,i);break;case"Blt":var R=l.vals.displacement;if(e<0)cy(v+R,e,t,a,n+1,i);else cy(v,e,t,a,n+1,i);break;case"Beq":var R=l.vals.displacement;if(e===0)cy(v+R,e,t,a,n+1,i);else cy(v,e,t,a,n+1,i);break;case"Bgt":var R=l.vals.displacement;if(e>0)cy(v+R,e,t,a,n+1,i);else cy(v,e,t,a,n+1,reclim);break;case"Jmp":var R=l.vals.displacement;cy(v+R,e,t,a,n+1,i);break;case"Hlt":console.log("Halt");pS(r,e,t);break;default:pE("Unknown instruction "+l)}}function sv(r,e,t){var a=0;var n={r0:0,r1:0,r2:0,r3:0};cy(e,a,n,r,0,t)}
