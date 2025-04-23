const Usuario = require('../models/usuario');
const Transaccion = require('../models/transaccion');
const PDFKit = require('pdfkit');

exports.retirarForm = (req, res) => {
  if (!req.session.usuario) return res.redirect('/login');
  const user = req.session.usuario;
  res.render('retirar', { saldo: user.saldo });
};
exports.retirar = (req, res) => {
    console.log(req.body); // Verifica si el cuerpo contiene los datos esperados
    console.log(req.session.usuario.saldo); // Verifica si el usuario está en la sesión
    const { monto, metodo_pago } = req.body;

    if (!monto || !metodo_pago) {
        return res.send('Faltan datos importantes: monto o metodo_pago.');
    }

    const user = req.session.usuario;

    const saldoUsuario = parseFloat(user.saldo); 
    const montoRetiro = parseFloat(monto);
    console.log("saldo: " + saldoUsuario); // Verifica el saldo del usuario
    console.log("montoRetiro: " + montoRetiro); // Verifica el monto a retirar
    if (saldoUsuario >= montoRetiro) {
        const nuevoSaldo = saldoUsuario - montoRetiro;

        Usuario.updateSaldo(user.id, nuevoSaldo, (err) => {
            if (err) {
                console.error('Error al actualizar saldo:', err);
                return res.send('Error al actualizar saldo');
            }

            Transaccion.crear(user.id, montoRetiro, metodo_pago, (err) => {
                if (err) {
                    console.error('Error al registrar transacción:', err);
                    return res.send('Error al registrar transacción');
                }

                req.session.usuario.saldo = nuevoSaldo;
                req.session.montoRetirado = montoRetiro; // Guardar el monto retirado en la sesión
                res.redirect('/boleta');
            });
        });
    } else {
        console.log('Saldo insuficiente');
        return res.send('No tienes suficiente saldo');
    }
};

// Removed unused imports
const PdfPrinter = require('pdfmake');

// Definimos una fuente vacía genérica (obligatoria para que funcione pdfmake)
const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

const printer = new PdfPrinter(fonts);

const { create } = require('express-handlebars');

exports.boleta = (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const user = req.session.usuario;
    const monto = req.session.montoRetirado || 0;
    const saldoRestante = user.saldo;

    if (saldoRestante < 0) {
        return res.send('No tienes suficiente saldo para realizar esta operación.');
    }

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
            margin: [40, 20, 40, 0],
            columns: [

                {
                    text: 'Sistema de Pagos',
                    alignment: 'right',
                    fontSize: 12,
                    color: '#7f8c8d',
                    margin: [0, 30, 0, 0]
                }
            ]
        },
        footer: {
            margin: [40, 0, 40, 20],
            text: 'Contacto: soporte@pagos.com | www.pagos.com',
            alignment: 'center',
            fontSize: 10,
            color: '#7f8c8d'
        },
        content: [
            { text: 'BOLETA DE PAGO', style: 'header' },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, color: '#ecf0f1' }] },

            { text: 'Detalles de la Transacción', style: 'sectionTitle', margin: [0, 20, 0, 10] },
            {
                columns: [
                    [
                        { text: `Usuario: ${user.nombre}`, style: 'infoText' },
                        { text: `Monto Retirado: ${monto} soles`, style: 'infoText' },
                        { text: `Saldo Restante: ${saldoRestante} soles`, style: 'infoText' },
                        { text: `Fecha: ${new Date().toLocaleString()}`, style: 'infoText' }
                    ],
                    {
                        qr: `Usuario: ${user.nombre}, Monto: ${monto} soles, Fecha: ${new Date().toLocaleString()}`, // QR opcional
                        fit: 80,
                        alignment: 'right',
                        margin: [0, 0, 0, 0]
                    }
                ]
            },

            {
                style: 'tableExample',
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'Resumen', style: 'tableHeader', fillColor: '#f5f6fa' },
                            { text: '', fillColor: '#f5f6fa' }
                        ],
                        [
                            { text: `Monto: ${monto} soles`, style: 'tableText' },
                            { text: `Saldo: ${saldoRestante} soles`, style: 'tableText' }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#dfe4ea',
                    vLineColor: () => '#dfe4ea',
                    fillColor: (rowIndex) => (rowIndex === 0 ? '#f5f6fa' : '#ffffff')
                }
            },

            { text: 'Gracias por usar nuestro servicio', style: 'footerText', margin: [0, 20, 0, 0] }
        ],
        styles: {
            header: {
                fontSize: 24,
                bold: true,
                alignment: 'center',
                color: '#2c3e50',
                margin: [0, 20, 0, 10]
            },
            sectionTitle: {
                fontSize: 16,
                bold: true,
                color: '#34495e',
                margin: [0, 10, 0, 5]
            },
            infoText: {
                fontSize: 12,
                color: '#2c3e50',
                margin: [0, 5, 0, 5]
            },
            tableHeader: {
                fontSize: 12,
                bold: true,
                color: '#2c3e50',
                alignment: 'left',
                margin: [5, 5, 5, 5]
            },
            tableText: {
                fontSize: 12,
                color: '#2c3e50',
                margin: [5, 5, 5, 5]
            },
            footerText: {
                fontSize: 12,
                alignment: 'center',
                color: '#7f8c8d'
            }
        },
        defaultStyle: {
            font: 'Helvetica',
            lineHeight: 1.2
        },

    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Disposition', 'attachment; filename="boleta.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
};