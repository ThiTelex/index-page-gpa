const API="https://vencimentos-api.thitelex1999.workers.dev";const $=id=>document.getElementById(id);let scannerControls=null,scannerReader=null,registros=[];
function notice(t){$("notice").textContent=t}
async function getPassword(){try{const r=await fetch("./config.json",{cache:"no-store"});if(!r.ok)throw Error();return String((await r.json()).senha)}catch(e){if(location.protocol==="file:")return "1833";throw e}}
function unlock(){ $("loginScreen").hidden=true;$("loginScreen").style.display="none";document.body.classList.remove("auth-locked");sessionStorage.setItem("vencimentos_login","1");load()}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();try{if($("loginPassword").value.trim()===await getPassword())unlock();else $("loginError").textContent="Senha incorreta."}catch{$("loginError").textContent="Falha ao ler config.json. Verifique se está na mesma pasta."}});
if(sessionStorage.getItem("vencimentos_login")==="1"){ $("loginScreen").hidden=true;$("loginScreen").style.display="none";document.body.classList.remove("auth-locked");load()}
["sector","status","search"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",load));
async function load(){if(document.body.classList.contains("auth-locked"))return;try{notice("Atualizando…");const p=new URLSearchParams();if($("sector").value)p.set("setor",$("sector").value);if($("search").value.trim())p.set("q",$("search").value.trim());const r=await fetch(`${API}/api/vencimentos?${p}`);const j=await r.json();if(!r.ok||!j.sucesso)throw Error();registros=j.dados||[];render();notice(`${j.total} registro(s) encontrado(s).`)}catch{$("list").innerHTML='<div class="empty">Falha ao consultar a API. Verifique a publicação e o CORS.</div>';notice("Não foi possível atualizar os dados.")}}
function render(){const p=registros.filter(x=>x.tratado===0);$("total").textContent=p.length;$("expired").textContent=p.filter(x=>x.situacao==="vencido").length;$("attention").textContent=p.filter(x=>x.situacao==="atencao").length;if(!registros.length){$("list").innerHTML='<div class="empty">Nenhum registro encontrado.</div>';return}$("list").innerHTML=registros.map(x=>`<article class="item"><div><h3>${esc(x.descricao)}</h3><div class="meta">EAN/PLU: ${esc(x.plu_ean)} · ${esc(x.setor)} · Qtd.: ${x.quantidade}</div><div class="meta">Validade: ${x.validade.split("-").reverse().join("/")} · Responsável: ${esc(x.responsavel)}</div></div><div class="right"><span class="pill ${x.tratado?"":x.situacao}">${x.tratado?"TRATADO":label(x)}</span>${x.tratado?"":`<button class="primary" onclick="markTreated(${x.id})">Marcar tratado</button>`}</div></article>`).join("")}
function label(x){return x.situacao==="vencido"?`VENCIDO · ${Math.abs(x.dias_restantes)} dia(s)`:x.situacao==="atencao"?`${x.dias_restantes} dia(s) · ATENÇÃO`:`${x.dias_restantes} dias restantes`}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.markTreated=async id=>{if(!confirm("Marcar este registro como tratado?"))return;try{const r=await fetch(`${API}/api/vencimentos/${id}/tratado`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({tratado:1})});if(!r.ok)throw Error();await load()}catch{notice("Falha ao atualizar tratativa.")}};
$("newBtn").onclick=()=>$("formDialog").showModal();$("closeDialog").onclick=$("cancel").onclick=()=>$("formDialog").close();
$("entryForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const submitButton=form.querySelector('button[type="submit"]');
  const raw=Object.fromEntries(new FormData(form));

  // Normalização compatível com a estrutura atual do D1.
  const b={
    descricao:String(raw.descricao||"").trim().toLocaleUpperCase("pt-BR"),
    plu_ean:String(raw.plu_ean||"").trim(),
    validade:String(raw.validade||"").trim(), // input date envia YYYY-MM-DD
    quantidade:raw.quantidade===""?0:Number(raw.quantidade),
    responsavel:String(raw.responsavel||"").trim().toLocaleUpperCase("pt-BR"),
    setor:String(raw.setor||"").trim().toLocaleUpperCase("pt-BR")
  };

  // Validação explícita antes de chamar o Worker.
  const faltando=[];
  if(!b.descricao)faltando.push("Descrição");
  if(!b.plu_ean)faltando.push("PLU/EAN");
  if(!b.validade)faltando.push("Validade");
  if(!b.responsavel)faltando.push("Responsável");
  if(!b.setor)faltando.push("Setor");
  if(faltando.length){notice("Preencha: "+faltando.join(", ")+".");return}
  if(!Number.isSafeInteger(b.quantidade)||b.quantidade<0){
    notice("Quantidade deve ser um número inteiro igual ou maior que zero.");return;
  }
  if(!["MERCEARIA","PERECÍVEIS"].includes(b.setor)){
    notice("Selecione um setor válido.");return;
  }

  submitButton.disabled=true;
  submitButton.textContent="Salvando…";
  notice("Enviando cadastro…");
  try{
    const r=await fetch(`${API}/api/vencimentos`,{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify(b)
    });
    const responseText=await r.text();
    let j={};
    try{j=responseText?JSON.parse(responseText):{}}catch{
      throw Error(`A API respondeu em formato inesperado (HTTP ${r.status}).`);
    }
    if(!r.ok||j.sucesso!==true){
      const detalhe=j.mensagem||j.erro||j.error||`HTTP ${r.status}`;
      throw Error(`Cadastro recusado pela API: ${detalhe}`);
    }
    form.reset();
    $("formDialog").close();
    notice("Cadastro realizado com sucesso.");
    await load();
  }catch(err){
    console.error("Erro ao cadastrar vencimento:",err);
    notice(err.message||"Falha ao cadastrar. Verifique a conexão com a API.");
  }finally{
    submitButton.disabled=false;
    submitButton.textContent="Cadastrar";
  }
});
$("openScanner").onclick=()=>startScanner("form");$("searchScanner").onclick=()=>startScanner("search");$("closeScanner").onclick=stopScanner;$("scannerDialog").addEventListener("cancel",stopScanner);
function playScanSound(){
  const audio=$("scanSound");
  if(audio){
    try{
      audio.pause();
      audio.currentTime=0;
      const playback=audio.play();
      if(playback&&typeof playback.catch==="function"){
        playback.catch(()=>playFallbackBeep());
      }
      return;
    }catch(e){/* usa o som de contingência abaixo */}
  }
  playFallbackBeep();
}
function playFallbackBeep(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return;
    const ctx=new AudioCtx();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type="sine";
    osc.frequency.setValueAtTime(880,ctx.currentTime);
    gain.gain.setValueAtTime(0.0001,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15,ctx.currentTime+0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.16);
    osc.connect(gain);gain.connect(ctx.destination);
    osc.start();osc.stop(ctx.currentTime+0.17);
    osc.onended=()=>ctx.close();
  }catch(e){/* som complementar; não interrompe a leitura */}
}
async function startScanner(mode="form"){
  // Desbloqueia a reprodução de áudio após o toque do usuário (restrição comum em celulares).
  const scanAudio=$("scanSound");
  if(scanAudio){
    try{
      scanAudio.muted=true;
      await scanAudio.play();
      scanAudio.pause();
      scanAudio.currentTime=0;
      scanAudio.muted=false;
    }catch(e){scanAudio.muted=false}
  }
  if(!window.isSecureContext){$("scannerStatus").textContent="A câmera exige HTTPS. Abra o site pelo GitHub Pages.";return}if(!navigator.mediaDevices?.getUserMedia){$("scannerStatus").textContent="Este navegador não oferece acesso à câmera.";return}if(!window.ZXing?.BrowserMultiFormatReader){$("scannerStatus").textContent="Biblioteca de leitura não carregou. Verifique a internet e tente novamente.";return}
$("scannerDialog").showModal();$("scannerStatus").textContent="Solicitando acesso à câmera…";
try{scannerReader=new ZXing.BrowserMultiFormatReader();scannerControls=await scannerReader.decodeFromVideoDevice(undefined,$("scannerVideo"),(result,err,controls)=>{if(result){const code=result.getText();playScanSound();$("scannerStatus").textContent=`Código identificado: ${code}`;stopScanner();if(mode==="search"){$("search").value=code;currentPage=1;load();$("search").focus()}else{$("eanInput").value=code;$("eanInput").focus()}}else if(err&&!(err instanceof ZXing.NotFoundException)){/* mantém a leitura ativa enquanto procura o código */}});$("scannerStatus").textContent="Câmera ativa. Centralize o código de barras na faixa."}catch(e){$("scannerStatus").textContent=e.name==="NotAllowedError"?"Acesso à câmera negado. Autorize nas configurações do navegador.":"Não foi possível iniciar a câmera. Verifique permissões e se ela está disponível."}}
function stopScanner(){try{scannerControls?.stop()}catch{}scannerControls=null;try{scannerReader?.reset()}catch{}scannerReader=null;if($("scannerDialog").open)$("scannerDialog").close()}

// ===== Sistema V1.8: importação CSV/XLSX, paginação, relatório e desfazer =====
const PAGE_SIZE=30;let currentPage=1,importRows=[];
const $v=id=>document.getElementById(id);
['sector','status'].forEach(id=>$v(id).addEventListener('change',()=>{currentPage=1;load()}));
$v('search').addEventListener('input',()=>{currentPage=1;load()});
$v('daysLimit').addEventListener('change',()=>{currentPage=1;render()});
const originalRender=render;
function withinDaysFilter(items){
 const active=items.filter(x=>Number(x.dias_restantes)>=0);
 const lim=$v('daysLimit').value;
 if(lim==='all')return active;
 return active.filter(x=>Number(x.dias_restantes)<=Number(lim));
}
render=function(){
 // Vencidos permanecem no D1, mas não participam do painel operacional.
 const operational=registros.filter(x=>Number(x.dias_restantes)>=0);
 const periodData=withinDaysFilter(operational);
 const treated=periodData.filter(x=>Number(x.tratado)===1).length;
 const pending=periodData.filter(x=>Number(x.tratado)===0).length;
 const total=periodData.length;
 $v('total').textContent=total;
 $v('expired').textContent=treated;
 $v('attention').textContent=pending;
 $v('chartTotal').textContent=`${total} ${total===1?'registro':'registros'}`;
 $v('treatedCount').textContent=treated;
 $v('pendingCount').textContent=pending;
 const treatedPct=total?Math.round(treated/total*100):0;
 const pendingPct=total?100-treatedPct:0;
 $v('treatedPercent').textContent=`${treatedPct}%`;
 $v('pendingPercent').textContent=`${pendingPct}%`;
 $v('treatedBar').style.width=`${total?treated/total*100:0}%`;
 $v('pendingBar').style.width=`${total?pending/total*100:0}%`;
 $v('treatedBar').setAttribute('aria-label',`Tratados: ${treatedPct}%`);
 $v('pendingBar').setAttribute('aria-label',`A tratar: ${pendingPct}%`);
 let data=periodData;
 if($v('status').value==='0')data=data.filter(x=>Number(x.tratado)===0);
 else if($v('status').value==='1')data=data.filter(x=>Number(x.tratado)===1);
 const pages=Math.max(1,Math.ceil(data.length/PAGE_SIZE));currentPage=Math.min(currentPage,pages);
 const shown=data.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);
 if(!shown.length){$v('list').innerHTML='<div class="empty">Nenhum registro encontrado no período selecionado.</div>';$v('pagination').innerHTML='';return}
 $v('list').innerHTML=shown.map(x=>`<article class="item"><div><h3>${esc(x.descricao)}</h3><div class="meta">EAN/PLU: ${esc(x.plu_ean)} · ${esc(x.setor)} · Qtd.: ${x.quantidade}</div><div class="meta">Validade: ${String(x.validade).split('-').reverse().join('/')} · Responsável: ${esc(x.responsavel)}</div></div><div class="right"><span class="pill ${urgencyClass(x)}">${x.tratado?'TRATADO':urgencyLabel(x)}</span>${Number(x.tratado)===1?`<button class="ghost" onclick="undoTreated(${x.id})">Desfazer</button>`:`<button class="primary" onclick="markTreated(${x.id})">Marcar tratado</button>`}</div></article>`).join('');
 $v('pagination').innerHTML=`<span>${data.length} registro(s) · Página ${currentPage}/${pages}</span><div class="page-actions"><button class="ghost" ${currentPage===1?'disabled':''} onclick="goPage(${currentPage-1})">Anterior</button>${Array.from({length:pages},(_,i)=>i+1).slice(Math.max(0,currentPage-3),currentPage+2).map(n=>`<button class="page-number ${n===currentPage?'active':''}" onclick="goPage(${n})">${n}</button>`).join('')}<button class="ghost" ${currentPage===pages?'disabled':''} onclick="goPage(${currentPage+1})">Próxima</button></div>`;
};
function urgencyClass(x){
 const d=Number(x.dias_restantes);
 if(d<=3)return 'urgency-red';
 if(d<=10)return 'urgency-orange';
 if(d<=20)return 'urgency-yellow';
 if(d<=30)return 'urgency-blue';
 return 'urgency-gray';
}
function urgencyLabel(x){
 const d=Number(x.dias_restantes);
 if(d<=3)return `${d} ${d===1?'DIA':'DIAS'} · URGÊNCIA`;
 if(d<=10)return `${d} DIAS · URGENTE`;
 if(d<=20)return `${d} DIAS · ATENÇÃO`;
 if(d<=30)return `${d} DIAS · MONITORAMENTO`;
 return `${d} DIAS · FORA DO PERÍODO`;
}
window.goPage=n=>{currentPage=n;render();window.scrollTo({top:0,behavior:'smooth'})};
window.undoTreated=async id=>{if(!confirm('Desfazer a tratativa deste registro?'))return;try{const r=await fetch(`${API}/api/vencimentos/${id}/tratado`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({tratado:0})});const j=await r.json();if(!r.ok||!j.sucesso)throw Error(j.mensagem||'Falha ao desfazer');await load()}catch(e){notice(e.message)}};
$v('printBtn').onclick=()=>{let data=withinDaysFilter(registros);if($v('status').value==='0')data=data.filter(x=>Number(x.tratado)===0);else if($v('status').value==='1')data=data.filter(x=>Number(x.tratado)===1);const w=window.open('','_blank');if(!w){notice('Permita pop-ups para imprimir.');return}const rows=data.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.descricao)}</td><td>${esc(x.plu_ean)}</td><td>${String(x.validade).split('-').reverse().join('/')}</td><td>${x.quantidade}</td><td>${esc(x.responsavel)}</td><td>${esc(x.setor)}</td><td>${x.tratado?'TRATADO':'PENDENTE'}</td></tr>`).join('');w.document.write(`<html><meta charset="utf-8"><title>Relatório de vencimentos</title><style>body{font:12px Arial;margin:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #aaa;padding:6px;text-align:left}h2{margin-bottom:4px}</style><h2>CONTROLE DE VENCIMENTOS — V2.1</h2><p>Emitido: ${new Date().toLocaleString('pt-BR')} · Total: ${data.length}</p><table><thead><tr><th>#</th><th>Descrição</th><th>PLU/EAN</th><th>Validade</th><th>Qtd.</th><th>Responsável</th><th>Setor</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table><script>onload=()=>print()</script></html>`);w.document.close()};
function parseCSV(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===';'&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>String(v).trim()!==''))rows.push(row);row=[];cell=''}else cell+=c}row.push(cell);if(row.some(v=>String(v).trim()!==''))rows.push(row);return rows}
function csvDate(value){if(value instanceof Date&&!Number.isNaN(value.getTime()))return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;const s=String(value??'').trim();let m=s.match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{4})(?:\s+.*)?$/);if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return `${m[1]}-${m[2]}-${m[3]}`;if(/^\d+(\.\d+)?$/.test(s)){const d=new Date(Date.UTC(1899,11,30)+Number(s)*86400000);return d.toISOString().slice(0,10)}return ''}
function validISO(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s}
const IMPORT_HEADERS=['Data Reg.','Id Tarefa','Data de Validade','Descrição PLU','Quantidade Coletada','Depto.','EAN'];
function mapImportRows(matrix){if(!matrix||matrix.length<2)throw Error('O arquivo não contém linhas de dados.');const headers=(matrix[0]||[]).map(x=>String(x??'').replace(/^\uFEFF/,'').trim());const ix={};IMPORT_HEADERS.forEach(h=>ix[h]=headers.findIndex(v=>v.toLocaleLowerCase('pt-BR')===h.toLocaleLowerCase('pt-BR')));const missing=IMPORT_HEADERS.filter(h=>ix[h]<0);if(missing.length)throw Error('Cabeçalhos ausentes: '+missing.join(', '));importRows=matrix.slice(1).map((r,n)=>{const get=h=>String(r?.[ix[h]]??'').trim();const validade=csvDate(r?.[ix['Data de Validade']]);const data=csvDate(r?.[ix['Data Reg.']]);const qraw=get('Quantidade Coletada').replace(',','.');const qtd=qraw===''?0:Number(qraw);const depto=get('Depto.');const eanValue=r?.[ix['EAN']];const row={_key:n,descricao:get('Descrição PLU').toLocaleUpperCase('pt-BR'),plu_ean:String(eanValue??'').trim().replace(/\.0$/,''),validade,quantidade:Number.isFinite(qtd)&&Number.isInteger(qtd)&&qtd>=0?qtd:null,responsavel:('PRÓ-ATIVO ID '+get('Id Tarefa')).toLocaleUpperCase('pt-BR'),data_lancamento:data,setor:depto==='2'?'PERECÍVEIS':'MERCEARIA',_line:n+2};row._errors=[];if(!row.descricao)row._errors.push('Descrição PLU vazia');if(!row.plu_ean)row._errors.push('EAN vazio');if(!validISO(validade))row._errors.push('Data de validade inválida');if(!validISO(data))row._errors.push('Data Reg. inválida');if(row.quantidade===null)row._errors.push('Quantidade inválida');if(!get('Id Tarefa'))row._errors.push('Id Tarefa vazio');return row}).filter(x=>x.descricao||x.plu_ean||x.validade);if(!importRows.length)throw Error('Nenhum registro preenchido foi encontrado.');}
function matrixFromWorkbook(buffer){if(!window.XLSX)throw Error('A biblioteca de leitura Excel não carregou. Verifique sua conexão e tente novamente.');const book=XLSX.read(buffer,{type:'array',cellDates:false});const required=IMPORT_HEADERS.map(x=>x.toLocaleLowerCase('pt-BR'));let selected=null,selectedName='';const preferred=book.Sheets['Proativo'];const candidates=preferred?['Proativo',...book.SheetNames.filter(x=>x!=='Proativo')]:book.SheetNames;for(const name of candidates){const sheet=book.Sheets[name];const rows=XLSX.utils.sheet_to_json(sheet,{header:1,raw:true,defval:''});const headers=(rows[0]||[]).map(x=>String(x??'').trim().toLocaleLowerCase('pt-BR'));if(required.every(h=>headers.includes(h))){selected=rows;selectedName=name;break}}if(!selected)throw Error('Não encontrei uma aba com os sete cabeçalhos necessários: '+IMPORT_HEADERS.join(', '));return {rows:selected,sheet:selectedName}}
$v('importBtn').onclick=()=>$v('csvFile').click();$v('csvFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{let matrix;const isExcel=/\.xlsx$/i.test(file.name);if(isExcel){const buffer=await file.arrayBuffer();const parsed=matrixFromWorkbook(buffer);matrix=parsed.rows;$v('importSummary').textContent=`Planilha: ${file.name} · Aba: ${parsed.sheet}`;}else{let txt=await file.text();if(txt.charCodeAt(0)===0xFEFF)txt=txt.slice(1);matrix=parseCSV(txt);$v('importSummary').textContent=`Arquivo: ${file.name} · CSV separado por ponto e vírgula`; }mapImportRows(matrix);renderImportPreview();$v('importDialog').showModal();}catch(err){notice('Falha ao ler arquivo: '+err.message)}finally{e.target.value=''}};
function renderImportPreview(){const bad=importRows.filter(x=>x._errors.length).length;$v('importSummary').textContent=`${importRows.length} registro(s) identificados · ${bad} com pendência(s) de validação.`;$v('importErrors').textContent=bad?`Corrija o arquivo de origem ou exclua as linhas inválidas antes de importar. Linhas com erro: ${importRows.filter(x=>x._errors.length).map(x=>x._line).join(', ')}`:'';$v('importPreview').innerHTML=importRows.map((x,i)=>`<article class="import-card"><div><h3>${esc(x.descricao||'(sem descrição)')}</h3><p>EAN: ${esc(x.plu_ean)} · Validade: ${x.validade?x.validade.split('-').reverse().join('/'):'inválida'} · Quantidade: ${x.quantidade??'inválida'}</p><p>Responsável: ${esc(x.responsavel)} · Setor: <b>${x.setor}</b> · Data Reg.: ${x.data_lancamento||'inválida'}</p>${x._errors.length?`<p class="import-errors">Linha ${x._line}: ${esc(x._errors.join(' · '))}</p>`:''}</div><button class="remove-import" title="Excluir da importação" onclick="removeImportRow(${x._key})">✕</button></article>`).join('')||'<div class="empty">Nenhum registro selecionado.</div>';$v('finishImport').disabled=!importRows.length||bad>0;$v('finishImport').textContent=`Finalizar importação (${importRows.length})`}
window.removeImportRow=key=>{importRows=importRows.filter(x=>x._key!==key);renderImportPreview()};
$v('closeImport').onclick=$v('cancelImport').onclick=()=>{$v('importDialog').close();importRows=[]};
$v('finishImport').onclick=async()=>{if(!importRows.length)return;const btn=$v('finishImport');btn.disabled=true;$v('cancelImport').disabled=true;$v('closeImport').disabled=true;$v('importStatus').textContent='Importação em andamento…';$v('importProgressBar').style.width='0%';let ok=0,failed=[];for(let i=0;i<importRows.length;i++){const x=importRows[i];const payload={descricao:x.descricao,plu_ean:x.plu_ean,validade:x.validade,quantidade:x.quantidade,responsavel:x.responsavel,setor:x.setor,data_lancamento:x.data_lancamento};try{const r=await fetch(`${API}/api/vencimentos`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok||!j.sucesso)throw Error(j.mensagem||`HTTP ${r.status}`);ok++}catch(err){failed.push(`Linha ${x._line}: ${err.message}`)}$v('importProgressBar').style.width=`${Math.round((i+1)/importRows.length*100)}%`;$v('importStatus').textContent=`Processando ${i+1}/${importRows.length} · ${ok} concluído(s) · ${failed.length} falha(s)`} $v('importStatus').textContent=`Concluído: ${ok} importado(s), ${failed.length} falha(s).${failed.length?' Detalhes: '+failed.join(' | '):''}`;$v('importSummary').textContent='Processamento finalizado.';$v('cancelImport').disabled=false;$v('closeImport').disabled=false;btn.textContent='Fechar';btn.disabled=false;btn.onclick=()=>{$v('importDialog').close();btn.onclick=null;btn.textContent='Finalizar importação';importRows=[];load()};};
