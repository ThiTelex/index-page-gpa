// Sistema V1.4 | API Cloudflare V2.1 | D1 sem alterações
const API="https://vencimentos-api.thitelex1999.workers.dev";
const $=id=>document.getElementById(id);
let scannerControls=null,scannerReader=null,registros=[],paginaAtual=1;
const ITENS_POR_PAGINA=30;
function notice(t){$("notice").textContent=t}
async function getPassword(){try{const r=await fetch("./config.json",{cache:"no-store"});if(!r.ok)throw Error();return String((await r.json()).senha)}catch(e){if(location.protocol==="file:")return "1833";throw e}}
function unlock(){ $("loginScreen").hidden=true;$("loginScreen").style.display="none";document.body.classList.remove("auth-locked");sessionStorage.setItem("vencimentos_login","1");load()}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();try{if($("loginPassword").value.trim()===await getPassword())unlock();else $("loginError").textContent="Senha incorreta."}catch{$("loginError").textContent="Falha ao ler config.json. Verifique se está na mesma pasta."}});
if(sessionStorage.getItem("vencimentos_login")==="1"){ $("loginScreen").hidden=true;$("loginScreen").style.display="none";document.body.classList.remove("auth-locked");load()}
$("logout").onclick=()=>{sessionStorage.removeItem("vencimentos_login");location.reload()};
$("sector").addEventListener("change",()=>{paginaAtual=1;load()});
$("status").addEventListener("change",()=>{paginaAtual=1;load()});
["search","daysLimit"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",()=>{paginaAtual=1;render()}));
async function load(){if(document.body.classList.contains("auth-locked"))return;try{notice("Atualizando…");const p=new URLSearchParams();if($("sector").value)p.set("setor",$("sector").value);if($("status").value!=="")p.set("tratado",$("status").value);if($("search").value.trim())p.set("q",$("search").value.trim());const r=await fetch(`${API}/api/vencimentos?${p}`);const j=await r.json();if(!r.ok||!j.sucesso)throw Error(j.mensagem||"Falha na consulta");registros=j.dados||[];paginaAtual=1;render();notice(`${getFilteredRecords().length} registro(s) exibido(s).`)}catch(e){$("list").innerHTML='<div class="empty">Falha ao consultar a API. Verifique a publicação e o CORS.</div>';$("pagination").innerHTML="";notice("Não foi possível atualizar os dados.")}}
function getFilteredRecords(){
  let data=registros.slice();
  const termo=$("search").value.trim().toLocaleUpperCase("pt-BR");
  if(termo)data=data.filter(x=>String(x.descricao||"").toLocaleUpperCase("pt-BR").includes(termo)||String(x.plu_ean||"").includes(termo));
  const limite=$("daysLimit").value;
  // O limite de dias se aplica às pendências; itens vencidos continuam visíveis.
  if(limite!=="all" && $("status").value!=="1"){
    const max=Number(limite);
    data=data.filter(x=>x.tratado===1 || x.dias_restantes<0 || x.dias_restantes<=max);
  }
  return data;
}
function render(){
  const pendencias=registros.filter(x=>x.tratado===0);
  $("total").textContent=pendencias.length;
  $("expired").textContent=pendencias.filter(x=>x.situacao==="vencido").length;
  $("attention").textContent=pendencias.filter(x=>x.situacao==="atencao").length;
  const data=getFilteredRecords();
  const totalPaginas=Math.max(1,Math.ceil(data.length/ITENS_POR_PAGINA));
  paginaAtual=Math.min(paginaAtual,totalPaginas);
  const inicio=(paginaAtual-1)*ITENS_POR_PAGINA;
  const pagina=data.slice(inicio,inicio+ITENS_POR_PAGINA);
  if(!data.length){$("list").innerHTML='<div class="empty">Nenhum registro encontrado para os filtros selecionados.</div>';$("pagination").innerHTML="";return}
  $("list").innerHTML=pagina.map(x=>`<article class="item"><div><h3>${esc(x.descricao)}</h3><div class="meta">EAN/PLU: ${esc(x.plu_ean)} · ${esc(x.setor)} · Qtd.: ${x.quantidade}</div><div class="meta">Validade: ${String(x.validade).split("-").reverse().join("/")} · Responsável: ${esc(x.responsavel)}</div></div><div class="right"><span class="pill ${x.tratado?"":x.situacao}">${x.tratado?"TRATADO":label(x)}</span>${x.tratado?`<button class="ghost" onclick="undoTreated(${x.id})">Desfazer</button>`:`<button class="primary" onclick="markTreated(${x.id})">Marcar tratado</button>`}</div></article>`).join("");
  renderPagination(data.length,totalPaginas);
}
function renderPagination(total,totalPaginas){
  if(totalPaginas<=1){$("pagination").innerHTML=`<span>${total} registro(s)</span>`;return}
  let html=`<span>${total} registro(s) · Página ${paginaAtual} de ${totalPaginas}</span><div class="page-actions"><button class="ghost" ${paginaAtual===1?"disabled":""} onclick="changePage(${paginaAtual-1})">Anterior</button>`;
  const start=Math.max(1,paginaAtual-2),end=Math.min(totalPaginas,paginaAtual+2);
  for(let i=start;i<=end;i++)html+=`<button class="page-number ${i===paginaAtual?"active":""}" onclick="changePage(${i})">${i}</button>`;
  html+=`<button class="ghost" ${paginaAtual===totalPaginas?"disabled":""} onclick="changePage(${paginaAtual+1})">Próxima</button></div>`;
  $("pagination").innerHTML=html;
}
window.changePage=n=>{paginaAtual=n;render();window.scrollTo({top:0,behavior:"smooth"})};
function label(x){return x.situacao==="vencido"?`VENCIDO · ${Math.abs(x.dias_restantes)} dia(s)`:x.situacao==="atencao"?`${x.dias_restantes} dia(s) · ATENÇÃO`:`${x.dias_restantes} dias restantes`}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function updateTreated(id,value){try{const r=await fetch(`${API}/api/vencimentos/${id}/tratado`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({tratado:value})});const j=await r.json();if(!r.ok||j.sucesso!==true)throw Error(j.mensagem||"Falha ao atualizar");await load()}catch(e){notice(e.message||"Falha ao atualizar tratativa.")}}
window.markTreated=async id=>{if(!confirm("Marcar este registro como tratado?"))return;await updateTreated(id,1)};
window.undoTreated=async id=>{if(!confirm("Desfazer a tratativa deste registro? Ele voltará para as pendências."))return;await updateTreated(id,0)};
function printReport(){
  const data=getFilteredRecords();
  if(!data.length){notice("Não há registros para imprimir.");return}
  const statusLabel=$("status").selectedOptions[0].textContent;
  const setorLabel=$("sector").selectedOptions[0].textContent;
  const limiteLabel=$("daysLimit").selectedOptions[0].textContent;
  const rows=data.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.descricao)}</td><td>${esc(x.plu_ean)}</td><td>${String(x.validade).split("-").reverse().join("/")}</td><td>${esc(x.quantidade)}</td><td>${esc(x.responsavel)}</td><td>${esc(x.setor)}</td><td>${x.tratado?"TRATADO":"PENDENTE"}</td><td>${x.tratado?"—":esc(label(x))}</td></tr>`).join("");
  const w=window.open("","_blank");
  if(!w){notice("O navegador bloqueou a janela de impressão. Permita pop-ups para este site.");return}
  w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório de vencimentos</title><style>body{font:12px Arial,sans-serif;color:#222;margin:24px}h1{font-size:20px;margin:0 0 6px}.sub{color:#555;margin-bottom:18px}.meta{display:flex;gap:18px;flex-wrap:wrap;margin:10px 0 18px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:7px;text-align:left}th{background:#eee}tr{break-inside:avoid}footer{margin-top:16px;color:#666;font-size:10px}@media print{body{margin:10mm}thead{display:table-header-group}}</style></head><body><h1>CONTROLE DE VENCIMENTOS</h1><div class="sub">Relatório de ${esc(statusLabel)} · Emitido em ${new Date().toLocaleString("pt-BR")}</div><div class="meta"><span><b>Setor:</b> ${esc(setorLabel)}</span><span><b>Prazo:</b> ${esc(limiteLabel)}</span><span><b>Total:</b> ${data.length} registro(s)</span></div><table><thead><tr><th>#</th><th>Descrição</th><th>PLU/EAN</th><th>Validade</th><th>Qtd.</th><th>Responsável</th><th>Setor</th><th>Status</th><th>Situação</th></tr></thead><tbody>${rows}</tbody></table><footer>Controle de Vencimentos · Sistema V1.4</footer><script>window.onload=()=>{window.print()}</script></body></html>`);
  w.document.close();
}
$("printReport").addEventListener("click",printReport);
$("newBtn").onclick=()=>$("formDialog").showModal();
$("closeDialog").onclick=$("cancel").onclick=()=>$("formDialog").close();
$("entryForm").addEventListener("submit",async e=>{
  e.preventDefault();const form=e.currentTarget;const submitButton=form.querySelector('button[type="submit"]');const raw=Object.fromEntries(new FormData(form));
  const b={descricao:String(raw.descricao||"").trim().toLocaleUpperCase("pt-BR"),plu_ean:String(raw.plu_ean||"").trim(),validade:String(raw.validade||"").trim(),quantidade:raw.quantidade===""?0:Number(raw.quantidade),responsavel:String(raw.responsavel||"").trim().toLocaleUpperCase("pt-BR"),setor:String(raw.setor||"").trim().toLocaleUpperCase("pt-BR")};
  const faltando=[];if(!b.descricao)faltando.push("Descrição");if(!b.plu_ean)faltando.push("PLU/EAN");if(!b.validade)faltando.push("Validade");if(!b.responsavel)faltando.push("Responsável");if(!b.setor)faltando.push("Setor");
  if(faltando.length){notice("Preencha: "+faltando.join(", ")+".");return}if(!Number.isSafeInteger(b.quantidade)||b.quantidade<0){notice("Quantidade deve ser um número inteiro igual ou maior que zero.");return}if(!["MERCEARIA","PERECÍVEIS"].includes(b.setor)){notice("Selecione um setor válido.");return}
  submitButton.disabled=true;submitButton.textContent="Salvando…";notice("Enviando cadastro…");
  try{const r=await fetch(`${API}/api/vencimentos`,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(b)});const responseText=await r.text();let j={};try{j=responseText?JSON.parse(responseText):{}}catch{throw Error(`A API respondeu em formato inesperado (HTTP ${r.status}).`)}if(!r.ok||j.sucesso!==true)throw Error(`Cadastro recusado pela API: ${j.mensagem||j.erro||j.error||`HTTP ${r.status}`}`);form.reset();$("formDialog").close();notice("Cadastro realizado com sucesso.");await load()}catch(err){console.error("Erro ao cadastrar vencimento:",err);notice(err.message||"Falha ao cadastrar. Verifique a conexão com a API.")}finally{submitButton.disabled=false;submitButton.textContent="Cadastrar"}
});
$("openScanner").onclick=startScanner;$("closeScanner").onclick=stopScanner;$("scannerDialog").addEventListener("cancel",stopScanner);
function playScanSound(){const audio=$("scanSound");if(audio){try{audio.pause();audio.currentTime=0;const playback=audio.play();if(playback&&typeof playback.catch==="function")playback.catch(()=>playFallbackBeep());return}catch(e){}}playFallbackBeep()}
function playFallbackBeep(){try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;const ctx=new AudioCtx();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type="sine";osc.frequency.setValueAtTime(880,ctx.currentTime);gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.15,ctx.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.16);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.17);osc.onended=()=>ctx.close()}catch(e){}}
async function startScanner(){const scanAudio=$("scanSound");if(scanAudio){try{scanAudio.muted=true;await scanAudio.play();scanAudio.pause();scanAudio.currentTime=0;scanAudio.muted=false}catch(e){scanAudio.muted=false}}if(!window.isSecureContext){$("scannerStatus").textContent="A câmera exige HTTPS. Abra o site pelo GitHub Pages.";return}if(!navigator.mediaDevices?.getUserMedia){$("scannerStatus").textContent="Este navegador não oferece acesso à câmera.";return}if(!window.ZXing?.BrowserMultiFormatReader){$("scannerStatus").textContent="Biblioteca de leitura não carregou. Verifique a internet e tente novamente.";return}$("scannerDialog").showModal();$("scannerStatus").textContent="Solicitando acesso à câmera…";try{scannerReader=new ZXing.BrowserMultiFormatReader();scannerControls=await scannerReader.decodeFromVideoDevice(undefined,$("scannerVideo"),(result,err,controls)=>{if(result){const code=result.getText();playScanSound();$("eanInput").value=code;$("scannerStatus").textContent=`Código identificado: ${code}`;stopScanner();$("eanInput").focus()}else if(err&&!(err instanceof ZXing.NotFoundException)){}});$("scannerStatus").textContent="Câmera ativa. Centralize o código de barras na faixa."}catch(e){$("scannerStatus").textContent=e.name==="NotAllowedError"?"Acesso à câmera negado. Autorize nas configurações do navegador.":"Não foi possível iniciar a câmera. Verifique permissões e se ela está disponível."}}
function stopScanner(){try{scannerControls?.stop()}catch{}scannerControls=null;try{scannerReader?.reset()}catch{}scannerReader=null;if($("scannerDialog").open)$("scannerDialog").close()}
