FROM node:lts

# Set workdir
WORKDIR /usr/app

# Copy dependencies
COPY package.json .
COPY yarn.lock .

RUN apt-get update && apt-get install -yq libgconf-2-4

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init
# ENTRYPOINT ["dumb-init", "--"]
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install the dependecies
RUN yarn install --frozen-lockfile

# Copy missing source files
COPY . /usr/app

# Compile
RUN yarn build

# RUN groupadd -r user && useradd -r -g user -G audio,video user \
#     && mkdir -p /home/user/Downloads \
#     && chown -R user:user /home/user \
#     && chown -R user:user /usr/app/node_modules

# USER user

# Run the service
CMD [ "node", "dist/index.js" ]
EXPOSE 8080
