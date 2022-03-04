module.exports = {
    sendOrder : (req,res) => {
        return res.render('success', {
            title : '¡Pedido enviado con éxito!',
            text : 'Recibirá un mail con el detalle del pedido',
            icon : 'success'
        })
    }
}