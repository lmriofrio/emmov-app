class PayOrder {
  constructor(placa) {
    this.placa = placa;
    this.resultados = [];
  }

  calcularValores(tramite) {
    const propiedadesComunes = {
      cantidad: 1,
      valor_u: 0,
    };

    const conceptos = {
      1: { concepto: 'Rodaje', valor_u: 5 },
      2: { concepto: 'Revisión técnica', valor_u: 26.58 },
      3: { concepto: 'Sticker', valor_u: 5 },
      4: { concepto: 'Improntas', valor_u: 9 },
      5: { concepto: 'Emisión de matrícula', valor_u: 30 },
    };


    if (tramite === 'TRANSFERENCIA DE DOMINIO') {
      this.resultados = [
        { id: 4, ...propiedadesComunes, ...conceptos[4] },
        { id: 5, ...propiedadesComunes, ...conceptos[5] },
      ];
    } else if (tramite === 'TRANSFERENCIA DE DOMINIO Y REVISIÓN ANUAL') {
      this.resultados = [
        { id: 1, ...propiedadesComunes, ...conceptos[1] },
        { id: 5, ...propiedadesComunes, ...conceptos[5] },
        { id: 4, ...propiedadesComunes, ...conceptos[4] },
        { id: 2, ...propiedadesComunes, ...conceptos[2] },
        { id: 3, ...propiedadesComunes, ...conceptos[3] },
      ];
    } else if (tramite === 'EMISION DEL DOCUMENTO ANUAL DE CIRCULACION') {
      this.resultados = [
        { id: 1, ...propiedadesComunes, ...conceptos[1] },
        { id: 2, ...propiedadesComunes, ...conceptos[2] },
        { id: 3, ...propiedadesComunes, ...conceptos[3] },
      ];
    }


    this.resultados.forEach(resultado => {
      resultado.valor_f = resultado.cantidad * resultado.valor_u;
    });
  }

  obtenerReporte() {
    console.log(`Reporte para la placa ${this.placa}:`);
    this.resultados.forEach(resultado => {
      console.log(`${resultado.concepto}: ${resultado.valor_f}`);
    });
  }
}

module.exports = PayOrder;