const BASE_URL = 'http://localhost:8000'
let mode = 'CREATE'
let selectedID = ''

window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('On load');
    //let dateDOM = document.getElementById('date_t');
    //let timeDOM = document.getElementById('time_d');
    ///dateDOM.value = new Date().toISOString().split('T')[0];
    //timeDOM.value = new Date().toISOString().split('T')[1].split('.')[0];
    let selectedProductId = "";
    let selectedCustomerId = "";
    const response1 = await axios.get(`${BASE_URL}/products`);
    console.log(response1.data);

    const response2 = await axios.get(`${BASE_URL}/customers`);
    console.log(response2.data);

    const datetDOM = document.getElementById('date_t');
    let htmlData0 = '<input class="form"  type="date" id="date" name="date_t">';
    datetDOM.innerHTML = htmlData0;

    const timedDOM = document.getElementById('time_d');
    let htmlData00 = '<input class="form"  type="time" id="time" name="time_d">';
    timedDOM.innerHTML = htmlData00;

    const proDOM = document.getElementById('products');
    let htmlData1 = '<select class="form" name="product" id="p_id">';
    for (let i = 0; i < response1.data.length; i++){
        let products = response1.data[i];
        htmlData1 += `<option class="form" value="${products.p_id}">${products.p_id}</option>`;
    }
    htmlData1 += '</select>';
    proDOM.innerHTML = htmlData1;
    
    document.getElementById("p_id").addEventListener("change", function() {
        selectedProductId = this.value; // เก็บค่า product ID ที่ถูกเลือกในตัวแปร selectedProductId
        console.log(selectedProductId);
    });

    const userDOM = document.getElementById('customers');
    let htmlData = '<select name="customer" id="c_id">';
    for (let i = 0; i < response2.data.length; i++){
        let customers = response2.data[i];
        htmlData += `<option value="${customers.c_id}">${customers.c_id}</option>`;
    }
    htmlData += '</select>';
    userDOM.innerHTML = htmlData;

    document.getElementById("c_id").addEventListener("change", function() {
        selectedCustomerId = this.value; // เก็บค่า product ID ที่ถูกเลือกในตัวแปร selectedProductId
        console.log(selectedCustomerId);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) { mode = 'EDIT'
        selectedID = id
        try { const response = await axios.get(`${BASE_URL}/orders/${selectedID}`)
            const orders = response.data
            let dateDOM = document.querySelector('input[name=date_t]')
            let timeDOM = document.querySelector('input[name=time_d]')
            let totalDOM = document.querySelector('input[name=total]')
            let pidDOM = document.getElementById('p_id');
            let cidDOM = document.getElementById('c_id');

            let ordersDate = new Date(orders.date_t);
            ordersDate.setDate(ordersDate.getDate() + 1);
            let formattedDate = ordersDate.toISOString().split('T')[0];
            //console.log('formattedDate', formattedDate)
            dateDOM.value = formattedDate;
            //dateDOM.value = orders.date_t
            timeDOM.value = orders.time_d
            totalDOM.value = orders.total
            pidDOM.value = orders.p_id
            cidDOM.value = orders.c_id
            //console.log('customer',product)
        }catch(error) { console.log('error',error) }
    }
};

const submitData = async () => { 
    //let dateDOM = document.getElementById('date');
    //let timeDOM = document.getElementById('time_d');
    let dateDOM = document.querySelector('input[name=date_t]')
    let timeDOM = document.querySelector('input[name=time_d]')
    let totalDOM = document.querySelector('input[name=total]')
    let pidDOM = document.getElementById('p_id');
    let cidDOM = document.getElementById('c_id');
    let messageDOM = document.getElementById('message')

    //dateDOM.value = new Date().toISOString().split('T')[0];
    //timeDOM.value = new Date().toISOString().split('T')[1].split('.')[0];
    try { 
        //console.log('test')
        let orderData = { 
            date_t: dateDOM.value,
            time_d: timeDOM.value,
            total: totalDOM.value,
            p_id: pidDOM.value,
            c_id: cidDOM.value,
        }
        //console.log('ส่งข้อมูลสำเร็จ', orderData)
        const errors = validateData(orderData)
        if(errors.length >0) { 
            throw { 
                message: 'กรอกข้อมูลให้ครบถ้วนด้วยจ้าา!!',
                errors: errors  
            } 
        }
        let message = 'บันทึกข้อมูลสำเร็จแล้ว'
        if(mode == 'CREATE') { 
            const response = await axios.post(`${BASE_URL}/orders`,orderData)
            console.log('response', response.data)
        }else { 
            const response = await axios.put(`${BASE_URL}/orders/${selectedID}`,orderData)
            message = 'แก้ไขข้อมูลเรียบร้อย'
            console.log('response', response.data) 
        }
        messageDOM.innerText = message
        messageDOM.className = 'message success'
    }catch(error) {
        console.log('error message',error.message)
        console.log('error', error.errors)
        if(error.response) { 
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors 
        }
        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'
        for (let i = 0; i < error.errors.length; i++) { 
            htmlData += `<li>${error.errors[i]}</li>` 
        }
        htmlData += '</ul>'
        htmlData += '</div>'
        messageDOM.innerHTML = htmlData
        messageDOM.className = 'message danger' }
}
const validateData = (userData) => {
    let errors = []
    if(!userData.date_t){ errors.push('กรุณากรอกวันที่') }
    if(!userData.time_d){ errors.push('กรุณากรอกเวลา') }
    if(!userData.total){ errors.push('กรุณากรอกจำนวนทั้งหมด') }
    if(!userData.p_id){ errors.push('กรุณากรอกรหัสสินค้า') }
    if(!userData.c_id){ errors.push('กรุณากรอกรหัสลูกค้า') }
    return errors
}