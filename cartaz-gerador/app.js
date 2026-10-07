/* v18: autenticação por config.json */
let authConfig=null;
const AUTH_SESSION_KEY="a7_authenticated";
function lockApp(){document.body.classList.add("auth-locked");$("loginScreen").style.display="flex";setTimeout(()=>$("loginPassword")?.focus(),50)}
function unlockApp(){document.body.classList.remove("auth-locked");$("loginScreen").style.display="none";sessionStorage.setItem(AUTH_SESSION_KEY,"1")}
async function loadAuthConfig(){
  try{
    // Resolve o config.json a partir do próprio app.js. Isso evita problemas
    // quando o projeto está publicado em uma subpasta (ex.: GitHub Pages).
    const scriptEl=document.currentScript || [...document.scripts].find(x=>(x.src||'').endsWith('/app.js'));
    const configUrl=scriptEl?.src ? new URL('config.json', scriptEl.src).href : new URL('config.json', document.baseURI).href;
    const res=await fetch(configUrl,{cache:'no-store'});
    if(!res.ok) throw new Error(`config.json HTTP ${res.status}`);
    const data=await res.json();
    if(!data || typeof data.senha!=='string') throw new Error('config.json inválido');
    authConfig={senha:data.senha.trim()};
  }catch(err){
    console.error('Falha ao carregar config.json:',err);
    authConfig=null;
    const error=$('loginError');
    if(error) error.textContent='Não foi possível carregar a configuração da senha.';
  }
}
function initLogin(){
  lockApp();
  if(sessionStorage.getItem(AUTH_SESSION_KEY)==="1") unlockApp();
  $("loginForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const btn=$("loginBtn"), input=$("loginPassword"), error=$("loginError");
    error.textContent="";
    btn.disabled=true;
    if(!authConfig) await loadAuthConfig();
    if(authConfig && input.value.trim()===authConfig.senha){unlockApp();input.value="";return}
    error.textContent="Senha incorreta.";
    input.select();btn.disabled=false;
  });
}
let rows=[], carts=[], mode="padrao", currentPage=1, source="Result", selectedFile=null, printMode="current", workflowUnlocked=false;
const dynamics={10:"REGULAR",12:"OFERTA",13:"PRÓXIMO AO VENCIMENTO",15:"MARKDOWN",16:"FORA DE LINHA SEM PROMOÇÃO",19:"OFERTA 2 UNID",20:"FIDELIDADE CLUBE EXTRA",23:"A PARTIR DE",24:"LEVE / PAGUE",25:"OFERTA SEM PROMOÇÃO DE"};
const descDyn={10:"APROVEITE",12:"OFERTA",13:"PRÓXIMO AO VENCIMENTO",15:"ÚLTIMAS UNIDADES",16:"APROVEITE",20:"EXCLUSIVO CLUBE EXTRA",25:"APROVEITE"};

const $=id=>document.getElementById(id);
initLogin();
function canAccessPage(p){return p==="entrada" || workflowUnlocked}
function syncStepLock(){
  document.querySelectorAll(".step").forEach((b,i)=>{
    const locked=!workflowUnlocked && i>0;
    b.disabled=locked;
    b.setAttribute("aria-disabled",String(locked));
    b.classList.toggle("locked",locked);
  });
}
document.querySelectorAll(".step").forEach(b=>b.onclick=()=>{if(canAccessPage(b.dataset.page))showPage(b.dataset.page)});
document.querySelectorAll(".page-nav button[data-prev], .page-nav button[data-next]").forEach(b=>b.onclick=()=>showPage(b.dataset.prev||b.dataset.next));
function showPage(p){
  if(!canAccessPage(p)) return;
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  $(p).classList.add("active");
  document.querySelectorAll(".step").forEach(x=>x.classList.toggle("active",x.dataset.page===p));
  if(p==="impressao")renderPrint();
  if(p==="cod")renderCOD();
  window.scrollTo({top:0,behavior:"smooth"});
}
syncStepLock();
document.querySelectorAll(".source-card").forEach(c=>c.onclick=()=>{
  document.querySelectorAll(".source-card").forEach(x=>x.classList.remove("selected"));
  c.classList.add("selected");
  source=c.querySelector("input").value;
  if(selectedFile) updateFileCard();
});
const drop=$("drop"), fileInput=$("file");
drop.onclick=(e)=>{if(e.target!==fileInput) fileInput.click()};
drop.ondragover=e=>{e.preventDefault();drop.classList.add("drag")};
drop.ondragleave=()=>drop.classList.remove("drag");
drop.ondrop=e=>{
  e.preventDefault();drop.classList.remove("drag");
  const f=e.dataTransfer?.files?.[0];
  if(f) setSelectedFile(f);
};
fileInput.onchange=()=>{const f=fileInput.files?.[0];if(f)setSelectedFile(f)};
$("clearFile").onclick=clearSelectedFile;
function setSelectedFile(file){
  selectedFile=file;
  updateFileCard();
  $("processBtn").disabled=false;
  $("dropHint").textContent=`Arquivo pronto para processar: ${file.name}`;
}
function updateFileCard(){
  if(!selectedFile){$("fileCard").classList.add("hidden");drop.classList.remove("has-file");return}
  const f=selectedFile;
  const ext=(f.name.split(".").pop()||"arquivo").toUpperCase();
  $("fileIcon").textContent=ext==="XLSX"||ext==="XLS"?"XLS":ext.slice(0,4);
  $("fileName").textContent=f.name;
  $("fileType").textContent=`Tipo: ${f.type||ext}`;
  $("fileSize").textContent=`Tamanho: ${formatBytes(f.size)}`;
  $("fileDate").textContent=`Data: ${new Date(f.lastModified||Date.now()).toLocaleString("pt-BR")}`;
  $("fileDesc").textContent=`Fonte selecionada: ${source} • pronto para tratamento`;
  $("fileCard").classList.remove("hidden");
  drop.classList.add("has-file");
}
function formatBytes(bytes){
  if(bytes<1024) return `${bytes} B`;
  if(bytes<1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(2)} MB`;
}
function clearSelectedFile(){
  selectedFile=null;
  fileInput.value="";
  workflowUnlocked=false;
  rows=[]; carts=[]; currentPage=1;
  syncStepLock();
  showPage("entrada");
  $("processBtn").disabled=true;
  $("fileCard").classList.add("hidden");
  drop.classList.remove("has-file");
  $("dropHint").textContent="Nenhum arquivo selecionado.";
  $("status").textContent="Aguardando arquivo";
}
$("processBtn").onclick=processFile;
$("demoBtn").onclick=()=>{rows=demo(); source="Result"; normalize(); finish()};
$("search").oninput=renderTable;$("dynFilter").onchange=renderTable;
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{document.querySelectorAll(".mode").forEach(x=>x.classList.remove("active"));b.classList.add("active");mode=b.dataset.mode;});
$("rebuild").onclick=()=>{buildCarts();showPage("impressao")};
$("printBtn").onclick=()=>printSection("impressao");
$("printAllBtn").onclick=printAllSections;
$("prevPage").onclick=()=>changePage(-1);
$("nextPage").onclick=()=>changePage(1);
$("codPrint").onclick=()=>printSection("cod");
window.addEventListener("afterprint",()=>{document.body.classList.remove("printing-cod","printing-all");$("printAllArea").innerHTML="";printMode="current"});
function printSection(section){
  printMode="current";
  document.body.classList.toggle("printing-cod",section==="cod");
  window.print();
}
async function processFile(){
  const f=selectedFile;
  if(!f){alert("Selecione ou solte um arquivo primeiro.");return}
  const ext=(f.name.toLowerCase().split(".").pop()||"");
  $("processBtn").disabled=true;
  $("processBtn").textContent="Processando...";
  try{
    if(ext==="csv"){
      const text=await f.text();
      rows=parseCSV(text);
      normalize();
      finish();
    }else{
      const data=await f.arrayBuffer();
      const wb=XLSX.read(data,{type:"array",cellDates:true,raw:true});
      const wanted=source==="Result"?"Result":source;
      const ws=wb.Sheets[wanted]||wb.Sheets[wb.SheetNames[0]];
      rows=XLSX.utils.sheet_to_json(ws,{defval:"",raw:true});
      normalize();
      finish();
    }
    $("status").textContent=`${f.name} • ${rows.length} registros`;
  }catch(err){
    console.error(err);
    alert(`Não foi possível processar o arquivo.\\n\\n${err.message||err}`);
    $("status").textContent="Erro ao processar arquivo";
  }finally{
    $("processBtn").disabled=false;
    $("processBtn").textContent="Processar arquivo";
  }
}
function parseCSV(text){
  text=String(text||"").replace(/^\uFEFF/,"");
  const lines=text.split(/\r?\n/).filter(line=>line.trim().length);
  if(!lines.length)return [];
  const first=lines[0];
  const sep=detectSeparator(first);
  const headers=parseCSVLine(first,sep).map(h=>String(h).replace(/^\uFEFF/,"").trim());
  const out=[];
  for(let i=1;i<lines.length;i++){
    const a=parseCSVLine(lines[i],sep), r={};
    headers.forEach((h,j)=>r[h]=(a[j]??"").trim());
    if(Object.values(r).some(v=>v!==""))out.push(r);
  }
  return out;
}
function detectSeparator(line){
  const candidates=[";","\\t",","];
  let best=";", max=-1;
  for(const sep of candidates){
    const n=parseCSVLine(line,sep).length;
    if(n>max){max=n;best=sep}
  }
  return best;
}
function parseCSVLine(line,sep){
  const a=[];let cur="",q=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==='"'){
      if(q&&line[i+1]==='"'){cur+='"';i++}else q=!q;
    }else if(c===sep&&!q){a.push(cur);cur=""}
    else cur+=c;
  }
  a.push(cur);return a;
}
function finish(){workflowUnlocked=true;syncStepLock();buildCarts();renderTable();populateDyn();updateStats();renderCOD();$("status").textContent=`${rows.length} registros • ${source}`;showPage("tratamento")}
function keyNorm(v){return String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim().toLowerCase()}
function val(r,names){
  const keys=Object.keys(r||{}), wanted=names.map(keyNorm);
  for(const n of names){if(r[n]!==undefined&&String(r[n]).trim()!=="")return r[n]}
  for(const k of keys){const nk=keyNorm(k);if(wanted.includes(nk)&&String(r[k]).trim()!=="")return r[k]}
  return ""
}
function excelColNum(raw, index){
 const vals=Object.keys(raw||{}).map(k=>raw[k]);
 return num(vals[index]);
}
function calcDeResult(raw,dyn){
  // Regras fixas do Result por NOME DA COLUNA (não por posição do CSV).
  // DE: 12/15 = Preço De; 19/20/23/24 = Preço Venda; demais = sem DE.
  if([12,13,15].includes(dyn)) return num(val(raw,["Preço De","PREÇO DE","Preco De"]));
  if([19,20,23,24].includes(dyn)) return num(val(raw,["Preço Venda","PREÇO VENDA","Preco Venda"]));
  return 0;
}
function parsePercent(v){
  if(v===null||v===undefined||v==="") return 0;
  let s=String(v).trim().replace(/\s/g,"").replace(",",".");
  if(s.endsWith("%")) return num(s.slice(0,-1))/100;
  const n=Number(s);
  // Msg 1 normalmente vem como percentual (ex.: 20 ou 20%).
  return Number.isFinite(n) ? (Math.abs(n)>1 ? n/100 : n) : 0;
}
function calcPorResult(raw,dyn){
  // POR das dinâmicas 10/12/13/15/16/25 vem sempre de Preço Venda.
  if([10,12,13,15,16,17,25].includes(dyn)) return num(val(raw,["Preço Venda","PREÇO VENDA","Preco Venda"]));
  if([20,23,24].includes(dyn)) return num(val(raw,["Preço Fide/Promo","PREÇO FIDE/PROMO","Preco Fide/Promo"]));
  if(dyn===19){
    const unit=num(val(raw,["Preço Unitário","PREÇO UNITÁRIO","Preco Unitario","Preço Venda","PREÇO VENDA","Preco Venda"]));
    const pct=parsePercent(val(raw,["Msg 1","MSG 1","Msg1","MSG1"]));
    const precoComDesconto=unit*(1-pct);
    return +((precoComDesconto+unit)/2).toFixed(2);
  }
  return 0;
}
function normalize(){
 if(source==="Result"){rows=rows.map(r=>{const dyn=Number(val(r,["Cod. Dinâmica","COD DINAMICA","Código Dinâmica"]))||10; const deResult=calcDeResult(r,dyn); const porResult=calcPorResult(r,dyn); return {raw:r,category:val(r,["Nome Categ.","Nome Categoria","NOME CATEG.","Categoria"]),depto:val(r,["Depto.","Depto","DEPTO.","Departamento"]),deptName:val(r,["Nome Depto.","Nome Depto","NOME DEPTO.","Nome Departamento"]),plu:val(r,["PLU","Plu","plu"]),desc:val(r,["Descrição PLU","Descricao PLU","Descrição","DESCRIÇÃO"]),qtd:Number(val(r,["Quantidade Coletada","Quantidade","QTD"]))||1,cartazQty:Number(val(r,["Quantidade Coletada","Quantidade","QTD"]))||1,dyn,dynName:val(r,["Dinâmica","DINAMICA"]),de:deResult,por:porResult,fide:num(val(r,["Preço Fide/Promo","Preço Fidelidade","POR FIDE"])),ean:val(r,["EAN","Código EAN","CODIGO EAN"]),mensagemEtiqueta:val(r,["Mensagem Etiqueta","MENSAGEM ETIQUETA","Mensagem etiqueta"]),dataInicioFidePromo:val(r,["Data Inicio Fide/Promo","DATA INICIO FIDE/PROMO","Data Início Fide/Promo"]),dataFimFidePromo:val(r,["Data Fim Fide/Promo","DATA FIM FIDE/PROMO","Data Fim Fide/Promo"])} }).filter(r=>r.plu||r.desc)}
 else if(source==="PBi"){rows=rows.map(r=>({category:val(r,["Nome Depto.","Nome Depto","NOME DEPTO.","Nome Departamento","Departamento"]),plu:val(r,["PLU","Plu"]),desc:val(r,["DESCRICAO","Descrição","DESCRIÇÃO"]),qtd:num(val(r,["QTD","Quantidade"]))||1,cartazQty:num(val(r,["QTD","Quantidade"]))||1,dyn:0,dynName:val(r,["DINAMICA","Dinâmica"]),de:num(val(r,["DE","Preço De"])),por:num(val(r,["POR","Preço Venda"])),fide:num(val(r,["POR VAL","Preço Fidelidade"])),ean:val(r,["EAN"])}))}
 else {rows=rows.map(r=>({category:val(r,["Nome Depto.","Nome Depto","NOME DEPTO.","Nome Departamento","Departamento"]),plu:val(r,["PLU","Plu"]),desc:val(r,["Descrição","DESCRICAO"]),qtd:num(val(r,["Quantidade","QTD"]))||1,cartazQty:num(val(r,["Quantidade","QTD"]))||1,dyn:12,dynName:"ZEBRINHA",de:num(val(r,["Preço Original","Preço De"])),por:num(val(r,["Novo Preço Arredondado","Novo Preço","POR"])),fide:0,ean:val(r,["EAN","PLU virtual"])}))}
}
function num(v){
 if(v===null||v===undefined||v==="") return 0;
 if(typeof v==="number") return Number.isFinite(v)?v:0;
 let s=String(v).trim().replace(/R\\$\\s*/gi,"").replace(/\\s/g,"");
 if(!s) return 0;
 if(s.includes(",")) s=s.replace(/\\./g,"").replace(",",".");
 const n=Number(s);
 return Number.isFinite(n)?n:0;
}
function demo(){return [
{PLU:1065864,"Descrição PLU":"BATATA OND YOKITOS SAL/CEB 45G","Quantidade Coletada":6,"Cod. Dinâmica":10,"Dinâmica":"REGULAR","Preço De":7.99,"Preço Venda":6.29},
{PLU:3372920,"Descrição PLU":"CAFÉ PILÃO 500G","Quantidade Coletada":4,"Cod. Dinâmica":12,"Dinâmica":"OFERTA","Preço De":29.99,"Preço Venda":24.99},
{PLU:3373033,"Descrição PLU":"REFRIGERANTE COCA COLA 2L","Quantidade Coletada":8,"Cod. Dinâmica":20,"Dinâmica":"FIDELIDADE CLUBE EXTRA","Preço De":10.99,"Preço Venda":8.99},
{PLU:1415081,"Descrição PLU":"BISCOITO BAUDUCCO 350G","Quantidade Coletada":3,"Cod. Dinâmica":19,"Dinâmica":"OFERTA 2 UNID","Preço De":8.99,"Preço Venda":6.99},
{PLU:1415079,"Descrição PLU":"MASSA PARA TAPIOCA 500G","Quantidade Coletada":5,"Cod. Dinâmica":23,"Dinâmica":"A PARTIR DE","Preço Venda":7.99}
]}
function formatDateBR(v){
  if(v===null||v===undefined||String(v).trim()==="") return "";
  const x=String(v).trim();
  let m=x.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if(m) return `${m[3].padStart(2,"0")}/${m[2].padStart(2,"0")}/${m[1]}`;
  m=x.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
  if(m) return `${m[1].padStart(2,"0")}/${m[2].padStart(2,"0")}/${m[3]}`;
  return x;
}
const dePorValidity=[12,13,15,19,20,23,24,25];
function validityPhrase(r){
  if(!dePorValidity.includes(Number(r.dyn))) return "";
  const ini=formatDateBR(r.dataInicioFidePromo), fim=formatDateBR(r.dataFimFidePromo);
  if(!ini && !fim) return "";
  return `Ofertas válidas de ${ini} a ${fim} ou enquanto durar nossos estoques.`;
}
function measureUnit(r){
  // Result: Depto. 2 = Perecíveis; 1 = Mercearia; 3 = Bazar.
  const depto = String(r.depto ?? "").trim();
  const dyn = Number(r.dyn)||0;
  if(depto !== "2") return "cada";

  // Dinâmica 17 identifica produtos vendidos pela referência de 100g,
  // mesmo quando a descrição do PLU não termina com "100G".
  if(dyn === 17) return "100g";

  const d = String(r.desc||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g," ").toUpperCase();
  if(/L$/.test(d)) return "cada";
  if(/GR$/.test(d)) return "cada";
  if(/\sKG$/.test(d)) return "kg";
  if(/100G$/.test(d)) return "100g";
  if(!/G$/.test(d)) return "kg";
  return "cada";
}
function buildCarts(){let out=[];rows.forEach(r=>{r.measureUnit=measureUnit(r);let n=Math.max(0,Math.floor(Number(r.cartazQty)||0));for(let i=0;i<n;i++){
  let specialMsg="";
  if(r.dyn===19||r.dyn===24) specialMsg=String(r.mensagemEtiqueta||"").trim();
  if(r.dyn===23){
    const msg1=String(val(r.raw||{},["Msg 1","MSG 1","Msg1","MSG1"])||"").trim();
    specialMsg=msg1 ? `A PARTIR DE ${msg1} UN.` : "A PARTIR DE UN.";
  }
  const packBasePrice=mode==="pack" ? packPriceBase(r) : 0;
  const parcelBasePrice=mode==="parcela" ? parcelPriceBase(r) : 0;
  out.push({...r,price:priceFor(r),packBasePrice,parcelBasePrice,measureUnit:r.measureUnit||measureUnit(r),dynName:dynamics[r.dyn]||r.dynName||"OFERTA",dynDesc:specialMsg||descDyn[r.dyn]||r.dynName||"",validity:validityPhrase(r),packValidity:packValidityPhrase(r),parcelValidity:parcelValidityPhrase(r)})
}});carts=out}
function packPriceBase(r){
  // Pack normal usa sempre Preço Venda. Dinâmica 20 (Clube Extra) usa Preço Fide/Promo.
  return Number(r.dyn)===20 ? Number(r.fide||0) : Number(r.por||0);
}
function packValidityPhrase(r){
  // No Pack, somente a existência de Data Inicio Fide/Promo determina a mensagem.
  const ini=formatDateBR(r.dataInicioFidePromo);
  if(!ini) return "";
  const fim=formatDateBR(r.dataFimFidePromo);
  return `Oferta válida de ${ini} a ${fim} ou enquanto durar nossos estoques`;
}
function parcelPriceBase(r){
  // Parcelamento normal usa Preço Venda. Dinâmica 20 (Clube Extra) usa Preço Fide/Promo.
  return Number(r.dyn)===20 ? Number(r.fide||0) : Number(r.por||0);
}
function parcelValidityPhrase(r){
  // No Parcelamento, somente a existência de Data Inicio Fide/Promo determina a mensagem.
  const ini=formatDateBR(r.dataInicioFidePromo);
  if(!ini) return "";
  const fim=formatDateBR(r.dataFimFidePromo);
  return `Oferta válida de ${ini} a ${fim} ou enquanto durar nossos estoques`;
}
function priceFor(r){
 let p=Number(r.por||0);
 if(mode==="percentual") return +(p*(1-num($("discount").value)/100)).toFixed(2);
 if(mode==="pack") return +(packPriceBase(r)/(num($("packQty").value)||1)).toFixed(2);
 if(mode==="parcela") return +(parcelPriceBase(r)/(num($("installments").value)||1)).toFixed(2);
 return +Number(p).toFixed(2);
}
function populateDyn(){let s=$("dynFilter");s.innerHTML='<option value="">Todas as dinâmicas</option>';Object.entries(dynamics).forEach(([k,v])=>s.innerHTML+=`<option value="${k}">${k} · ${v}</option>`)}
function renderTable(){let q=$("search").value.toLowerCase(),d=$("dynFilter").value;let a=rows.filter(r=>(!q||`${r.plu} ${r.desc}`.toLowerCase().includes(q))&&(!d||String(r.dyn)===d));$("dataTable").innerHTML="<thead><tr><th>#</th><th>PLU</th><th>Descrição</th><th>Qtd. Cartaz</th><th>Dinâmica</th><th>De</th><th>Por</th></tr></thead><tbody>"+a.map((r,i)=>{const idx=rows.indexOf(r);return `<tr><td>${idx+1}</td><td>${r.plu}</td><td>${r.desc}</td><td><div class="qty-editor"><button type="button" class="qty-btn" data-qty="dec" data-row="${idx}" aria-label="Diminuir quantidade" title="Diminuir quantidade"><span class="material-symbols-rounded" aria-hidden="true">remove</span></button><input class="qty-cartaz-input" data-row="${idx}" type="number" min="0" step="1" value="${Math.max(0,Number(r.cartazQty)||0)}" aria-label="Quantidade de cartazes" title="0 = não imprimir este produto"><button type="button" class="qty-btn" data-qty="inc" data-row="${idx}" aria-label="Aumentar quantidade" title="Aumentar quantidade"><span class="material-symbols-rounded" aria-hidden="true">add</span></button></div></td><td>${dynamics[r.dyn]||r.dynName||""}</td><td>${r.de?money(r.de):"—"}</td><td>${(r.por||r.fide)?money(r.por||r.fide):"—"}</td></tr>`}).join("")+"</tbody>";
$("dataTable").querySelectorAll(".qty-cartaz-input").forEach(inp=>inp.onchange=()=>setCartazQty(Number(inp.dataset.row),inp.value));
$("dataTable").querySelectorAll(".qty-btn").forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.row);const cur=Math.max(0,Number(rows[i].cartazQty)||0);setCartazQty(i,btn.dataset.qty==="inc"?cur+1:cur-1)});
}
function updateStats(){let qty=rows.reduce((a,r)=>a+Math.max(0,Number(r.cartazQty)||0),0),pages=Math.ceil(carts.length/8);$("stats").innerHTML=`<div><b>${rows.length}</b> produtos</div><div><b>${qty}</b> cartazes</div><div><b>${pages}</b> páginas A4</div>`;$("cartSummary").innerHTML=`<b>${carts.length}</b> cartazes gerados • <b>${Math.ceil(carts.length/8)}</b> páginas A4 • 8 cartazes por página.`} 
function setCartazQty(index,value){const parsed=Number(value);const n=Number.isFinite(parsed)?Math.max(0,Math.floor(parsed)):0;if(!rows[index])return;rows[index].cartazQty=n;buildCarts();currentPage=Math.min(currentPage,Math.max(1,Math.ceil(carts.length/8)));renderTable();updateStats();renderPrint();}
function money(v){return v?Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"—"}
function changePage(delta){let pages=Math.max(1,Math.ceil(carts.length/8));currentPage=Math.min(pages,Math.max(1,currentPage+delta));renderPrint()}
function renderPrint(){let pages=Math.max(1,Math.ceil(carts.length/8));$("prevPage").disabled=currentPage<=1;$("nextPage").disabled=currentPage>=pages;$("pageSelect").innerHTML=Array.from({length:pages},(_,i)=>`<option value="${i+1}">Página ${i+1}</option>`).join("");$("pageSelect").value=currentPage;$("pageSelect").onchange=()=>{currentPage=+$("pageSelect").value;drawPage()};drawPage()}
function renderAllPrintPages(){let pages=Math.max(1,Math.ceil(carts.length/8));$("printAllArea").innerHTML=Array.from({length:pages},(_,i)=>`<div class="a4 print-page">${carts.slice(i*8,i*8+8).map(cartMarkup).join("")}</div>`).join("")}
function cartMarkup(r){
  if(mode==="pack") return packCartMarkup(r);
  if(mode==="parcela") return parcelCartMarkup(r);
  const hasDePor=!!(r.de && r.price && Math.abs(Number(r.de)-Number(r.price))>0.004);
  const promoPhrase=(hasDePor && [19,23,24].includes(Number(r.dyn)))?'NESTA PROMOÇÃO, A UN. SAI POR':'';
  return `<article class="cartaz ${hasDePor?'has-de-por':'no-de-por'}">
    <div class="cart-top">
      <div class="dyn">${esc(r.dynName||'')}</div>
      <div class="mode-note">${esc(r.dynDesc||'')}</div>
    </div>
    <div class="cart-desc">${esc(r.desc||'')}</div>
    ${hasDePor?`<div class="cart-pricing"><div class="de-price"><span>DE:</span> <s class="price-value">${money(r.de)}</s><small class="measure-unit">${esc(r.measureUnit||"cada")}</small></div><div class="promo-box"><svg class="promo-box-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="100" height="100" fill="#202124"></rect></svg><span class="promo-box-text ${String(r.dynDesc||'').length>15?'promo-box-text--long':''}">${esc(r.dynDesc||'')}</span></div><div class="promo-phrase">${promoPhrase}</div><div class="por-price"><span>POR:</span> <span class="price-value">${money(r.price)}</span><small class="measure-unit">${esc(r.measureUnit||"cada")}</small></div>${r.validity?`<div class="validity-phrase">${esc(r.validity)}</div>`:""}</div>`:`<div class="cart-pricing"><div class="price">${money(r.price)}<small class="measure-unit">${esc(r.measureUnit||"cada")}</small></div></div>`}
    <div class="cart-code"><div class="plu">PLU ${esc(r.plu||'')}</div>${code39SVG(String(r.plu),190,34)}</div>
  </article>`
}
function packCartMarkup(r){
  const club=Number(r.dyn)===20;
  const base=Number(r.packBasePrice||packPriceBase(r));
  const validity=r.packValidity||"";
  return `<article class="cartaz pack-cartaz">
    <div class="cart-top pack-top"></div>
    <div class="cart-desc">${esc(r.desc||'')}</div>
    ${club?`<div class="pack-club-note">EXCLUSIVO CLUBE EXTRA</div>`:""}
    <div class="cart-pricing pack-pricing">
      <div class="pack-base-price">${money(base)}</div>
      <div class="pack-box"><svg class="promo-box-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="100" height="100" fill="#202124"></rect></svg><span>NESTA EMBALAGEM,<br>A UND. SAI POR</span></div>
      <div class="pack-unit-price">${money(r.price)}</div>
      ${validity?`<div class="validity-phrase pack-validity">${esc(validity)}</div>`:""}
    </div>
    <div class="cart-code"><div class="plu">PLU ${esc(r.plu||'')}</div>${code39SVG(String(r.plu),190,34)}</div>
  </article>`;
}
function parcelCartMarkup(r){
  const club=Number(r.dyn)===20;
  const base=Number(r.parcelBasePrice||parcelPriceBase(r));
  const validity=r.parcelValidity||"";
  const parcelas=Math.max(1,Math.floor(num($("installments").value)||1));
  return `<article class="cartaz parcel-cartaz">
    <div class="cart-top parcel-top"></div>
    <div class="cart-desc">${esc(r.desc||'')}</div>
    ${club?`<div class="parcel-club-note">EXCLUSIVO CLUBE EXTRA</div>`:""}
    <div class="cart-pricing parcel-pricing">
      <div class="parcel-base-price">${money(base)}</div>
      <div class="parcel-box"><svg class="promo-box-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="100" height="100" fill="#202124"></rect></svg><div class="parcel-box-text"><span class="parcel-box-highlight">EM ${parcelas}x SEM JUROS</span><span class="parcel-box-sub">NOS CARTÕES DE CRÉDITO</span></div></div>
      <div class="parcel-unit-price">${money(r.price)}</div>
      ${validity?`<div class="validity-phrase parcel-validity">${esc(validity)}</div>`:""}
    </div>
    <div class="cart-code"><div class="plu">PLU ${esc(r.plu||'')}</div>${code39SVG(String(r.plu),190,34)}</div>
  </article>`;
}
function drawPage(){let start=(currentPage-1)*8,a=carts.slice(start,start+8);$("pageInfo").textContent=`${a.length} cartaz(es) nesta página`;$("printArea").innerHTML=a.map(cartMarkup).join("")}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
function renderCOD(){
  const a=rows.filter(r=>r.plu).slice().sort((x,y)=>{
    const ca=String(x.category||"Sem categoria").trim().localeCompare(String(y.category||"Sem categoria").trim(),"pt-BR",{sensitivity:"base"});
    if(ca!==0)return ca;
    return String(x.desc||"").localeCompare(String(y.desc||""),"pt-BR",{sensitivity:"base"});
  });
  let html='<thead><tr><th>DESCRIÇÃO</th><th>CÓDIGO DE BARRAS</th><th>PLU</th></tr></thead><tbody>';
  let lastCat=null;
  for(const r of a.slice(0,1000)){
    const cat=String(r.category||"Sem categoria").trim()||"Sem categoria";
    if(cat!==lastCat){html+=`<tr class="cod-category"><td colspan="3">${esc(cat)}</td></tr>`;lastCat=cat;}
    html+=`<tr><td class="cod-desc">${esc(r.desc||"")}</td><td class="code39-cell">${code39SVG(String(r.plu),260,42)}</td><td class="cod-plu">${esc(r.plu)}</td></tr>`;
  }
  html+='</tbody>';
  $("codTable").innerHTML=html;
  // A grade compacta continua separada para impressão do COD, mas segue a mesma ordenação.
  let grid="",last=null;
  for(const r of a){
    const cat=String(r.category||"Sem categoria").trim()||"Sem categoria";
    if(cat!==last){grid+=`<div class="cod-print-category">${esc(cat)}</div>`;last=cat;}
    grid+=`<div class="cod-print-item"><div class="cod-print-desc">${esc(r.desc||"")}</div>${code39SVG(String(r.plu),150,28)}<div class="cod-print-plu">PLU ${esc(r.plu)}</div></div>`;
  }
  $("codPrintArea").innerHTML=grid;
}

function printAllSections(){
  if(!carts.length){alert("Gere os cartazes primeiro.");return}
  renderAllPrintPages();
  document.body.classList.add("printing-all");
  window.print();
}

// Code 39 em SVG: não depende de fonte instalada no Android/Windows.
const CODE39={
  "0":"nnnwwnwnn","1":"wnnwnnnnw","2":"nnwwnnnnw","3":"wnwwnnnnn","4":"nnnwwnnnw","5":"wnnwwnnnn","6":"nnwwwnnnn","7":"nnnwnnwnw","8":"wnnwnnwnn","9":"nnwwnnwnn",
  "A":"wnnnnwnnw","B":"nnwnnwnnw","C":"wnwnnwnnn","D":"nnnnwwnnw","E":"wnnnwwnnn","F":"nnwnwwnnn","G":"nnnnnwwnw","H":"wnnnnwwnn","I":"nnwnnwwnn","J":"nnnnwwwnn",
  "K":"wnnnnnnww","L":"nnwnnnnww","M":"wnwnnnnwn","N":"nnnnwnnww","O":"wnnnwnnwn","P":"nnwnwnnwn","Q":"nnnnnnwww","R":"wnnnnnwwn","S":"nnwnnnwwn","T":"nnnnwnwwn",
  "U":"wwnnnnnnw","V":"nwwnnnnnw","W":"wwwnnnnnn","X":"nwnnwnnnw","Y":"wwnnwnnnn","Z":"nwwnwnnnn",
  "-":"nwnnnnwnw",".":"wwnnnnwnn"," ":"nwwnnnwnn","$":"nwnwnwnnn","/":"nwnwnnnwn","+":"nwnnnwnwn","%":"nnnwnwnwn","*":"nwnnwnwnn"
};
function code39SVG(value,width=220,height=44){
  const text=`*${String(value).toUpperCase()}*`;
  let units=0; for(const ch of text){const p=CODE39[ch]||CODE39[" "]; for(const c of p)units+=c==="w"?3:1; units+=1;}
  const quiet=10, total=units+quiet*2, scale=Math.max(1,width/total);
  let x=quiet*scale, bars=[];
  for(const ch of text){const p=CODE39[ch]||CODE39[" "]; for(let i=0;i<p.length;i++){const w=(p[i]==="w"?3:1)*scale; if(i%2===0)bars.push(`<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="${height}"/>`); x+=w;} x+=scale;}
  const vb=total*scale;
  return `<svg class="barcode-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb.toFixed(2)} ${height}" width="100%" height="${height}" preserveAspectRatio="none" aria-label="Code 39 ${String(value)}"><rect width="100%" height="100%" fill="white"/>${bars.join("")}</svg>`;
}
