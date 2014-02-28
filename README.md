##Winds Aloft (Again...)
*D3JS, Flask, Beautiful Soup, Jquery and Sqlite3*

##Who it matters for
Well I like to skydive, but anyone who needs to know wind speeds could find some use in this.

##Why it is useful
The World Meteorological Organization [nomenclature](http://en.wikipedia.org/wiki/Winds_aloft#Example) specifies the wind speed, direction, and temperature in a silly way.
I scrape it from their site 4 times daily (when it is updated), parse it, then display it.

##Where is the data coming from
[NOAA makes it available here](http://aviationweather.gov/products/nws/all)
It covers the contintental US.

##Why are you so bad at javascript?
Sucking at something is the first step towards actually being kinda good at something.

###How do I get started?
- Install pip, virtualenv, and python
- `virtualenv venv`
- `source ./venv/bin/activate`
- `python app.py`

###Getting fresh data
Run the scraper.
`python db_scrape.py`
