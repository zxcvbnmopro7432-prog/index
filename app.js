import {db,collection,addDoc,onSnapshot,query,orderBy,serverTimestamp} from './firebase.js';
window.placeOrder=async function(){
const name=document.getElementById('name').value;
const item=document.getElementById('item').value;
if(!name||!item){alert('Fill all fields');return;}
await addDoc(collection(db,'orders'),{name,item,status:'PENDING',createdAt:serverTimestamp()});
alert('Order placed');
}
const ordersDiv=document.getElementById('orders');
const q=query(collection(db,'orders'),orderBy('createdAt','desc'));
onSnapshot(q,(snapshot)=>{
ordersDiv.innerHTML='';
snapshot.forEach((d)=>{
const o=d.data();
ordersDiv.innerHTML+=`<div class="order"><b>${o.item}</b><br>${o.name}<br>Status: ${o.status}</div>`;
});
});