#!/usr/bin/python
from bs4 import BeautifulSoup
import urllib2
import os, sys
import sqlite3

conn = sqlite3.connect('database.db')
db = conn.cursor()

def init():
	init_db()
	url = 'http://aviationweather.gov/products/nws/winds/?area=chicago&fint=06'
	usock = urllib2.urlopen(url)
	source = usock.read()
	usock.close()
	soup = BeautifulSoup(source)
	parse(soup)

def parse(soup):
	content = soup.find('pre')
	if content is None:
		exit("Nothing")
	blob = content.get_text().split('\n')
	altitudes = [0,3000,6000,9000,12000,18000,24000,30000,34000,39000]
	for line in blob:
		if len(line) == 69 and not (line.startswith('FT')):
			line = line.replace('     ',' 0000')
			line = line.replace('   ',' 0000')
			data_strings = line.split(' ')
			airport_code = data_strings[0]
			for data,altitude in zip(data_strings, altitudes):
				if len(data) == 3:
					pass
				else:
					if int(data[:2]) >= 36:
						# Winds are OVER 99 knots. Follow WMO nomenclature: http://en.wikipedia.org/wiki/Winds_aloft
						# Subtract 50 from DD, add 100 to SS
						direction = str((int(data[:2]) - 50)) + '0'
						speed = (int(data[2:4]) + 100)
					else:
						# Standard DDss format.
						direction = data[:2] + '0'
						speed = data[2:4]
						#insert_db(airport_code, int(direction), int(speed))
					print "Airport: {} Height: {} Dir: {} Speed {}".format(airport_code, altitude, direction, speed)

		# Check we have an airport code and 3000ft data
		'''
		for data in data_string:
			print line
			if (len(data_string[0]) == 3 and data_string[1]):
				airport_code = data_string[0]
				direction_speed = data_string[1]
				direction = direction_speed[:2] + '0'
				speed = direction_speed[2:]
				#insert_db(int(i), airport_code, int(direction), int(speed))
				i+=1
			else:
				pass
		conn.commit()
		'''

def init_db():
	db.execute('''DROP TABLE IF EXISTS winds''')
	db.execute('''CREATE TABLE winds
		(id INTEGER, airport_code STRING, direction INTEGER, speed INTEGER)''')

def insert_db(wind_id, airport_code, direction, speed):
	query = '''INSERT INTO winds VALUES ("%d", "%s","%d","%d")''' % (wind_id, airport_code, direction, speed)
	db.execute(query)

if __name__ == '__main__':
		init()
