## Transaction Management Repository
Author: Jędrzej Siewierski

# Before starting

1. Create a `.env.` file from the `.env.example` file in each directory

# Project Structure

Main structure of this repository contains 2 apps:
 - [Frontend](frontend-transactional-management)
 - [Backend](backend-transactional-management)


# Technologies
  - Nest.js
  - Next.js
  - Docker & Docker Compose
  - Postgres

I have choose Next.js and Nest.js as main technologies.
Nest.js provides many extra features and requires from developer keeping good practices and modularity. Additional benefit is that it is very similar to Spring Framework what can be much more developer friendly for Java oriented programmers.

Next.js is SSR framework based on React.js technology which has most of market what makes project easy to developed by anyone and have big community. Additional we can use all benefits to boost fe with SEO.

Postgres is relational database which allows as keep data in structured way.

# Choosen libraries
   - zod it is for validation purposes, easy interface
   - typeORM -> good ORM for small project without complicated queries(to replace by raw if project will grow up)
   - axios http calls
  
# How to run this project?
1. Install dependencies in the Root, FE, BE directories

  ```
    npm i
  ```
2. Run Database by Docker Compose

  ```
  sudo docker compose up
  ```

3. Run migration Files for your postgres database
   
  ```
  cd backend-transactional-management
    npm run migration:run
  ```
4. Run in root dir in separate terminal windows
  ```
  npm run start:be
  npm run start:fe
  ```
5. Congrats!! You should be able check
  - Swagger API http://localhost:3000/api
  - Frontend App on http://localhost:3001

Enjoy!
