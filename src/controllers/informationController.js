const fs = require('fs');
const path = require("path");

const db = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  backout: (req, res) => {
    res.render("messagePremiumStandard");
  },
  width: async (req, res) => {
    const items = await db.Cloth.findAll({ where: { visible: true, width: {[Op.gt] : 0} },order:[['name','ASC']] });
    res.render("clothWidth", { items, total: items.length });
  },
  search: async (req, res) => {
    const items = await db.Cloth.findAll({
      where: {
        visible: true,
        width : {
          [Op.gt] : 0
        },
        name: {
            [Op.like]: `%${req.query.search}%`,
          }
      },
      order:[['name','ASC']]
    });
    res.render("clothWidth", {
      items,
      keywords: req.query.search,
      total: items.length,
    });
  },
  updatePackaging : async (req,res) => {
    req.session.packaging = +req.body.packaging;
    await db.Package.update(
      {
        price : req.body.packaging
      },
      {
        where : {id : 1}
      }
    )
    console.log('>>>>>>', req.session.packaging)
    return res.json({
      packaging : req.session.packaging
    })
   /*  fs.writeFileSync(path.resolve(__dirname,'..','data','packaging.json'),JSON.stringify(req.session.packaging));
    return res.json({
      packaging : req.session.packaging
    }) */
  },
  getPackaging : async (req,res) => {
   /*  req.session.packaging = JSON.parse(fs.readFileSync(path.resolve(__dirname,'..','data','packaging.json')));
    console.log('====================================');
    console.log(req.session.packaging);
    console.log('====================================');
    return res.json(req.session.packaging); */
    try {
      let package = await db.Package.findByPk(1);
      req.session.packaging = +package.price;
      return res.json(req.session.packaging)
    } catch (error) {
      console.log(error)
    }
  
  }
};
