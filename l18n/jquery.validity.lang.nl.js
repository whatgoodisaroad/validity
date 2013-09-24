$.extend($.validity.messages, {
  require:"#{field} is vereist.",

  // Format validators:
  match:"#{field} is in een ongeldig formaat.",
  integer:"#{field} moet een positief, heel getal zijn.",
  date:"#{field} moet zijn opgesteld als een datum. (mm/dd/yyyy)",
  email:"#{field} moet zijn opgesteld als een email.",
  usd:"#{field} moet zijn opgesteld als een US Dollar bedrag.",
  url:"#{field} moet zijn opgesteld als een URL.",
  number:"#{field} moet zijn opgesteld als een nummer.",
  zip:"#{field} moet zijn opgesteld als een postcode ##### of #####-####.",
  phone:"#{field} moet zijn opgesteld als een telefoonnummer ###-###-####.",
  guid:"#{field} moet zijn opgesteld als een willekeurig getal zoals {3F2504E0-4F89-11D3-9A0C-0305E82C3301}.",
  time24:"#{field} moet zijn opgesteld als een 24 uurs tijd: 23:00.",
  time12:"#{field} moet zijn opgesteld als een 12 uurs tijd: 12:00 AM/PM",

  // Value range messages:
  lessThan:"#{field} moet minder zijn dan #{max}.",
  lessThanOrEqualTo:"#{field} moet minder zijn dan of gelijk aan #{max}.",
  greaterThan:"#{field} moet groter zijn dan #{min}.",
  greaterThanOrEqualTo:"#{field} moet groter zijn dan of gelijk zijn aan #{min}.",
  range:"#{field} moet zijn tussen #{min} en #{max}.",

  // Value length messages:
  tooLong:"#{field} mag niet langer zijn dan #{max} karakters.",
  tooShort:"#{field} mag niet korter zijn dan #{min} karakters.",

  // Composition validators:
  nonHtml:"#{field} mag geen HTML karakters bevatten.",
  alphabet:"#{field} bevat niet toegestane karakters.",

  minCharClass:"#{field} mag niet meer karakters bevatten dan #{min} #{charClass}.",
  maxCharClass:"#{field} mag niet minder karakters bevatten dan #{min} #{charClass}.",

  // Aggregate validator messages:
  equal:"Waarden komen niet overeen.",
  distinct:"Een waarde is herhaald.",
  sum:"Waarden sluiten niet aan op #{sum}.",
  sumMax:"De som van de waarden moeten minder zijn dan #{max}.",
  sumMin:"De som van de waarden moeten groter zijn dan #{min}.",

  // Radio validator messages:
  radioChecked:"De geselecteerde waarde is niet geldig.",

  generic:"Ongeldig."
});

$.validity.setup({ defaultFieldName:"Dit veld", }); 
