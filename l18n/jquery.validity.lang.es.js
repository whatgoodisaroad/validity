$.extend($.validity.messages, {
    require:"#{field} requerido.",
    // Format validators:
    match:"#{field} está en un formato no válido.",
    integer:"#{field} debe ser un número entero positivo.",
    date:"#{field} debe ser una fecha.",
    email:"#{field} debe ser una dirección de email.",
    usd:"#{field} debe ser uan cantidad en dólares USA.",
    url:"#{field} debe ser una dirección URL.",
    number:"#{field} debe ser un número.",
    zip:"#{field} debe ser un código postal ##### o #####-####.",
    phone:"#{field} debe ser un número de teléfono ###-###-####.",
    guid:"#{field} debe ser un GUID del tipo {3F2504E0-4F89-11D3-9A0C-0305E82C3301}.",
    time24:"#{field} debe ser una hora en formato de 24 horas (ej.: 23:00).",
    time12:"#{field} debe ser una hora en formato de 12 horas (ej.:12:00 AM/PM)",

    // Value range messages:
    lessThan:"#{field} debe ser inferior a #{max}.",
    lessThanOrEqualTo:"#{field} debe ser inferior o igual a #{max}.",
    greaterThan:"#{field} debe ser superior a #{min}.",
    greaterThanOrEqualTo:"#{field} debe ser superior o igual a #{min}.",
    range:"#{field} debe estar comprendido entre #{min} y #{max}.",

    // Value length messages:
    tooLong:"#{field} no debe superar los #{max} caracteres.",
    tooShort:"#{field} debe contener como mínimo #{min} caracteres.",

    // Composition validators:
    nonHtml:"#{field} no debe contener caracteres HTML.",
    alphabet:"#{field} contiene caracteres prohibidos.",

    minCharClass:"#{field} no debe contener más de #{min} caracteres {#}charclass.",
    maxCharClass:"#{field} no debe contener menos de #{min} caracteres #{charClass}.",

    // Aggregate validator messages:
    equal:"Los valores no coinciden.",
    distinct:"Un valor se repite.",
    sum:"La suma de los valores difiere de #{sum}.",
    sumMax:"La suma de los valores debe ser inferior a #{max}.",
    sumMin:"La suma de los valores debe ser superior a #{min}.",

    // Radio validator messages:
    radioChecked:"El valor seleccionado no es válido.",

    generic:"No válido."
});

$.validity.setup({ defaultFieldName:"Este campo", });
