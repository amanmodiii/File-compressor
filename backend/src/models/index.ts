import User from './User';
import File from './File';

// Set up associations
User.hasMany(File, {
  foreignKey: 'userId',
  as: 'files',
  onDelete: 'CASCADE'
});

File.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export {
  User,
  File
}; 