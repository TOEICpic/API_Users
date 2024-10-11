const BASE_URL = 'http://localhost:8000'
let mode = 'CREATE'
let selectedID = ''
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pId = urlParams.get('id');
    if (pId) { mode = 'EDIT'
        selectedID = pId
        try { const response = await axios.get(`${BASE_URL}/products/${pId}`)
            const product = response.data
            let nameDOM = document.querySelector('input[name=name]')
            let priceDOM = document.querySelector('input[name=price]')
            let numDOM = document.querySelector('input[name=num]')
            nameDOM.value = product.name
            priceDOM.value = product.price
            numDOM.value = product.num
            //console.log('customer',product)
        }catch(error) { console.log('error',error) }
    }
}

const submitData = async () => { 
    let nameDOM = document.querySelector('input[name=name]')
    let priceDOM = document.querySelector('input[name=price]')
    let numDOM = document.querySelector('input[name=num]')
    let messageDOM = document.getElementById('message')
    try { 
        //console.log('test')
        let productData = { 
            name: nameDOM.value,
            price: priceDOM.value,
            num: numDOM.value,
        }
        console.log('ส่งข้อมูลสำเร็จ', productData)
        const errors = validateData(productData)
        if(errors.length >0) { 
            throw { 
                message: 'กรอกข้อมูลให้ครบถ้วนด้วยจ้าา!!',
                errors: errors  
            } 
        }
        let message = 'บันทึกข้อมูลสำเร็จแล้ว'
        if(mode == 'CREATE') { 
            const response = await axios.post(`${BASE_URL}/products`,productData)
            console.log('response', response.data)
        }else { 
            const response = await axios.put(`${BASE_URL}/products/${selectedID}`,productData)
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
    if(!userData.price){ errors.push('กรุณากรอกราคา') }
    if(!userData.num){ errors.push('กรุณากรอกจำนวนที่เหลือ') }
    return errors
}