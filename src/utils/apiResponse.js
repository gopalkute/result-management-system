class ApiResponse {
   // create an object for send response to the frontend
   constructor(message, data = {}) {
      this.success = true;
      this.message = message;
      this.data = data;
   }
}

class ApiError {
   // create an object for send error to the frontend
   constructor(message, error = "", statusCode = 400) {
      this.success = false;
      this.message = message;
      this.error = error;
      this.statusCode = statusCode;
   }
}

module.exports = { ApiResponse, ApiError };
