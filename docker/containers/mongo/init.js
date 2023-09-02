db.createUser({
  user: 'devlop',
  pwd: 'devlop',
  roles: [
    {
      role: 'readWrite',
      db: 'mongo-develop',
    },
  ],
})
