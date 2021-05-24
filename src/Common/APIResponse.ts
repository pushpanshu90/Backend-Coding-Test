export function APIResponse(response: boolean, data: any) {
  const returnValue = {
    response: response,
  };

  if (response) {
    returnValue['data'] = data;
  } else {
    returnValue['message'] = data;
  }
  return returnValue;
}
