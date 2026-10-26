export const PROJECT_STATUSES = ['active','paused','done'];
export const TASK_STATUSES = ['todo','doing','done'];
export const COLORS = ['sage','lilac','peach','blue'];
export const uid = () => crypto.randomUUID?.() || '10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(Number(c)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(c)/4).toString(16));
export const dateKey = (offset=0) => { const d=new Date();d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const tasksFor = (state,id) => state.tasks.filter(t=>t.projectId===id);
export const progress = (state,id) => {const tasks=tasksFor(state,id);return tasks.length?Math.round(tasks.filter(t=>t.status==='done').length/tasks.length*100):0;};
export const stats = state => ({active:state.projects.filter(p=>p.status==='active').length,open:state.tasks.filter(t=>t.status!=='done').length,done:state.tasks.filter(t=>t.status==='done').length,total:state.tasks.length});
export function validateState(raw) {
 if(!raw||raw.version!==1||!Array.isArray(raw.projects)||!Array.isArray(raw.tasks)||raw.projects.length>500||raw.tasks.length>10000) throw new Error('Format cadangan Karsa tidak valid.');
 const ids=new Set();
 const str=(v,max,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw new Error('Ada data yang tidak valid di cadangan.');return v;};
 const date=v=>{if(v!==''&&(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))))throw new Error('Tanggal cadangan tidak valid.');return v;};
 const projects=raw.projects.map(p=>{if(!p||!PROJECT_STATUSES.includes(p.status)||!COLORS.includes(p.color)||ids.has(p.id))throw new Error('Data proyek tidak valid.');ids.add(str(p.id,100,true));return {id:p.id,name:str(p.name,120,true),description:str(p.description,2000),status:p.status,color:p.color,due:date(p.due),createdAt:str(p.createdAt,50)};});
 const taskIds=new Set();
 const tasks=raw.tasks.map(t=>{if(!t||!ids.has(t.projectId)||!TASK_STATUSES.includes(t.status)||!['low','medium','high'].includes(t.priority)||taskIds.has(t.id)||!Array.isArray(t.checklist)||t.checklist.length>100)throw new Error('Data tugas tidak valid.');taskIds.add(str(t.id,100,true));const checks=new Set();return {id:t.id,projectId:t.projectId,title:str(t.title,200,true),notes:str(t.notes,5000),status:t.status,priority:t.priority,due:date(t.due),createdAt:str(t.createdAt,50),checklist:t.checklist.map(c=>{if(!c||typeof c.done!=='boolean'||checks.has(c.id))throw new Error('Checklist tidak valid.');checks.add(str(c.id,100,true));return {id:c.id,text:str(c.text,300,true),done:c.done};})};});
 return {version:1,demo:raw.demo===true,projects,tasks};
}
export function seedState(){
 const createdAt=new Date().toISOString();
 const projects=[
 {id:'portfolio',name:'Website portofolio',description:'Ruang kecil untuk menunjukkan karya, proses, dan hal-hal yang ingin dibangun.',status:'active',color:'sage',due:dateKey(9),createdAt},
 {id:'notes',name:'Aplikasi catatan',description:'Menyimpan ide sehari-hari dalam aplikasi yang sederhana dan nyaman.',status:'active',color:'lilac',due:dateKey(18),createdAt},
 {id:'desk',name:'Sudut kerja',description:'Menata meja supaya bekerja dan belajar terasa lebih menyenangkan.',status:'active',color:'peach',due:dateKey(6),createdAt},
 {id:'morning',name:'Rutinitas pagi',description:'Membuat awal hari lebih ringan, satu kebiasaan kecil setiap waktu.',status:'done',color:'blue',due:dateKey(-3),createdAt}
 ];
 const specs=[
 ['portfolio','Kumpulkan referensi visual','done','medium',-3,[]],
 ['portfolio','Susun struktur halaman','done','medium',-1,[]],
 ['portfolio','Desain halaman utama','doing','high',0,['Buat hero section','Susun kartu proyek','Cek tampilan mobile']],
 ['portfolio','Tulis cerita di balik karya','todo','medium',2,['Pilih tiga karya','Tulis proses singkat']],
 ['portfolio','Uji dan terbitkan website','todo','medium',9,[]],
 ['notes','Tentukan fitur inti','done','high',-2,[]],
 ['notes','Buat wireframe aplikasi','doing','medium',1,['Sketsa daftar catatan','Sketsa editor']],
 ['notes','Bangun editor catatan','todo','medium',7,[]],
 ['notes','Coba alur penyimpanan','todo','low',14,[]],
 ['desk','Pilih tata letak meja','done','low',-1,[]],
 ['desk','Rapikan kabel di meja','todo','medium',0,['Pisahkan kabel','Pasang pengikat','Bersihkan permukaan']],
 ['desk','Atur pencahayaan','todo','low',4,[]],
 ['morning','Susun rutinitas sederhana','done','low',-3,[]]
 ];
 const tasks=specs.map((s,i)=>({id:`sample-${i}`,projectId:s[0],title:s[1],notes:'',status:s[2],priority:s[3],due:dateKey(s[4]),createdAt,checklist:s[5].map((text,j)=>({id:`check-${i}-${j}`,text,done:i===2&&j===0}))}));
 return {version:1,demo:true,projects,tasks};
}
export function createProject(state,values){const project={id:uid(),name:values.name.trim(),description:values.description.trim(),color:values.color,status:values.status||'active',due:values.due||'',createdAt:new Date().toISOString()};if(!project.name)throw new Error('Nama proyek perlu diisi.');state.projects.push(project);return project;}
export function createTask(state,values){if(!state.projects.some(p=>p.id===values.projectId))throw new Error('Pilih proyek terlebih dahulu.');const task={id:uid(),projectId:values.projectId,title:values.title.trim(),notes:values.notes.trim(),status:values.status||'todo',priority:values.priority||'medium',due:values.due||'',createdAt:new Date().toISOString(),checklist:values.checklist||[]};if(!task.title)throw new Error('Nama tugas perlu diisi.');state.tasks.push(task);return task;}
export function toggleTask(task){task.status=task.status==='done'?'todo':'done';}
export function removeProject(state,id){state.projects=state.projects.filter(p=>p.id!==id);state.tasks=state.tasks.filter(t=>t.projectId!==id);}
