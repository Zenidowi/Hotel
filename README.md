##Server Start
cd backend;
.venv\Scripts\activate;
pip install -r requirements.txt
cd app;
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

##Frontend Start
cd frontend
npm i
npm start
