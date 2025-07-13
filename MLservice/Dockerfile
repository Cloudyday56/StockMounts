# MLservice Dockerfile

FROM python:3.10-slim

# set working directory
WORKDIR /app

# copy requirements.txt
COPY requirements.txt .

# install dependencies
RUN pip install -r requirements.txt

# copy the rest of the application code (EVERYTHING)
COPY . .

# Set port environment variable
ENV PORT=8000
# expose the port so it can be used
EXPOSE 8000

# RUN the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
