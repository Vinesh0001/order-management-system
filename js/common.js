
function getOrderedlist() {
    var orderitems = localStorage.getItem("orderList");
    if(orderitems) {
        return JSON.parse(orderitems).values;
    }
    else {
        return [];
    }
};

function setOrderedList(orderList) {
    const obj = {
        values:orderList,
    };
    localStorage.setItem("orderList", JSON.stringify(obj));
};

function getIndexOfOrder(id, orderList) {
    var index=-1;
    for(var i = 0 ;i < orderList.length ; i++) {
        if(orderList[i].id == id) {
            index=i;
            break;
        }
    }
    return index;
}

$(function() {
    $("#bootstrap").load("bootstrapimport.html");
    $("#header").load("header.html");
    $("#footer").load("footer.html");
});

    

function createOrder() {
    var file = document.getElementById("image").files[0];
    var reader = new FileReader();

    reader.onload = function() {
        var imagedata = reader.result;
        createOrderAfterReading(imagedata);
    };
    reader.readAsDataURL(file);
}

 function createOrderAfterReading(imagedata) {
    var id = document.getElementById("id").value;
    var name = document.getElementById("name").value;
    var desc = document.getElementById("desc").value;
    const order = {
        id:id,
        name:name,
        desc:desc,
        image:imagedata,
    };
    var orderList = getOrderedlist();
    console.log(orderList);
    var index = getIndexOfOrder(order.id , orderList);
    if(index > -1) {
        alert(`Order: ${order.id} is already present`);
    }
    else {
        orderList.unshift(order);
        setOrderedList(orderList);
        document.getElementById("form").reset();
        alert(`Order: ${order.id} created Succesfully`);
    }
}



function getAllOrders() {
   const allOrders = getOrderedlist();
   console.log(allOrders);
   var parent = document.getElementById("view-order-parent");
   parent.innerHTML =``;

   if(allOrders.length == 0) {
    parent.innerHTML = `<div style="color :red;">No Orders Found</div>`
   }
   for(var order of allOrders) {
    var cardDiv = document.createElement("div");
    cardDiv.setAttribute("class" , "card col-lg-4 col-md-6 col-sm-12");
    cardDiv.innerHTML =`
                            <img src="${order.image}" class="card-img-top" alt="Order Image">
                            <div class="card-body">
                              <h5 class="card-title">${order.id}</h5>
                              <h5 class="card-title">${order.name}</h5>
                              <p class="card-text">${order.desc}</p>
                              <a href="${order.image}" download="${order.id}.jpg" class="btn btn-primary">Download</a>
                            </div>
    `;
    parent.appendChild(cardDiv);
   }
}

function getAllOrdersForDelete() {
    var allOrders = getOrderedlist();
    var tbody = document.getElementById("tbody");
    var notFound = document.getElementById("not-found");
    notFound.innerHTML = ``;
    if(allOrders.length == 0) {
        notFound.innerHTML = `<div style="color :red;">No Orders Found</div>`;
    }
    tbody.innerHTML = ``;
    for(var order of allOrders) {
        var row = document.createElement("tr");
        row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.desc}</td>
        <td>
            <a href="${order.image}" download="${order.id}.jpg">Click here to Download image</a>
            <br>
            <a href="#" onclick="openImage(${order.id})">Click here to preview image</a>
        </td>
        <td>
            <button class="btn btn-primary" onclick="deleteOrder(${order.id})">Delete</button>
        </td>
        `;
        tbody.appendChild(row);
    }
}

function openImage(id) {
    var allOrders = getOrderedlist();
    var index = getIndexOfOrder(id , allOrders);
    if(index == -1) {
        alert("No image found");
    }
    else {
        var image = allOrders[index].image;
        var win = window.open();
        win.document.write(`<iframe src = "${image}" style ="height:100%;width:100%;" frameborder=0></iframe>`);
    }
}

function deleteOrder(id) {
    console.log(id);
    //local storage should be updated
    //refresh data and show no items found
    var x = confirm("Are you sure?");
    if(!x) {
        return ;
    }
    var allOrdersA = getOrderedlist();
    console.log(allOrdersA);
    var index = getIndexOfOrder(id , allOrdersA);
    console.log(index);
    if(index == -1) {
        alert("Order not found");
    }
    else {
        allOrdersA.splice(index , 1);
        localStorage.setItem("orderList",allOrdersA);
        alert(`Order:${id} deleted Succesfully`);
        getAllOrdersForDelete();
    }
}

function getAllOrdersForUpdate() {
    var allOrders = getOrderedlist();
    var tbody = document.getElementById("tbody");
    var notFound = document.getElementById("not-found");
    notFound.innerHTML = ``;
    if(allOrders.length == 0) {
        notFound.innerHTML = `<div style="color :red;">No Orders Found</div>`;
    }
    tbody.innerHTML = ``;
    for(var order of allOrders) {
        var row = document.createElement("tr");
        row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.desc}</td>
        <td>
            <a href="${order.image}" download="${order.id}.jpg">Click here to Download image</a>
            <br>
            <a href="#" onclick="openImage(${order.id})">Click here to preview image</a>
        </td>
        <td>
            <button onclick="showUpdate(${order.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary" >Update</button>
        </td>
        `;
        tbody.appendChild(row);
    }
}

function showUpdate(id) {
    var allOrders = getOrderedlist();
    var index = getIndexOfOrder(id , allOrders);
    if(index == -1) {
        document.getElementById("id").value="";
        document.getElementById("name").value="";
        document.getElementById("desc").value="";
        document.getElementById("preview").src="";
        alert("Order not found");
    } else {
        var order = allOrders[index];
        document.getElementById("id").value=order.id;
        document.getElementById("name").value=order.name;
        document.getElementById("desc").value=order.desc;
        document.getElementById("preview").src=order.image;
    }
}

function updatePreviewImage() {
    var file = document.getElementById("image").files[0];
    var reader = new FileReader();
    reader.onload = function() {
        document.getElementById("preview").src = reader.result;
    }
    reader.readAsDataURL(file);
}


function updateOrder() {
        var id =document.getElementById("id").value;
        var name =document.getElementById("name").value;
        var desc =document.getElementById("desc").value;
        var image =document.getElementById("preview").src;
        const order = {
            id:id,
            name:name,
            image:image,
            desc:desc,
        };
        var allOrders = getOrderedlist();
        var index = getIndexOfOrder(id ,allOrders);
        if(index == -1) {
            alert("Order not found");
            return;
        }
        allOrders[index]=order;
        setOrderedList(allOrders);
        document.getElementById("close").click();
        alert(`Order: ${id} updated successfully`);
        getAllOrdersForUpdate();
}






