import bcrypt from "bcryptjs";
let password = await bcrypt.hash("gopal", 10);
password = await bcrypt.hash(password, 10);
console.log(password);
