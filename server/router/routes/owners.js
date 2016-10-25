'use strict';

module.exports = (app, db) => {

  // GET all owners
  app.get('/owners', (req, res) => {
    db.owners.findAll()
      .then(owners => {
        res.json(owners);
      });
  });

  // GET one owner by id
  app.get('/owner/:id', (req, res) => {
    const id = req.params.id;
    db.owners.find({
      where: { id: id }
    })
      .then(owner => {
        res.json(owner);
      });
  });

  // POST search route
  app.post('/owners', (req, res) => {
    const query = req.body.query;
    db.owners.findAll({
      where: query
    })
      .then(owners => {
        res.json(owners);
      });
  });

  // POST single owner
  app.post('/owner', (req, res) => {
    const name = req.body.name;
    const role = req.body.role;
    db.owners.create({
      name: name,
      role: role
    })
      .then(newOwner => {
        res.json(newOwner);
      })
  });

  // POST multiple owners
  app.post('/owners/bulk', (req, res) => {
    const ownerList = req.body.owners;
    db.owners.bulkCreate(ownerList)
      .then(newOwners => {
        res.json(newOwners);
      })
  });

  // PATCH single owner
  app.patch('/owner/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body.updates;
    db.owners.find({
      where: { id: id }
    })
      .then(owner => {
        return owner.updateAttributes(updates)
      })
      .then(updatedOwner => {
        res.json(updatedOwner);
      });
  });

  // PATCH multiple owners
  app.patch('/owners/bulk', (req, res) => {
    const ids = req.body.ids;
    const updates = req.body.updates;
    db.owners.findAll({
      where: { id: { $in: ids } }
    })
      .then(owners => {
        const updatePromises = owners.map(owner => {
         return owner.updateAttributes(updates);
        });
        return db.Sequelize.Promise.all(updatePromises)
      })
      .then(updatedOwners => {
        res.json(updatedOwners);
      });
  });

  // DELETE single owner
  app.delete('/owner/:id', (req, res) => {
    const id = req.params.id;
    db.owners.destroy({
      where: { id: id }
    })
      .then(deletedOwner => {
        res.json(deletedOwner);
      });
  });

  // DELETE multiple owners
  app.delete('/owners/bulk', (req, res) => {
    const ids = req.body.ids;
    db.owners.findAll({
      where: { id: { $in: ids } }
    })
      .then(owners => {
        const deletePromises = owners.map(owner => {
          return owner.destroy();
        });
        return db.Sequelize.Promise.all(deletePromises)
      })
      .then(deletedOwners => {
        res.json(deletedOwners);
      });
  });
};