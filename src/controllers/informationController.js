module.exports = {
    backout: (req, res) => {
        res.render('messagePremiumStandard')
    },
    clothWidth: (req, res) => {
      const items = [
        {name:"Blackout Premium / Screen 5% / Venecia Blackout / Monaco / Marsella / Paris",width:2.50},
        {name:"Kenia / Noruega / Belgica natural y marron / Ibiza / Congo / Marsella",width:2.00},
        {name:"Eclipse lino",width:2.00},
        {name:"Eclipse blanco",width:1.60},
        {name:"Blackout Standard",width:1.60},
        {name:"Blackout Blanco",width:1.30}
    ]
      res.render("clothWidth", { items });
    },
}
