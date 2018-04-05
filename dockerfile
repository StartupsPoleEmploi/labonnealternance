FROM ubuntu:16.04

# Update apt-cache
RUN apt-get update
RUN apt-get -y install curl

# Install python 3
RUN apt-get -y install python3 python3-pip
RUN pip3 install --upgrade pip

# Install NodeJS and create-react-app
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g create-react-app

# # Create /code/ folder
RUN mkdir /labonnealternance

# Install Python requirements
# Note : before ADD . /code/ in order to update requirement only if necessary
ADD requirements.txt /code/
RUN pip3 install -r /code/requirements.txt

# Copy all the folder
ADD . /code/

# Build React Project
WORKDIR /code/frontend/
RUN npm install
RUN npm run build

# Start application
WORKDIR /code/

CMD "python manage.py runserver 0.0.0.0:8000"