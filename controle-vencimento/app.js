const API="https://vencimentos-api.thitelex1999.workers.dev";const $=id=>document.getElementById(id);let scannerControls=null,scannerReader=null,registros=[];
function notice(t){$("notice").textContent=t}
async function getPassword(){try{const r=await fetch("./config.json",{cache:"no-store"});if(!r.ok)throw Error();return String((await r.json()).senha)}catch(e){if(location.protocol==="file:")return "1833";throw e}}
function unlock(){ $("loginScreen").hidden=true;$("loginScreen").style.display="none";document.body.classList.remove("auth-locked");sessionStorage.setItem("vencimentos_login","1");load()}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();try{if($("loginPassword").value.trim()===await getPassword())unlock();else $("loginError").textContent="Senha incorreta."}catch{$("loginError").textContent="Falha ao ler config.json. Verifique se está na mesma pasta."}});
if(sessionStorage.getItem("vencimentos_login")==="1"){ $("loginScreen").hidden=true;$("loginScreen").style.display="none";document.body.classList.remove("auth-locked");load()}
$("logout").onclick=()=>{sessionStorage.removeItem("vencimentos_login");location.reload()};
["sector","status","search"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",load));
async function load(){if(document.body.classList.contains("auth-locked"))return;try{notice("Atualizando…");const p=new URLSearchParams();if($("sector").value)p.set("setor",$("sector").value);if($("status").value!=="")p.set("tratado",$("status").value);if($("search").value.trim())p.set("q",$("search").value.trim());const r=await fetch(`${API}/api/vencimentos?${p}`);const j=await r.json();if(!r.ok||!j.sucesso)throw Error();registros=j.dados||[];render();notice(`${j.total} registro(s) encontrado(s).`)}catch{$("list").innerHTML='<div class="empty">Falha ao consultar a API. Verifique a publicação e o CORS.</div>';notice("Não foi possível atualizar os dados.")}}
function render(){const p=registros.filter(x=>x.tratado===0);$("total").textContent=p.length;$("expired").textContent=p.filter(x=>x.situacao==="vencido").length;$("attention").textContent=p.filter(x=>x.situacao==="atencao").length;if(!registros.length){$("list").innerHTML='<div class="empty">Nenhum registro encontrado.</div>';return}$("list").innerHTML=registros.map(x=>`<article class="item"><div><h3>${esc(x.descricao)}</h3><div class="meta">EAN/PLU: ${esc(x.plu_ean)} · ${esc(x.setor)} · Qtd.: ${x.quantidade}</div><div class="meta">Validade: ${x.validade.split("-").reverse().join("/")} · Responsável: ${esc(x.responsavel)}</div></div><div class="right"><span class="pill ${x.tratado?"":x.situacao}">${x.tratado?"TRATADO":label(x)}</span>${x.tratado?"":`<button class="primary" onclick="markTreated(${x.id})">Marcar tratado</button>`}</div></article>`).join("")}
function label(x){return x.situacao==="vencido"?`VENCIDO · ${Math.abs(x.dias_restantes)} dia(s)`:x.situacao==="atencao"?`${x.dias_restantes} dia(s) · ATENÇÃO`:`${x.dias_restantes} dias restantes`}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.markTreated=async id=>{if(!confirm("Marcar este registro como tratado?"))return;try{const r=await fetch(`${API}/api/vencimentos/${id}/tratado`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({tratado:1})});if(!r.ok)throw Error();await load()}catch{notice("Falha ao atualizar tratativa.")}};
$("newBtn").onclick=()=>$("formDialog").showModal();$("closeDialog").onclick=$("cancel").onclick=()=>$("formDialog").close();
$("entryForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const submitButton=form.querySelector('button[type="submit"]');
  const b=Object.fromEntries(new FormData(form));
  // Padroniza os campos textuais antes de enviar e gravar no D1.
  b.descricao=String(b.descricao||"").trim().toLocaleUpperCase("pt-BR");
  b.responsavel=String(b.responsavel||"").trim().toLocaleUpperCase("pt-BR");
  b.setor=String(b.setor||"").trim().toLocaleUpperCase("pt-BR");
  // A coluna quantidade no D1 é NOT NULL; campo vazio é gravado como zero.
  b.quantidade=b.quantidade===""?0:Number(b.quantidade);
  submitButton.disabled=true;
  submitButton.textContent="Salvando…";
  try{
    const r=await fetch(`${API}/api/vencimentos`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
    const j=await r.json();
    if(!r.ok||!j.sucesso)throw Error(j.mensagem||"Não foi possível cadastrar. Verifique os dados e tente novamente.");
    form.reset();
    $("formDialog").close();
    notice("Cadastro realizado com sucesso.");
    await load();
  }catch(err){
    notice(err.message||"Falha ao cadastrar. Verifique sua conexão.");
  }finally{
    submitButton.disabled=false;
    submitButton.textContent="Cadastrar";
  }
});
$("openScanner").onclick=startScanner;$("closeScanner").onclick=stopScanner;$("scannerDialog").addEventListener("cancel",stopScanner);
function playScanBeep(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return;
    const ctx=new AudioCtx();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type="sine";
    osc.frequency.setValueAtTime(880,ctx.currentTime);
    gain.gain.setValueAtTime(0.0001,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18,ctx.currentTime+0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.16);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start();osc.stop(ctx.currentTime+0.17);
    osc.onended=()=>ctx.close();
  }catch(e){/* O som é complementar; não interrompe a leitura. */}
}
async function startScanner(){if(!window.isSecureContext){$("scannerStatus").textContent="A câmera exige HTTPS. Abra o site pelo GitHub Pages.";return}if(!navigator.mediaDevices?.getUserMedia){$("scannerStatus").textContent="Este navegador não oferece acesso à câmera.";return}if(!window.ZXing?.BrowserMultiFormatReader){$("scannerStatus").textContent="Biblioteca de leitura não carregou. Verifique a internet e tente novamente.";return}
$("scannerDialog").showModal();$("scannerStatus").textContent="Solicitando acesso à câmera…";
try{scannerReader=new ZXing.BrowserMultiFormatReader();scannerControls=await scannerReader.decodeFromVideoDevice(undefined,$("scannerVideo"),(result,err,controls)=>{if(result){const code=result.getText();playScanBeep();$("eanInput").value=code;$("scannerStatus").textContent=`Código identificado: ${code}`;stopScanner();$("eanInput").focus()}else if(err&&!(err instanceof ZXing.NotFoundException)){/* mantém a leitura ativa enquanto procura o código */}});$("scannerStatus").textContent="Câmera ativa. Centralize o código de barras na faixa."}catch(e){$("scannerStatus").textContent=e.name==="NotAllowedError"?"Acesso à câmera negado. Autorize nas configurações do navegador.":"Não foi possível iniciar a câmera. Verifique permissões e se ela está disponível."}}
function stopScanner(){try{scannerControls?.stop()}catch{}scannerControls=null;try{scannerReader?.reset()}catch{}scannerReader=null;if($("scannerDialog").open)$("scannerDialog").close()}
