module.exports = {
    sendOrder : (req,res) => {
        return res.render('success', {
            title : '¡Pedido enviado con éxito!',
            text : 'A la brevedad recibirá un e-mail con el detalle del pedido. En caso de no recibirlo, comuníquese con la fábrica.',
            icon : 'success'
        })
    }
}