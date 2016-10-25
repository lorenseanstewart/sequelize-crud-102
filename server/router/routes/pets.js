'use strict';

module.exports = (app, db) => {
  // GET all pets
  app.get('/pets', (req, res) => {
    db.pets.findAll()
      .then(pets => {
        res.json(pets);
      });
  });

  // GET one pet by id
  app.get('/pet/:id', (req, res) => {
    const id = req.params.id;
    db.pets.find({
      where: { id: id }
    })
      .then(pet => {
        res.json(pet);
      });
  });

  // POST search route
  app.post('/pets', (req, res) => {
    const query = req.body.query;
    db.pets.findAll({
      where: query
    })
      .then(pets => {
        res.json(pets);
      });
  });

  // POST single pet
  app.post('/pet', (req, res) => {
    console.log('hihi', req.body)
    const name = req.body.name;
    const owner_id = req.body.owner_id;
    const type = req.body.type;
    db.pets.create({
      name: name,
      owner_id: owner_id,
      type: type
    })
      .then(newPet => {
      res.json(newPet);
    });
  });

  // POST multiple owners
  app.post('/pets/bulk', (req, res) => {
    const petList = req.body.pets;
    db.pets.bulkCreate(petList)
      .then(newPets => {
        res.json(newPets);
      })
  });

  // PATCH single pet
  app.patch('/pet/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body.updates;
    db.pets.find({
      where: { id: id }
    })
      .then(pet => {
        return pet.updateAttributes(updates);
      })
      .then(updatedPet => {
        res.json(updatedPet);
      });
  });

  // PATCH multiple pets
  app.patch('/pets/bulk', (req, res) => {
    const ids = req.body.ids;
    const updates = req.body.updates;
    db.pets.findAll({
      where: { id: { $in: ids } }
    })
      .then(pets => {
        const updatePromises = pets.map(pet => {
          return pet.updateAttributes(updates);
        });
        return db.Sequelize.Promise.all(updatePromises)
      })
      .then(updatedPets => {
        res.json(updatedPets);
      });
  });

  app.delete('/pet/:id', (req, res) => {
    const id = req.params.id;
    db.pets.destroy({
      where: { id: id }
    })
      .then(deletedPet => {
        res.json(deletedPet);
      });
  });

  // DELETE multiple pets
  app.delete('/pets/bulk', (req, res) => {
    const ids = req.body.ids;
    db.pets.findAll({
      where: { id: { $in: ids } }
    })
      .then(pets => {
        const deletePromises = pets.map(pet => {
          return pet.destroy();
        });
        return db.Sequelize.Promise.all(deletePromises)
      })
      .then(deletedPets => {
        res.json(deletedPets);
      });
  });

};