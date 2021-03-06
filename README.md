# ♫ Note

Full stack web app enables users to search song lyrics to highlight and annotate sections for their meaning.

## Video Demo
▷ https://drive.google.com/file/d/1gmugbYmrAkNb3R2hAiJjYQNO6FHjHab9/view?usp=sharing

## Getting Started
### Prerequisites
* Python3
* PostgreSQL
* Genius.com API token https://genius.com/developers

### Installation
* Clone repository

    `$ git clone https://github.com/dominiquecuevas/Note`
    
* Create database

    `$ createdb lyrics`

* Create a Virtual Environment

    `$ virtualenv env`
    
  Command if on a Windows machine:
    
    `$ virtualenv env --always-copy`
    
* Activate virtual environment

    `$ source env/bin/activate`

* Create a secrets.sh file with your Genius.com token

    `$ touch secrets.sh`

    ```python
    export TOKEN=[CLIENT ACCESS TOKEN]
    ```
* Load token into shell environment

    `$ source secrets.sh`
    
* Install dependencies

    `$ pip install -r requirements.txt`
    
* Run the app

    `$ python3 server.py`
    
