import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';

export function generateRandomPassword(length = 8) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return password;
}

export function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
export function validatePhoneNumber(
  phone: string,
  countryCode: string,
): boolean {
  const parsedCountryCode = countryCode as CountryCode;
  const phoneNumber = parsePhoneNumberFromString(phone, parsedCountryCode);
  if (!phoneNumber || !phoneNumber.isValid()) {
    return false;
  }

  return true;
}

export function generate4digitsCode() {
  return Math.floor(1000 + Math.random() * 9000);
}
