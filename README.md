# ♫ Note

Search for song lyrics to highlight sections and annotate for meaning.

Search song lyrics.

![](https://j.gifs.com/nxlJEW.gif)


Annotate

![](https://j.gifs.com/0YMoRX.gif)

## Getting Started
### Prerequisites
* Python3
* PostgreSQL
* Genius.com API key https://genius.com/developers

### Installation
* Clone repository

    `$ git clone https://github.com/dominiquecuevas/Note`
    
* Create database

    `$ createdb lyrics`

* Create a Virtual Environment

    `$ virtualenv env`
    
  Command on a Windows machine:
    
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
    
