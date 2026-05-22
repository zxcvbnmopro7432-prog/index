import {db,collection,onSnapshot,query,orderBy,updateDoc,doc} from './firebase.js';
const adminDiv=document.getElementById('adminOrders');
window.loadOrders=function(){adminDiv.innerHTML='Loading...';}
const q=query(collection(db,'orders'),orderBy('createdAt','desc'));
onSnapshot(q,(snapshot)=>{
adminDiv.innerHTML='';
snapshot.forEach((d)=>{
const o=d.data();
adminDiv.innerHTML+=`<div class="order"><b>${o.item}</b><br>${o.name}<br>Status: ${o.status}<br><br><button onclick="setReady('${d.id}')">READY</button><button onclick="setPicked('${d.id}')">PICKED UP</button></div>`;
});
});
window.setReady=async function(id){await updateDoc(doc(db,'orders',id),{status:'READY'});}
window.setPicked=async function(id){await updateDoc(doc(db,'orders',id),{status:'PICKED UP'});}