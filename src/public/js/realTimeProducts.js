const socket = io();

function sendDataCreate() {
    const data = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        status: true,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    }

    socket.emit("newProduct", data);
};

function sendDataDelete() {
    const data = document.getElementById("delete-id").value;

    socket.emit("deleteProduct", data);
}