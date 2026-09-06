import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Alojamiento extends Model {}

Alojamiento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telefonos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    web: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Alojamiento',
    tableName: 'alojamientos',
    underscored: true,
    timestamps: true
  }
);

export default Alojamiento;