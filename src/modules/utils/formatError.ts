export default (message: string, error: Error): void => {
  console.log(message + ' - "' + error.message + '"')
}
