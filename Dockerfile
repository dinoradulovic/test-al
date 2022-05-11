FROM node:9.3.0
WORKDIR /app  
COPY ./dist .
RUN npm i
EXPOSE 3000
ENV NODE_ENV=production
CMD ["./start.sh"]