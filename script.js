const buttons = [

{
name:"🏠 Home",
command:"home"
},

{
name:"◀ Back",
command:"back"
},

{
name:"📋 Recent",
command:"recent"
},

{
name:"🔦 Flash",
command:"flash"
}

];

let area = document.getElementById("buttons");

buttons.forEach(btn=>{

let b=document.createElement("button");

b.className="btn";

b.innerHTML=btn.name;

b.onclick=()=>{

alert(btn.command);

};

area.appendChild(b);

});
