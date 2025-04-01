import { DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';

// Interface for File attributes
interface FileAttributes {
  id: string;
  userId: number;
  fileName: string;
  huffmanData: string;
  compressionRatio: number;
  fileSize: number;
  compressedSize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for File creation attributes
interface FileCreationAttributes extends Optional<FileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// File model class
class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: string;
  public userId!: number;
  public fileName!: string;
  public huffmanData!: string;
  public compressionRatio!: number;
  public fileSize!: number;
  public compressedSize!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize model
File.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    huffmanData: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    compressionRatio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compressedSize: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: true,
  }
);

export default File; 