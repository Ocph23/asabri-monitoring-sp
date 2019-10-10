
const dbContext = {
  Users: require('./user.db'),
  Roles: require('./role.db'),
  Bank: require('./bank.db'),
  Mitra: require('./mitra.db'),
  SP: require('./sp.db'),
  Asuransi:require('./asuransi.db')

};

module.exports = dbContext;