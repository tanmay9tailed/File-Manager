const explorerData = [];
const parentContainer = document.querySelector(".parentContainer");
const parentFolder = document.querySelector("#parentFolder");
const parentFile = document.querySelector("#parentFile");

parentFolder.addEventListener("click" , () => {
    const item = createItemInput(explorerData, parentContainer, null, true);
    parentContainer.appendChild(item)
})
parentFile.addEventListener("click" , () => {
    const item = createItemInput(explorerData,parentContainer,"file",true);
    parentContainer.appendChild(item);
})

function createFileorFolder(item , type = null , isFirstlevel){
 const explorerDiv = document.createElement("div");
 explorerDiv.className = "explorerDiv";
 if(isFirstlevel){
    explorerDiv.style.marginLeft = type==="file" && "30px";
 }else{
    explorerDiv.style.marginLeft = type === "file"?"60px" :"30px";
 }

 if(type === "file"){
    explorerDiv.innerHTML = `
        <div class="container">
            <div class="file-info">
                <img src="./Assets/file.svg" class="file">
                <p>${item.text}</p>
            </div>
            <div class="action">
                <img src="./Assets/edit.svg" class="edit-btn">
                <img src="./Assets/delete.svg" class="delete-btn">
            </div>
        </div>
    `
 }else{
    explorerDiv.innerHTML = `
    <div class="container">
        <div class="folder-info">
            <img src="./Assets/arrow-up.svg" class="arrow" id="up">
            <img src="./Assets/folder.svg" class="folder">
            <p>${item.text}</p>
        </div>
        <div class="action">
            <img src="./Assets/folder-add.svg" class="addFolder">
            <img src="./Assets/file-add.svg" class="addFile">
            <img src="./Assets/edit.svg" class="edit-btn">
            <img src="./Assets/delete.svg" class="delete-btn">
        </div>
    </div>
    <div class="item-container"></div>
`
 }
 const itemContainer = explorerDiv?.querySelector(".item-container");
 const arrow = explorerDiv?.querySelector(".arrow");
 const folderInfo = explorerDiv?.querySelector(".folder-info");
 folderInfo?.addEventListener("click",() => {
    if(itemContainer.style.display === "none"){
        arrow.src = "./Assets/arrow-down.svg";
        itemContainer.style.display = "block"
    }else{
        arrow.src = "./Assets/arrow-up.svg";
        itemContainer.style.display = "none"
    }
 })

 const addFolderbtn = explorerDiv?.querySelector(".addFolder");
 addFolderbtn?.addEventListener("click",() => {
    arrow.src = "./Assets/arrow-down.svg";
    itemContainer.appendChild(createItemInput(item,explorerDiv))
 })

 const addFile = explorerDiv?.querySelector(".addFile");
 addFile?.addEventListener("click",() => {
    arrow.src = "./Assets/arrow-down.svg";
    itemContainer.appendChild(createItemInput(item,explorerDiv,"file"))
 })

 const deleteBtn = explorerDiv.querySelector(".delete-btn");
 deleteBtn.addEventListener("click", () => {
   function deleteObjectById(array, targetId) {
     for (let i = 0; i < array.length; i++) {
       if (array[i].id === targetId) {
         array.splice(i, 1);
         return true; // Object found and deleted
       }

       if (array[i].items && array[i].items.length > 0) {
         // Recursively search in items
         if (deleteObjectById(array[i].items, targetId)) {
           return true; // Object found and deleted in items
         }
       }
     }
     return false; // Object not found
   }
   deleteObjectById(explorerData, item.id);
   explorerDiv.remove();
 });

 const editbtn = explorerDiv?.querySelector(".edit-btn");
 editbtn?.addEventListener("click",() => {
    if(document.querySelector(".save-btn")){
        document.querySelector(".save-btn").remove();
        document.querySelector(".cancel-btn").remove();
    }
    if(document.querySelector(".createItemContainer")){
        document.querySelector(".createItemContainer").remove()
    }
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "save-btn";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "cancel-btn";
    explorerDiv.insertBefore(saveBtn,itemContainer);
    explorerDiv.insertBefore(cancelBtn,itemContainer);

    const itemName = explorerDiv.querySelector("p");
    itemName.contentEditable = "true";
    itemName.focus();

    saveBtn.addEventListener("click",() => {
        itemName.contentEditable = "false";
        item.text = itemName.textContent;
        saveBtn.remove();
        cancelBtn.remove();
    })

    cancelBtn.addEventListener("click",() => {
        itemName.contentEditable = "false";
        itemName.textContent = item.text; 
        saveBtn.remove();
        cancelBtn.remove();
    })
    
 })
 return explorerDiv;
}

function createItemInput(item , parentContainer , type , isFirstlevel) {
    if(document.querySelector(".createItemContainer")){
        document.querySelector(".createItemContainer").remove()
    }
    if(document.querySelector(".save-btn")){
        document.querySelector(".save-btn").remove();
        document.querySelector(".cancel-btn").remove();
    }
    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.placeholder = type === "file" ? "File name..." : "Folder name...";

    const addButton = document.createElement("button");
    addButton.textContent = type === "file" ? "Add file" : "Add folder";
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = type === "file" ? "Cancel" : "Cancel";

    const createItemContainer = document.createElement("div");
    createItemContainer.className = "createItemContainer";
    createItemContainer.appendChild(itemInput);
    createItemContainer.appendChild(addButton);
    createItemContainer.appendChild(cancelButton);
    createItemContainer.style.marginLeft = !isFirstlevel && "20px";

    addButton.addEventListener("click", () => {
        const itemText = itemInput.value.trim();
        if(itemText){
            const newItem = type === "file" ? {id:Date.now() , text:itemText} : {id:Date.now() , text:itemText , items:[]}

            isFirstlevel ? item.push(newItem) : item.items.push(newItem) ;

            if(isFirstlevel){
                parentContainer.appendChild(createFileorFolder(newItem , type === "file" && "file" , isFirstlevel));
            }else{
                parentContainer.querySelector(".item-container").appendChild(createFileorFolder(newItem , type === "file" && "file"))
            }
            createItemContainer.remove();
        }
    })

    cancelButton.addEventListener("click", () => {
        createItemContainer.remove();
    })
    return createItemContainer;
}