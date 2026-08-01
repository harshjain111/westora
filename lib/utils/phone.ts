/**
 * Best-effort E.164 normalisation without a phone-parsing library — none
 * was in the approved dependency list (build playbook Prompt 2). Strips
 * everything but digits and a leading `+`, then prefixes the supplied
 * dial code if the number doesn't already start with one. This is not as
 * rigorous as libphonenumber (it can't validate a number is a real,
 * dialable number for its country), but is sufficient to get a
 * consistently-formatted value into storage and onto a `tel:`/`wa.me`
 * link.
 */
export function normalizeToE164(rawPhone: string, dialCode: string): string {
  const digitsOnly = rawPhone.replace(/[^\d+]/g, "");

  if (digitsOnly.startsWith("+")) {
    return digitsOnly;
  }

  const dialDigits = dialCode.replace(/[^\d]/g, "");
  const localDigits = digitsOnly.replace(/^0+/, ""); // drop a leading trunk 0

  return `+${dialDigits}${localDigits}`;
}
