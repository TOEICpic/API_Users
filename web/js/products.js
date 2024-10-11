const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('On load')

    const response = await axios.get(`${BASE_URL}/products`)
    console.log(response.data)

    const userDOM = document.getElementById('customers')
    let htmlData = '<div>'
    htmlData += `<table>
                    <tr>
                        <th>No.</th>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>แก้ไข</th>
                        <th>ลบ</th>
                    </tr>`
    
    for (let i = 0; i < response.data.length; i++){
        let products = response.data[i]
        htmlData += `
        <tr>
        <td>${i+1}</td>
        <td>${products.p_id}</td>
        <td>${products.name}</td>
        <td>${products.price}</td>
        <td>${products.num}</td>
        <td><a href='pro_mng.html?id=${products.p_id}'><button class='edit'>Edit</button></a></td>
        <td><button class='delete' data-id='${products.p_id}'>Delete</button></td>
        </tr>`
    }
    htmlData += '</table>'
    htmlData += '</div>' 
    userDOM.innerHTML = htmlData

    const deleteDOM = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOM.length; i++) {
        deleteDOM[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/products/${id}`)
                loadData()
            }catch(error) {
                console.error(error)
            }
        })
    }
}