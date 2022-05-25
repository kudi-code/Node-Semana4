const { app } = require('./app');

// Models
const { Repair } = require('./models/repairs.model');
const { User } = require('./models/users.model');

// Utils
const { db } = require('./utils/database');



// Authenticate database credentials
db.authenticate()
  .then(() => console.log('Login Sucess!'))
  .catch(err => console.log(err));

// Establish models relations

// 1 User <----> M Post
// User.hasMany(Post, { foreignKey: 'userId' });
User.hasMany(Repair);
Repair.belongsTo(User);

// Sync sequelize models
db.sync(
  // {force: true}
)
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err));

// Spin up server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
