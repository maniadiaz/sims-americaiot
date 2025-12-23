const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es requerido' }
    }
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Los apellidos son requeridos' }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: {
      msg: 'Este email ya está registrado'
    },
    validate: {
      isEmail: { msg: 'Debe ser un email válido' },
      notEmpty: { msg: 'El email es requerido' }
    }
  },
  num_telefonico: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^[0-9+\-\s()]*$/,
        msg: 'Formato de teléfono inválido'
      }
    }
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Este username ya está en uso'
    },
    validate: {
      notEmpty: { msg: 'El username es requerido' },
      len: {
        args: [3, 50],
        msg: 'El username debe tener entre 3 y 50 caracteres'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es requerida' },
      len: {
        args: [6, 255],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  },
  rol: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: {
        args: [['admin', 'user']],
        msg: 'El rol debe ser admin o user'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('activo', 'bloqueado'),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: {
        args: [['activo', 'bloqueado']],
        msg: 'El status debe ser activo o bloqueado'
      }
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to validate password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to hide password in JSON
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
