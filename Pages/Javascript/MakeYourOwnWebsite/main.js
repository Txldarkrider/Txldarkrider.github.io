function CreateElement(type,parentId,text,style){
    console.log(type);
    let e = document.createElement(type);
    e.innerHTML = text;
    e.style = style;
    document.getElementById(parentId).appendChild(e);
}
function GetElement(id){
    return document.getElementById(id);
}