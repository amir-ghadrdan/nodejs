FROM node

WORKDIR /app

COPY package.json .
# == COPY package.json /app

# add nodemon to package.json for dependency
# RUN npm install

# build in enother .yml
ARG NODE_ENV
RUN if [ $NODE_ENV = development ]; \
        then npm install; \
        else npm install --only=production; \
        fi


COPY . ./
#
# اگر دو تا کار یکسان و در چند لایه انجام دهیم داکر با سیستم کش بهینه است  و تکراری نمیکند

# اگر مثلا لایه ی سوم پکیج جیسون تغییر کند خودکار تنها همان خط دوباره ران میشود


# INSTEAD ENV FILE
ENV PORT 3000

EXPOSE $PORT
# PORT LOCAL


# run in the dev mode
# change the script in package.json

# CMD [ "npm","run","dev" ]

# for real time run node app 



# default
# in docker-compose command write
CMD [ "node","index.js"]

