// export default function (response: any, success: Function, on404: Function, otherError: Function): void {
//     const data = response.data;
//     const error = response.error;
//     if (data.value) {
//         success(data);
//     } else {
//         if (error.value.statusCode === 404) {
//             on404();
//         } else {
//             otherError();
//         }
//     }
// }