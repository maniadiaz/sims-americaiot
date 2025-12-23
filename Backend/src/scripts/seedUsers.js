require('dotenv').config();
const { User } = require('../models');
const { connectDB } = require('../config/database');

const seedUsers = async () => {
  try {
    await connectDB();

    // Crear usuario administrador de prueba
    const adminUser = await User.create({
      nombre: 'Test',
      apellidos: 'Admin',
      email: 'test.admin@americaiot.com',
      num_telefonico: '5551234567',
      username: 'test_admin',
      password: 'americaiot_test_admin',
      rol: 'admin',
      status: 'activo'
    });

    console.log('✓ Usuario Admin creado:', {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      rol: adminUser.rol
    });

    // Crear usuario normal de prueba
    const normalUser = await User.create({
      nombre: 'Test',
      apellidos: 'User',
      email: 'test.user@americaiot.com',
      num_telefonico: '5559876543',
      username: 'test_user',
      password: 'americaiot_test_user',
      rol: 'user',
      status: 'activo'
    });

    console.log('✓ Usuario User creado:', {
      id: normalUser.id,
      username: normalUser.username,
      email: normalUser.email,
      rol: normalUser.rol
    });

    console.log('\n✓ Usuarios de prueba creados exitosamente');
    console.log('\nCredenciales:');
    console.log('Admin:');
    console.log('  Username: test_admin');
    console.log('  Password: americaiot_test_admin');
    console.log('\nUser:');
    console.log('  Username: test_user');
    console.log('  Password: americaiot_test_user');

    process.exit(0);
  } catch (error) {
    console.error('Error al crear usuarios de prueba:', error);
    process.exit(1);
  }
};

seedUsers();
