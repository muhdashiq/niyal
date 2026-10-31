type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

// Arabic alone has six forms, so each language lists the ones it uses and the rules pick one.
export const plural = (locale: string, count: number, forms: PluralForms) =>
  forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;
