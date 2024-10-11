const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise')
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 8000;
// สำหรับเก็บ users
// let users = []
// let counter = 1;
let conn = null
const initMySQL = async () => { conn = await mysql.createConnection({ host: 'localhost', user: 'root',
    password: 'root', database: 'webdb', port: 8700 })
}
// const validateData = (userData) => { let errors = []
//   if(!userData.firstname){ errors.push('กรุณากรอกชื่อ') }
//   if(!userData.lastname){ errors.push('กรุณากรอกนามสกุล') }
//   if(!userData.age){ errors.push('กรุณากรอกอายุ') }
//   if(!userData.gender){ errors.push('กรุณาเลือกเพศ') }
//   if(!userData.interests){ errors.push('กรุณาสิ่งที่สนใจ') }
//   if(!userData.description){ errors.push('กรุณากรอกคำอธิบาย') }
//   return errors
// }
// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/customers', async (req, res) => { const results = await conn.query('SELECT * FROM customers')
  res.json(results[0]) })
app.get('/products', async (req, res) => { const results = await conn.query('SELECT * FROM products')
  res.json(results[0]) })
app.get('/orders', async (req, res) => { const results = await conn.query('SELECT * FROM orders')
  res.json(results[0]) })
// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/customers',async (req, res) => {
  try { let customer = req.body;
    //const errors = validateData(customer)
    // if (errors.length > 0) { throw { message: 'กรอกข้อมูลไม่ครบ',
    //     errors: errors } }
    const results = await conn.query('INSERT INTO customers SET ?', customer)
    res.json({
      message: 'Create new user successfuly',
      data: results[0]
    })
  }catch (error) { const errorMessage = error.errors || 'Something went wrong!!!'
    const errors = error.errors || []
    console.log('errorMessage', error.message)
    res.status(500).json({ message: errorMessage,
      errors: errors })
  }
})
app.post('/products',async (req, res) => {
  try { let product = req.body;
    //const errors = validateData(customer)
    // if (errors.length > 0) { throw { message: 'กรอกข้อมูลไม่ครบ',
    //     errors: errors } }
    const results = await conn.query('INSERT INTO products SET ?', product)
    res.json({
      message: 'Create new user successfuly',
      data: results[0]
    })
  }catch (error) { const errorMessage = error.errors || 'Something went wrong!!!'
    const errors = error.errors || []
    console.log('errorMessage', error.message)
    res.status(500).json({ message: errorMessage,
      errors: errors })
  }
})
app.post('/orders',async (req, res) => {
  try { let order = req.body;
    //const errors = validateData(customer)
    // if (errors.length > 0) { throw { message: 'กรอกข้อมูลไม่ครบ',
    //     errors: errors } }
    const results = await conn.query('INSERT INTO orders SET ?', order)
    res.json({
      message: 'Create new user successfuly',
      data: results[0]
    })
  }catch (error) { const errorMessage = error.errors || 'Something went wrong!!!'
    const errors = error.errors || []
    console.log('errorMessage', error.message)
    res.status(500).json({ message: errorMessage,
      errors: errors })
  }
})
// path = GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/customers/:id', async (req, res) => {
  try { let id = req.params.id
    const results = await conn.query('SELECT * FROM customers WHERE c_id = ?', id)
    if(results[0].length == 0){ throw {
          statusCode: 404, message: 'user not found' }
    }
    res.json(results[0][0]);
  }catch(error){ console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({ message: 'Something went wrong',
      errorMessage: error.message })
  }
})
app.get('/products/:id', async (req, res) => {
  try { let id = req.params.id
    const results = await conn.query('SELECT * FROM products WHERE p_id = ?', id)
    if(results[0].length == 0){ throw {
          statusCode: 404, message: 'user not found' }
    }
    res.json(results[0][0]);
  }catch(error){ console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({ message: 'Something went wrong',
      errorMessage: error.message })
  }
})
app.get('/orders/:id', async (req, res) => {
  try { let id = req.params.id
    const results = await conn.query('SELECT * FROM orders WHERE id = ?', id)
    if(results[0].length == 0){ throw {
          statusCode: 404, message: 'user not found' }
    }
    res.json(results[0][0]);
  }catch(error){ console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({ message: 'Something went wrong',
      errorMessage: error.message })
  }
})
app.get('/orders/customer/:id', async (req, res) => { 
  let id = req.params.id
  const results = await conn.query('SELECT * FROM orders WHERE c_id = ?', id)
  res.json(results[0]) 
})

//path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/customers/:id',async (req, res) => {
  try { let id = req.params.id;
    let updatecustomer = req.body;
    const results = await conn.query('UPDATE customers SET ? WHERE c_id = ?', [updatecustomer, id])
    res.json({ message: 'Update user successfuly',
      data: results[0] })
  }catch (error) { console.log('errorMessage',error.message)
    res.status(500).json({ message: 'Something went wrong', })
  }
})
app.put('/products/:id',async (req, res) => {
  try { let id = req.params.id;
    let updateproduct = req.body;
    const results = await conn.query('UPDATE products SET ? WHERE p_id = ?', [updateproduct, id])
    res.json({ message: 'Update user successfuly',
      data: results[0] })
  }catch (error) { console.log('errorMessage',error.message)
    res.status(500).json({ message: 'Something went wrong', })
  }
})
app.put('/orders/:id',async (req, res) => {
  try { let id = req.params.id;
    let updateorder = req.body;
    const results = await conn.query('UPDATE orders SET ? WHERE id = ?', [updateorder, id])
    res.json({ message: 'Update user successfuly',
      data: results[0] })
  }catch (error) { console.log('errorMessage',error.message)
    res.status(500).json({ message: 'Something went wrong', })
  }
})

// path = DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/customers/:id',async (req, res) => {
  try { let id = req.params.id
    const results = await conn.query('DELETE FROM customers WHERE c_id = ?', [id])
    if(results[0].affectedRows == 0){ throw {
          statusCode: 404, message: 'user not found' }
    }
    res.json({  message: 'Deleted user successfuly',
      data: results[0] })
  }catch (error) { console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({ message: 'Error deleted user',
      errorMessage: error.message })
  }
})
app.delete('/products/:id',async (req, res) => {
  try { let id = req.params.id
    const results = await conn.query('DELETE FROM products WHERE p_id = ?', [id])
    if(results[0].affectedRows == 0){ throw {
          statusCode: 404, message: 'user not found' }
    }
    res.json({  message: 'Deleted user successfuly',
      data: results[0] })
  }catch (error) { console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({ message: 'Error deleted user',
      errorMessage: error.message })
  }
})
app.delete('/orders/:id',async (req, res) => {
  try { let id = req.params.id
    const results = await conn.query('DELETE FROM orders WHERE id = ?', [id])
    if(results[0].affectedRows == 0){ throw {
          statusCode: 404, message: 'user not found' }
    }
    res.json({  message: 'Deleted user successfuly',
      data: results[0] })
  }catch (error) { console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({ message: 'Error deleted user',
      errorMessage: error.message })
  }
})
app.listen(port , async (req, res) => { await initMySQL()
  console.log('http server running on', + port); })