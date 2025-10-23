# Fragancias API

API built with Node.js, Express and Mongoose, following an MVC layered architecture. This project is designed to be robust, scalable, and easy to maintain.

---

## 🚀 Used Technologies

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

![JWT](https://img.shields.io/badge/JSON%20Web%20Token-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-005B96?style=for-the-badge&logo=security&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6B6B?style=for-the-badge&logo=upload&logoColor=white)

![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

## 🧪 Testing Stack

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-000000?style=for-the-badge&logo=mocha&logoColor=white)
![MongoMemoryServer](https://img.shields.io/badge/MongoDB%20Memory%20Server-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

The project includes both automated and manual testing tools to ensure API reliability and data integrity.

**Testing layers:**
- 🔹 **Unit tests:** utilities and service logic (using Jest mocks)
- 🔹 **Integration tests:** DAO, controllers, and routes (using Supertest + MongoDB Memory Server)
- 🔹 **Manual testing:** performed with Postman collections for endpoint validation
- 🔹 **Setup:** preconfigured Jest environment with in-memory MongoDB


## 📚 API Documentation

Interactive documentation and testing tools:

//TODO
- 🧩 **Swagger UI** — available at:  
  👉 [`/api-docs`](http://localhost:3000/api-docs)  
  *(auto-generated from JSDoc comments)*

//TODO
- 💼 **Postman Collection** — available soon at:  
  🔗 [View on Postman](#)  
  *(A complete collection with all API endpoints will be published here.)*

## 🧹 Code Quality
Linting and style enforcement with **ESLint (Airbnb base rules)**.  
Automatically runs on save and before each development start.

## 🔒 Security
The API includes multiple layers of protection:
- HTTP headers (Helmet)
- Input sanitization (XSS Clean, Mongo Sanitize)
- Rate limiting (express-rate-limit)
- HPP to prevent HTTP Parameter Pollution

## 🧰 Development Tools
- **Nodemon:** hot reload during development  
- **Dotenv:** environment variable management  
- **ESLint:** static analysis and style enforcement

## 💻 Frontend

API consumed by: https://github.com/GuilhermeARCora/fragranciasFront
