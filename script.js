const WHATSAPP_NUMBER = "919335224704";
const MENU = [
  {category:"Tea & Coffee",icon:"☕",items:[{id:"reg-tea",name:"Regular Tea",price:15},{id:"spec-tea",name:"Special Tea",note:"Adrak & elaichi",price:20,badge:"Popular"},{id:"hot-coffee",name:"Hot Coffee",price:20},{id:"black-coffee",name:"Black Coffee",price:30}]},
  {category:"Sandwiches",icon:"🥪",items:[{id:"veg-sw",name:"Veg Sandwich",price:55},{id:"cheese-sw",name:"Cheese Sandwich",price:69},{id:"paneer-sw",name:"Paneer Sandwich",price:79},{id:"paneer-cheese-sw",name:"Paneer Cheese Sandwich",price:89,badge:"Bestseller"},{id:"sweet-corn-sw",name:"Sweet Corn Sandwich",price:59}]},
  {category:"Cold Coffee & Shakes",icon:"🥤",items:[{id:"classic-cc",name:"Classic Cold Coffee",price:40},{id:"cc-ice-cream",name:"Cold Coffee With Ice Cream",price:50,badge:"Must try"},{id:"oreo-shake",name:"Oreo Shake",price:50},{id:"choc-shake",name:"Chocolate Shake",price:59},{id:"straw-shake",name:"Strawberry Shake",unavailable:true},{id:"badam-shake",name:"Badam Shake",price:69},{id:"classic-milk-shake",name:"Classic Milk Shake",price:59}]},
  {category:"Beverages",icon:"🍹",items:[{id:"blue-lagoon",name:"Blue Lagoon Mocktail",price:79},{id:"green-apple",name:"Green Apple Cooler",ask:true},{id:"kala-khatta",name:"Kala Khatta Soda",ask:true},{id:"lemon-iced-tea",name:"Lemon Iced Tea",price:49},{id:"orange-iced-tea",name:"Orange Iced Tea",price:59}]},
  {category:"Chinese Starters",icon:"🥡",items:[{id:"veg-manchurian",name:"Veg Manchurian",price:69},{id:"paneer-manchurian",name:"Paneer Manchurian",price:89},{id:"honey-chilli-potato",name:"Honey Chilli Potato",price:99,badge:"Chef's special"}]},
  {category:"Fries",icon:"🍟",items:[{id:"classic-fries",name:"Classic French Fries",price:59},{id:"peri-peri-fries",name:"Peri Peri French Fries",price:69},{id:"cheese-loaded-fries",name:"Cheese Loaded French Fries",price:89,badge:"Loaded"}]},
  {category:"Quick Bites",icon:"🥯",items:[{id:"butter-maska",name:"Butter Maska Bun",price:30},{id:"makhan-maska",name:"Makhan Maska Bun",price:50}]},
  {category:"Burgers",icon:"🍔",items:[{id:"aloo-tikki-burger",name:"Aloo Tikki Burger",price:40},{id:"aloo-tikki-cheese",name:"Aloo Tikki Cheese Burger",price:55},{id:"paneer-tikki-burger",name:"Paneer Tikki Burger",price:65},{id:"paneer-cheese-burger",name:"Paneer Cheese Burger",price:85}]},
  {category:"Maggi",icon:"🍜",items:[{id:"plain-maggi",name:"Plain Maggi",price:40},{id:"double-masala-maggi",name:"Double Masala Maggi",price:45},{id:"veg-maggi",name:"Veg Maggi",price:50},{id:"cheese-butter-maggi",name:"Cheese Butter Maggi",price:59},{id:"cheese-corn-maggi",name:"Cheese Sweet Corn Maggi",price:69,badge:"Favourite"}]},
  {category:"Pasta",icon:"🍝",items:[{id:"white-sauce-pasta",name:"White Sauce Pasta",variants:[{label:"Half",price:69},{label:"Full",price:109}]},{id:"red-sauce-pasta",name:"Red Sauce Pasta",variants:[{label:"Half",price:79},{label:"Full",price:119}]}]},
  {category:"Noodles",icon:"🥢",items:[{id:"veg-hakka",name:"Veg Hakka Noodles",price:60},{id:"paneer-hakka",name:"Paneer Hakka Noodles",price:80},{id:"mushroom-hakka",name:"Mushroom Hakka Noodles",unavailable:true},{id:"mix-hakka",name:"Mix Hakka Noodles",price:90},{id:"chilli-garlic-noodles",name:"Chilli Garlic Noodles",price:80}]},
  {category:"Fried Rice",icon:"🍚",items:[{id:"veg-fried-rice",name:"Veg Fried Rice",price:80},{id:"paneer-fried-rice",name:"Paneer Fried Rice",price:100},{id:"mushroom-fried-rice",name:"Mushroom Fried Rice",price:119},{id:"veggie-loaded-rice",name:"Veggie Loaded Fried Rice",price:139}]},
  {category:"Momos",icon:"🥟",items:[{id:"veg-steam-momos",name:"Veg Steam Momos",variants:[{label:"Half",price:30},{label:"Full",price:50}]},{id:"paneer-steam-momos",name:"Paneer Steam Momos",variants:[{label:"Half",price:50},{label:"Full",price:90}]},{id:"fried-veg-momos",name:"Fried Veg Momos",variants:[{label:"Half",price:40},{label:"Full",price:80}]},{id:"fried-paneer-momos",name:"Fried Paneer Momos",variants:[{label:"Half",price:60},{label:"Full",price:120}]}]}
];
const cart = new Map();
let activeCategory = "All";
const menuGrid=document.querySelector("#menuGrid"),categoryTabs=document.querySelector("#categoryTabs"),menuSearch=document.querySelector("#menuSearch"),cartFab=document.querySelector("#cartFab"),drawer=document.querySelector("#orderDrawer"),backdrop=document.querySelector("#drawerBackdrop"),toast=document.querySelector("#toast");
let toastTimer;
const money=n=>`₹${n}`;
const allItems=MENU.flatMap(group=>group.items.map(item=>({...item,category:group.category})));
function renderTabs(){categoryTabs.innerHTML=["All",...MENU.map(group=>group.category)].map(name=>`<button class="category-tab ${name===activeCategory?'active':''}" data-category="${name}">${name==="All"?"All items":name}</button>`).join("");}
function renderMenu(){
 const query=menuSearch.value.trim().toLowerCase();
 const visible=allItems.filter(item=>(activeCategory==="All"||item.category===activeCategory)&&(!query||item.name.toLowerCase().includes(query)||item.category.toLowerCase().includes(query)||((item.note||"").toLowerCase().includes(query))));
 if(!visible.length){menuGrid.innerHTML='<p class="empty-cart">No menu items found. Try another search.</p>';return;}
 menuGrid.innerHTML=visible.map(item=>{
  const variants=item.variants||[{label:"Regular",price:item.price}];
  const unavailable=item.unavailable;
  return `<article class="menu-card ${unavailable?'unavailable':''}"><div><h3>${item.name}${item.badge?`<span class="badge">${item.badge}</span>`:""}</h3><p>${item.note||item.category}</p><div class="price">${unavailable?"Currently unavailable":item.ask?"Ask us":"From "+money(Math.min(...variants.map(v=>v.price)))}</div></div><div class="item-actions">${unavailable?'<span class="badge">Sold out</span>':item.ask?'<button class="add-btn ask-price" data-item="${item.id}">Ask us</button>':variants.map(v=>{const key=item.id+"|"+v.label,qty=cart.get(key)?.qty||0;return `<div class="variant-row"><small>${item.variants?v.label:""}</small>${qty? `<div class="qty-control"><button data-action="dec" data-key="${key}">−</button><span>${qty}</span><button data-action="inc" data-key="${key}">+</button></div>`:`<button class="add-btn" data-action="add" data-key="${key}" data-name="${item.name}" data-variant="${item.variants?v.label:""}" data-price="${v.price}">+ Add ${item.variants?v.label:""}</button>`}</div>`}).join("")}</div></article>`;
 }).join("");
}
function totals(){let qty=0,total=0;for(const row of cart.values()){qty+=row.qty;total+=row.qty*row.price;}return{qty,total};}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2100);}
function updateCart(){
 const {qty,total}=totals();cartFab.hidden=qty===0;document.querySelector("#cartCount").textContent=qty;document.querySelector("#cartTotal").textContent=money(total);document.querySelector("#drawerTotal").textContent=money(total);document.querySelector("#sendOrder").disabled=qty===0;
 const rows=[...cart.values()];
 document.querySelector("#orderItems").innerHTML=rows.length?rows.map(row=>`<div class="order-row"><div><strong>${row.name}${row.variant!=="Regular"?" ("+row.variant+")":""}</strong><small>${money(row.price)} each · Subtotal ${money(row.price*row.qty)}</small></div><div class="qty-control"><button data-action="dec" data-key="${row.key}">−</button><span>${row.qty}</span><button data-action="inc" data-key="${row.key}">+</button></div></div>`).join(""):'<p class="empty-cart">Your order is waiting for its first treat.</p>';
}
function changeQty(key,delta){const row=cart.get(key);if(!row)return;row.qty+=delta;if(row.qty<=0)cart.delete(key);updateCart();renderMenu();}
function addItem(button){const key=button.dataset.key;const price=Number(button.dataset.price);if(!Number.isFinite(price)||price<0)return;const current=cart.get(key);if(current)current.qty++;else cart.set(key,{key,name:button.dataset.name,variant:button.dataset.variant||"Regular",price,qty:1});updateCart();renderMenu();showToast("Added to your order");}
function openDrawer(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");backdrop.hidden=false;document.body.style.overflow="hidden";}
function closeDrawer(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");backdrop.hidden=true;document.body.style.overflow="";}
function makeOrderMessage(){
 const {total}=totals();const lines=["Hello CafeOteca! I'd like to place an order:",""];
 [...cart.values()].forEach((row,index)=>lines.push(`${index+1}. ${row.name}${row.variant!=="Regular"?" ("+row.variant+")":""} × ${row.qty} = ${money(row.price*row.qty)}`));
 const customer=document.querySelector("#customerName").value.trim();if(customer)lines.push("",`Name / Table: ${customer}`);
 lines.push("",`Estimated total: ${money(total)}`,"Please confirm availability and the final bill. Thank you!");
 return lines.join("\n");
}
function sendOrder(){if(!cart.size)return;const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(makeOrderMessage())}`;window.open(url,"_blank","noopener,noreferrer");}
categoryTabs.addEventListener("click",event=>{const button=event.target.closest("[data-category]");if(!button)return;activeCategory=button.dataset.category;renderTabs();renderMenu();});
menuSearch.addEventListener("input",renderMenu);
menuGrid.addEventListener("click",event=>{const button=event.target.closest("button");if(!button)return;if(button.dataset.action==="add")addItem(button);else if(button.dataset.action==="inc")changeQty(button.dataset.key,1);else if(button.dataset.action==="dec")changeQty(button.dataset.key,-1);else if(button.classList.contains("ask-price")){const item=allItems.find(row=>row.id===button.dataset.item);const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello CafeOteca! Please share the price of "+item.name+".")}`;window.open(url,"_blank","noopener,noreferrer");}});
document.querySelector("#orderItems").addEventListener("click",event=>{const button=event.target.closest("button[data-action]");if(button)changeQty(button.dataset.key,button.dataset.action==="inc"?1:-1);});
cartFab.addEventListener("click",openDrawer);document.querySelector("#closeDrawer").addEventListener("click",closeDrawer);backdrop.addEventListener("click",closeDrawer);
document.querySelector("#sendOrder").addEventListener("click",sendOrder);
document.querySelector("#clearOrder").addEventListener("click",()=>{cart.clear();updateCart();renderMenu();showToast("Order cleared");});
document.querySelector("#menuToggle").addEventListener("click",()=>{const nav=document.querySelector("#mainNav");const open=nav.classList.toggle("open");document.querySelector("#menuToggle").setAttribute("aria-expanded",String(open));});
document.querySelectorAll("#mainNav a").forEach(link=>link.addEventListener("click",()=>{document.querySelector("#mainNav").classList.remove("open");document.querySelector("#menuToggle").setAttribute("aria-expanded","false");}));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDrawer();});
document.querySelector("#year").textContent=new Date().getFullYear();
renderTabs();renderMenu();updateCart();
