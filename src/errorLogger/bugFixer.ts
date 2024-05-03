import { AxiosError } from "axios";

function LogError(err: object | undefined | unknown) {
  const axiosError = err as AxiosError;
  if (axiosError.response) {
    const responseData = axiosError.response.data as { message: string };
    alert(responseData.message);
  } else {
    // Handle other types of errors here
    alert(axiosError.message);
  }
}

export default LogError