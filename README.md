# React Native + FastAPI + AG2 Full Stack Template

This is a comprehensive template for getting jumpstarted with an integrated full stack environment, with a React Native frontend and a FastAPI/AG2 backend. It's great for creating projects quickly and testing/iterating.

## Setup
First clone the template with a clean commit history by click the 'Use This Template' button and name your project. Next run 
```
git clone <your-project-directory>
cd your-project-directory
```
to create a local clone.

Next make sure you have the following dependencies installed: 

```
brew install node
brew install watchman
```

Next you can create your virtual environment, and install the necessary requirements

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Now the backend should be setup. To create the frontend, use our automated create-frontend.sh file:
First change the PROJECT_NAME variable to match the name of your project. Next from your root project directory run: 
```
./create-frontend.sh
```

## Run

Next, to start the project (using metro bundler), run
```
npm start
```
Finally, to start your uvicorn server, from your root directory simply run
```bash
python -m app.main
```
Then you can build the project in xcode and run it on a simulator!

## Working With ag2

For the start template to work, you must go into your config file (app/core/config) and change the parameters according to your system/preffered LLM. Refer to the ag2 user guide: https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/llm-configuration/ for more info. Happy coding!
