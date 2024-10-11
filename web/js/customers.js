const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('On load')

    const response = await axios.get(`${BASE_URL}/customers`)
    console.log(response.data)

    const userDOM = document.getElementById('customers')
    let htmlData = '<div>'
    htmlData += `<table>
                    <tr>
                        <th>No.</th>
                        <th>ชื่อ</th>
                        <th>ที่อยู่</th>
                        <th>เบอร์โทรศัพท์</th>
                        <th>แก้ไข</th>
                        <th>ลบ</th>
                    </tr>`
    for (let i = 0; i < response.data.length; i++){
        let customers = response.data[i]
        htmlData += `
        <tr>
            <td>${i+1}</a></td>
            <td><a href='order.html?id=${customers.c_id}'>${customers.name}</a></td>
            <td><a href='order.html?id=${customers.c_id}'>${customers.address}</a></td>
            <td><a href='order.html?id=${customers.c_id}'>${customers.tel}</a></td>
            <td><a href='cus_mng.html?id=${customers.c_id}'><button class='edit'>Edit</button></a></td>
            <td><button class='delete' data-id='${customers.c_id}'>Delete</button></td>
        </tr>`
    }
    htmlData += '</table>'
    htmlData += '</div>' 
    userDOM.innerHTML = htmlData

    const deleteDOM = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOM.length; i++) {
        deleteDOM[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try {
                await axios.delete(`${BASE_URL}/customers/${id}`);
                loadData();
            } catch (error) {
                console.error(error);
            }
        });
    }
}