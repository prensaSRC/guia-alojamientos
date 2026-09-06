import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';

class Usuario extends Model {
  // Compara la contraseña en texto plano con el hash almacenado
  validarPassword(passwordPlano) {
    return bcrypt.compareSync(passwordPlano, this.password);
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'admin'
    }
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    underscored: true,
    timestamps: true
  }
);

export default Usuario;