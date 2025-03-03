export function formatPhoneNumber(phoneNumber: string) {
  const filteredNumber = phoneNumber.replace(/[^0-9]/g, '');

  let formattedPhone = '';
  let offset = 0;

  if(filteredNumber.substring(0, 1) === '1') {
    formattedPhone += '+1 ';
    offset = 1;
  }

  if(filteredNumber.length > 10 + offset){
    formattedPhone += '('+filteredNumber.substring(0 + offset, 3 + offset) + ') ' +
      filteredNumber.substring(3 + offset, 6 + offset) + '-' +
      filteredNumber.substring(6 + offset, 10 + offset) + ' x' +
      filteredNumber.substring(10 + offset, filteredNumber.length);
  }
  else if(filteredNumber.length === 10 + offset){
    formattedPhone += '('+filteredNumber.substring(0 + offset, 3 + offset) + ') ' +
      filteredNumber.substring(3 + offset, 6 + offset) + '-' +
      filteredNumber.substring(6 + offset, filteredNumber.length);
  }
  else if(filteredNumber.length > 6 + offset){
    formattedPhone += '('+filteredNumber.substring(0 + offset, 3 + offset) + ') ' +
      filteredNumber.substring(3 + offset, 6 + offset) + '-' +
      filteredNumber.substring(6 + offset, filteredNumber.length);
  }
  else if(filteredNumber.length > 3 + offset){
    formattedPhone += '('+filteredNumber.substring(0 + offset, 3 + offset) + ') ' +
      filteredNumber.substring(3 + offset, filteredNumber.length);
  }
  else {
    formattedPhone += filteredNumber.substring(1, filteredNumber.length);
  }

  return { formattedPhone, filteredNumber };
}