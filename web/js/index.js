const BASE_URL = 'http://localhost:8000'
let mode = 'CREATE'
let selectedID = ''
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');
    //console.log('c_id',customerId)
    if (customerId) { mode = 'EDIT'
        selectedID = customerId
        try { const response = await axios.get(`${BASE_URL}/customers/${customerId}`)
            const customer = response.data
            let nameDOM = document.querySelector('input[name=name]')
            let addressDOM = document.querySelector('input[name=address]')
            let telDOM = document.querySelector('input[name=tel]')
            nameDOM.value = customer.name
            addressDOM.value = customer.address
            telDOM.value = customer.tel
            console.log('customer',customer)
        }catch(error) { console.log('error',error) }
    }
}

const submitData = async () => { 
    let nameDOM = document.querySelector('input[name=name]')
    let addressDOM = document.querySelector('input[name=address]')
    let telDOM = document.querySelector('input[name=tel]')
    let messageDOM = document.getElementById('message')
    try { 
        //console.log('test')
        let customerData = { 
            name: nameDOM.value,
            address: addressDOM.value,
            tel: telDOM.value,
        }
        console.log('ส่งข้อมูลสำเร็จ', customerData)
        const errors = validateData(customerData)
        if(errors.length >0) { 
            throw { 
                message: 'กรอกข้อมูลให้ครบถ้วนด้วยจ้าา!!',
                errors: errors  
            } 
        }
        let message = 'บันทึกข้อมูลสำเร็จแล้ว'
        if(mode == 'CREATE') { 
            const response = await axios.post(`${BASE_URL}/customers`,customerData)
            console.log('response', response.data)
        }else { 
            const response = await axios.put(`${BASE_URL}/customers/${selectedID}`,customerData)
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
function validateValue() {
    if (this.value.length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
    }
}
const validateData = (userData) => {
    let errors = []
    if(!userData.name){ errors.push('กรุณากรอกชื่อ') }
    if(!userData.address){ errors.push('กรุณากรอกที่อยู่') }
    if(!userData.tel){ errors.push('กรุณากรอกเบอร์โทรศัพท์') }
    return errors
}