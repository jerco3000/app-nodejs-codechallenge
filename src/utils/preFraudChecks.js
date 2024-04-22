// src/utils/preFraudChecks.js

/**
 * Función para verificar si una transacción debe ser rechazada basada en reglas simples.
 * @param {Object} transactionData
 * @returns {Boolean} - Retorna true/false
 */
/**
* Por lo general recomiendo utilizar una gestion centralizada para reglas de negocio,
* pero dado que en la prueba se menciona la preocupacion por el volumen de transacciones y se especifica una regla clara para rechazar una transaccion
* se ha implementado estas reglas de 'preFraudCheck'
* */

exports.shouldRejectTransaction = (transactionData) => {
    const { value } = transactionData;

    // Rechazar transacciones con un valor mayor a 1000
    if (value > 1000) {
        console.log('Transaccion excede valor preFraudCheck');
        return true;
    }

    // Aquí otras reglas

    return false;
};
