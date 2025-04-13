class ApiResponse {
   constructor(message = "Success", data) {
      this.success = true;
      this.message = message;
      this.data = data;
   }
}

class ApiError {
   constructor(message = "Something went wrong") {
      this.success = false;
      this.message = message;
   }
}

export { ApiResponse, ApiError };
