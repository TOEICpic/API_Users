const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');
    if (customerId) {
        await loadData(customerId);
    }
    // await loadData()
}

const loadData = async (customerId) => {
    console.log('On load')

    const response = await axios.get(`${BASE_URL}/orders/customer/${customerId}`);
    console.log(response.data);

    const userDOM = document.getElementById('customers')
    let htmlData = '<div>'
    
    if (response.data.length == 0) {
        htmlData += '<div>ยังไมีมีรายการซื้อขาย</div>'
    }
    else {
        htmlData += `<table>
                    <tr>
                        <th>No.</th>
                        <th>วันที่สั่งซื้อ</th>
                        <th>เวลาสั่งซื้อ</th>
                        <th>จำนวนที่สั่งซื้อ</th>
                        <th>รหัสสิค้า</th>
                        <th>แก้ไข</th>
                        <th>ลบ</th>
                    </tr>`
        for (let i = 0; i < response.data.length; i++){
            let orders = response.data[i]
            htmlData += `<div class='flex'>
            <tr>
            <td>${i+1}</td>
            <td>${new Date(orders.date_t).toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' })} </td>
            <td>${orders.time_d} </td>
            <td>${orders.total}</td>
            <td>${orders.p_id}</td>
            <td><a href='order_mng.html?id=${orders.id}'><button class='edit'>Edit</button></a></td>
            <td><button class='delete' data-id='${orders.id}'>Delete</button></td>
            </tr>
            `
        }
    }
    htmlData += '</table>'
    htmlData += '</div>' 
    userDOM.innerHTML = htmlData

    const deleteDOM = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOM.length; i++) {
        deleteDOM[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/orders/${id}`)
                loadData()
            }catch(error) {
                console.error(error)
            }
        })
    }
}