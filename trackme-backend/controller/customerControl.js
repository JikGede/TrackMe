const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../database/customer');

// Fungsi untuk registrasi pelanggan
const registerCustomer = async (req, res) => {
  try {
    const { customerName, email, password, contactNumber } = req.body;

    // Memeriksa apakah email sudah terdaftar
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Enkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat objek customer baru
    const newCustomer = new Customer({
      customerName,
      email,
      password: hashedPassword,
      contactNumber
    });

    // Menyimpan customer baru ke database
    const savedCustomer = await newCustomer.save();
    res.status(201).json({ message: 'Registrasi berhasil', customer: savedCustomer });
  } catch (error) {
    console.error('Error registrasi: ', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
  }
};

// Fungsi untuk login pelanggan dan membuat JWT
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, customer.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    //JWT token
    const token = jwt.sign(
      {
        customerID: customer.customerID,
        email: customer.email,
        customerName: customer.customerName, 
        contactNumber: customer.contactNumber
      },
      'secret_key',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error('Error login: ', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }
};


module.exports = {
  registerCustomer,
  loginCustomer
};
